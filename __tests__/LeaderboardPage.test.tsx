import { render, screen, within } from "@testing-library/react";
import LeaderboardPage from "@/app/leaderboard/page";
import { LEADERBOARD_ENTRIES } from "@/lib/content";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

jest.mock("@/lib/leaderboard/getLeaderboard", () => ({
  getLeaderboardData: jest.fn(),
}));

const mockedGetLeaderboardData = getLeaderboardData as jest.MockedFunction<
  typeof getLeaderboardData
>;

describe("LeaderboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Preview Mode (Fallback)", () => {
    beforeEach(() => {
      mockedGetLeaderboardData.mockResolvedValue({
        mode: "preview",
        entries: [...LEADERBOARD_ENTRIES],
      });
    });

    it("renders the main heading H1 'LEADERBOARD'", async () => {
      const Component = await LeaderboardPage();
      render(Component);
      const heading = screen.getByRole("heading", {
        level: 1,
        name: /leaderboard/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders the link to return to home page", async () => {
      const Component = await LeaderboardPage();
      render(Component);
      const backLinks = screen.getAllByRole("link", {
        name: /kembali ke beranda/i,
      });
      expect(backLinks.length).toBeGreaterThan(0);
      expect(backLinks[0]).toHaveAttribute("href", "/");
    });

    it("renders the table headers Rank, Player, Game, and Score", async () => {
      const Component = await LeaderboardPage();
      render(Component);
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

    it("renders player ranking data and formatted scores correctly", async () => {
      const Component = await LeaderboardPage();
      render(Component);
      for (const entry of LEADERBOARD_ENTRIES) {
        expect(screen.getAllByText(entry.playerName).length).toBeGreaterThan(0);
        expect(
          screen.getAllByText(entry.score.toLocaleString("id-ID"), {
            exact: false,
          }).length,
        ).toBeGreaterThan(0);
      }
    });

    it("renders the SIMULASI / PREVIEW MODE notice banner", async () => {
      const Component = await LeaderboardPage();
      render(Component);
      expect(
        screen.getByText(/simulasi \/ preview mode/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/data klasemen di bawah ini merupakan data simulasi/i),
      ).toBeInTheDocument();
    });

    it("exposes semantic table and section structures for accessibility", async () => {
      const Component = await LeaderboardPage();
      render(Component);
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

  describe("Live Mode (API data)", () => {
    it("renders live event banner when live mode is active", async () => {
      mockedGetLeaderboardData.mockResolvedValueOnce({
        mode: "live",
        entries: [
          { rank: 1, playerName: "LiveChampion", gameName: "Cyber Runner", score: 120000 },
          { rank: 2, playerName: "RunnerTwo", gameName: "Cyber Runner", score: 95000 },
          { rank: 3, playerName: "RunnerThree", gameName: "Cyber Runner", score: 80000 },
        ],
      });

      const Component = await LeaderboardPage();
      render(Component);

      expect(
        screen.getByText(/live event leaderboard/i),
      ).toBeInTheDocument();
      expect(screen.getAllByText("LiveChampion").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/120\.000/i).length).toBeGreaterThan(0);
    });
  });
});
