import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import VoteButton from "@/components/VoteButton";
import { AuthProvider } from "@/lib/auth/auth-context";
import { voteKarya, unvoteKarya } from "@/lib/api/karya";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("@/lib/api/karya", () => ({
  voteKarya: jest.fn(),
  unvoteKarya: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockedVoteKarya = voteKarya as jest.MockedFunction<typeof voteKarya>;
const mockedUnvoteKarya = unvoteKarya as jest.MockedFunction<typeof unvoteKarya>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe("VoteButton Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      bfcacheId: "",
    });
    mockedUseSearchParams.mockReturnValue(new URLSearchParams() as any);
  });

  it("renders with initial vote count, aria-pressed=false, and redirects guest to login on click", () => {
    render(
      <AuthProvider>
        <VoteButton slug="cyber-runner" initialVotesCount={10} />
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /beri vote/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("10");
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/login?redirect="),
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("action=vote&slug=cyber-runner"),
    );
  });

  it("submits vote for authenticated user, updates count, and auto-dismisses feedback after 4s", async () => {
    jest.useFakeTimers();

    localStorage.setItem("p2r_auth_token", "valid-user-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Gamer 1" }),
    );

    mockedVoteKarya.mockResolvedValueOnce({
      success: true,
      message: "Vote recorded",
      data: { votes_count: 11, is_voted_by_me: true },
    });

    render(
      <AuthProvider>
        <VoteButton slug="cyber-runner" initialVotesCount={10} />
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /beri vote/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedVoteKarya).toHaveBeenCalledWith(
        "cyber-runner",
        "valid-user-token",
      );
      expect(screen.getByText(/voted \(11\)/i)).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    // Feedback should be visible initially
    expect(
      screen.getByText(/vote kamu berhasil dicatat!/i),
    ).toBeInTheDocument();

    // Fast-forward timer by 4000ms
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(
      screen.queryByText(/vote kamu berhasil dicatat!/i),
    ).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("cancels vote (unvotes) when an already voted button is clicked and cleans timer on unmount", async () => {
    localStorage.setItem("p2r_auth_token", "valid-user-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Gamer 1" }),
    );

    mockedUnvoteKarya.mockResolvedValueOnce({
      success: true,
      message: "Vote removed",
      data: { votes_count: 10, is_voted_by_me: false },
    });

    const { unmount } = render(
      <AuthProvider>
        <VoteButton
          slug="cyber-runner"
          initialVotesCount={11}
          initialIsVoted={true}
        />
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /batalkan vote/i });
    expect(button).toHaveTextContent("Voted (11)");
    expect(button).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedUnvoteKarya).toHaveBeenCalledWith(
        "cyber-runner",
        "valid-user-token",
      );
      expect(screen.getByText(/beri vote \(10\)/i)).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    // Unmount safely without timer memory leak errors
    expect(() => unmount()).not.toThrow();
  });
});
