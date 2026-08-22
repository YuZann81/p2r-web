import { render, screen, within } from "@testing-library/react";
import LeaderboardPage from "@/app/leaderboard/page";
import type { LeaderboardEntry } from "@/lib/content";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

jest.mock("@/lib/leaderboard/getLeaderboard", () => ({
  getLeaderboardData: jest.fn(),
}));

const mockedGetLeaderboardData = getLeaderboardData as jest.MockedFunction<
  typeof getLeaderboardData
>;

const sampleEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    playerName: "CyberKnight",
    gameName: "Cyber Runner 2099",
    score: 98500,
  },
  {
    rank: 2,
    playerName: "PixelQueen",
    gameName: "Byte Defender",
    score: 87200,
  },
  {
    rank: 3,
    playerName: "NeonRider",
    gameName: "Neon Highway",
    score: 76450,
  },
];

describe("LeaderboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("With Leaderboard Entries", () => {
    beforeEach(() => {
      mockedGetLeaderboardData.mockResolvedValue({
        mode: "live",
        entries: [...sampleEntries],
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
      for (const entry of sampleEntries) {
        expect(screen.getAllByText(entry.playerName).length).toBeGreaterThan(0);
        expect(
          screen.getAllByText(entry.score.toLocaleString("id-ID"), {
            exact: false,
          }).length,
        ).toBeGreaterThan(0);
      }
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
      expect(rows).toHaveLength(sampleEntries.length + 1);

      const podiumSection = screen.getByRole("region", {
        name: /top 3 juara klasemen/i,
      });
      expect(podiumSection).toBeInTheDocument();
    });
  });

  describe("Empty Leaderboard State", () => {
    it("renders clean empty state when no leaderboard scores are recorded", async () => {
      mockedGetLeaderboardData.mockResolvedValueOnce({
        mode: "live",
        entries: [],
      });

      const Component = await LeaderboardPage();
      render(Component);

      expect(
        screen.getByText("Belum ada skor tercatat untuk game ini."),
      ).toBeInTheDocument();
    });
  });
});
