import { render, screen, within } from "@testing-library/react";
import LeaderboardPage from "@/app/leaderboard/page";
import { LEADERBOARD_ENTRIES } from "@/lib/content";

describe("LeaderboardPage", () => {
  it("renders the main heading H1 'LEADERBOARD'", () => {
    render(<LeaderboardPage />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /leaderboard/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the link to return to home page", () => {
    render(<LeaderboardPage />);
    const backLinks = screen.getAllByRole("link", {
      name: /kembali ke beranda/i,
    });
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks[0]).toHaveAttribute("href", "/");
  });

  it("renders the table headers Rank, Player, Game, and Score", () => {
    render(<LeaderboardPage />);
    expect(
      screen.getByRole("columnheader", { name: /^rank$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /^player$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /^game$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /^score$/i }),
    ).toBeInTheDocument();
  });

  it("renders player ranking data and formatted scores correctly", () => {
    render(<LeaderboardPage />);
    for (const entry of LEADERBOARD_ENTRIES) {
      expect(screen.getAllByText(entry.playerName).length).toBeGreaterThan(0);
      expect(
        screen.getAllByText(entry.score.toLocaleString("id-ID"), {
          exact: false,
        }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("renders the SIMULASI / PREVIEW MODE notice banner", () => {
    render(<LeaderboardPage />);
    expect(
      screen.getByText(/simulasi \/ preview mode/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/data klasemen di bawah ini merupakan data simulasi/i),
    ).toBeInTheDocument();
  });

  it("exposes semantic table and section structures for accessibility", () => {
    render(<LeaderboardPage />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const columnHeaders = within(table).getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(4);

    const rows = within(table).getAllByRole("row");
    // 1 header row + N data rows
    expect(rows).toHaveLength(LEADERBOARD_ENTRIES.length + 1);

    const podiumSection = screen.getByRole("region", {
      name: /top 3 juara klasemen/i,
    });
    expect(podiumSection).toBeInTheDocument();
  });
});
