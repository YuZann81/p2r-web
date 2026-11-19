import { fireEvent, render, screen, act } from "@testing-library/react";
import GameShowcase from "@/components/GameShowcase";
import { GAMES } from "@/lib/content";

describe("GameShowcase", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("renders heading GAME and mainkan game link for the active game", () => {
    render(<GameShowcase games={[...GAMES]} />);

    expect(screen.getByText("GAME")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lihat Semua Game" })).toHaveAttribute(
      "href",
      "/games",
    );

    const playLinks = screen.getAllByRole("link", { name: /mainkan game/i });
    expect(playLinks.length).toBeGreaterThan(0);
  });

  it("advances to the next game when right arrow button is clicked", () => {
    render(<GameShowcase games={[...GAMES]} />);

    const nextButtons = screen.getAllByRole("button", {
      name: /game berikutnya/i,
    });
    expect(nextButtons.length).toBeGreaterThan(0);

    fireEvent.click(nextButtons[0]);

    // Fast-forward animation timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    const playLinks = screen.getAllByRole("link", { name: /mainkan game/i });
    expect(playLinks[0]).toHaveAttribute("href", `/games/${GAMES[1].id}`);
  });

  it("returns null when games array is empty", () => {
    const { container } = render(<GameShowcase games={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
