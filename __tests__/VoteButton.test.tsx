import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import VoteButton from "@/components/VoteButton";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { voteKarya, unvoteKarya } from "@/lib/api/karya";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("@/lib/api/auth", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    success: true,
    data: { id: 1, name: "Gamer 1", email: "gamer1@test.com" },
  }),
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
}));

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

describe("VoteButton", () => {
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
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>,
    );
  });

  it("renders with initial vote count and redirects guest to login on click", () => {
    render(
      <AuthProvider>
        <VoteButton slug="cyber-runner" initialVotesCount={10} />
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /beri vote/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("10");

    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/login?redirect="),
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("action=vote&slug=cyber-runner"),
    );
  });

  it("submits vote for authenticated user and updates UI to voted state", async () => {
    localStorage.setItem("p2r_auth_token", "valid-user-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Gamer 1" }),
    );

    mockedVoteKarya.mockResolvedValueOnce({
      success: true,
      message: "Vote recorded",
      data: { votes_count: 11, voted: true },
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
    });
  });

  it("reconciles state on 409 Conflict when user already voted", async () => {
    localStorage.setItem("p2r_auth_token", "valid-user-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Gamer 1" }),
    );

    mockedVoteKarya.mockRejectedValueOnce(
      new ApiError("Already voted.", { status: 409 }),
    );

    render(
      <AuthProvider>
        <VoteButton slug="cyber-runner" initialVotesCount={10} />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /beri vote/i }));

    await waitFor(() => {
      expect(screen.getByText(/voted \(10\)/i)).toBeInTheDocument();
      expect(
        screen.getByText(/kamu telah memberikan vote untuk karya ini/i),
      ).toBeInTheDocument();
    });
  });

  it("does NOT falsify voted state when backend or network fails with 500", async () => {
    localStorage.setItem("p2r_auth_token", "valid-user-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Gamer 1" }),
    );

    mockedVoteKarya.mockRejectedValueOnce(
      new ApiError("Internal Server Error", { status: 500 }),
    );

    render(
      <AuthProvider>
        <VoteButton slug="cyber-runner" initialVotesCount={10} />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /beri vote/i }));

    await waitFor(() => {
      expect(screen.getByText(/beri vote \(10\)/i)).toBeInTheDocument();
      expect(
        screen.getByText(/gagal memproses vote\. silakan coba lagi\./i),
      ).toBeInTheDocument();
    });
  });

  it("cancels vote (unvotes) when an already voted button is clicked", async () => {
    localStorage.setItem("p2r_auth_token", "valid-user-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Gamer 1" }),
    );

    mockedUnvoteKarya.mockResolvedValueOnce({
      success: true,
      message: "Vote removed",
      data: { votes_count: 10, voted: false },
    });

    render(
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

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedUnvoteKarya).toHaveBeenCalledWith(
        "cyber-runner",
        "valid-user-token",
      );
      expect(screen.getByText(/beri vote \(10\)/i)).toBeInTheDocument();
    });
  });
});
