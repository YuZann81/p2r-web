import { render, screen, within } from "@testing-library/react";
import LeaderboardPage from "@/app/leaderboard/page";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

jest.mock("@/lib/leaderboard/getLeaderboard", () => ({
  getLeaderboardData: jest.fn(),
}));

const mockedGetLeaderboardData = getLeaderboardData as jest.MockedFunction<
  typeof getLeaderboardData
>;

const liveEntries = [
  { rank: 1, playerName: "LiveChampion", gameName: "Cyber Runner", score: 120000 },
  { rank: 2, playerName: "RunnerTwo", gameName: "Cyber Runner", score: 95000 },
  { rank: 3, playerName: "RunnerThree", gameName: "Cyber Runner", score: 80000 },
];

describe("LeaderboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the main heading H1 'LEADERBOARD'", async () => {
    mockedGetLeaderboardData.mockResolvedValue({ mode: "empty", entries: [] });

    const Component = await LeaderboardPage();
    render(Component);

    expect(
      screen.getByRole("heading", { level: 1, name: /leaderboard/i }),
    ).toBeInTheDocument();
  });

  it("renders the link to return to home page", async () => {
    mockedGetLeaderboardData.mockResolvedValue({ mode: "empty", entries: [] });

    const Component = await LeaderboardPage();
    render(Component);

    const backLinks = screen.getAllByRole("link", {
      name: /kembali ke beranda/i,
    });
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks[0]).toHaveAttribute("href", "/");
  });

  describe("Live Mode (API data)", () => {
    beforeEach(() => {
      mockedGetLeaderboardData.mockResolvedValue({
        mode: "live",
        gameTitle: "Cyber Runner",
        entries: liveEntries,
      });
    });

    it("renders the live leaderboard banner and the resolved game title", async () => {
      const Component = await LeaderboardPage();
      render(Component);

      expect(screen.getByText(/live leaderboard/i)).toBeInTheDocument();
      expect(
        screen.getByText(/papan klasemen skor resmi: Cyber Runner/i),
      ).toBeInTheDocument();
    });

    it("renders the table headers Rank, Player, Game, and Score", async () => {
      const Component = await LeaderboardPage();
      render(Component);

      expect(screen.getByRole("columnheader", { name: /^rank$/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /^player$/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /^game$/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /^score$/i })).toBeInTheDocument();
    });

    it("renders API players and formatted scores", async () => {
      const Component = await LeaderboardPage();
      render(Component);

      for (const entry of liveEntries) {
        expect(screen.getAllByText(entry.playerName).length).toBeGreaterThan(0);
        expect(
          screen.getAllByText(entry.score.toLocaleString("id-ID"), {
            exact: false,
          }).length,
        ).toBeGreaterThan(0);
      }
    });

    it("exposes semantic table and podium structures for accessibility", async () => {
      const Component = await LeaderboardPage();
      render(Component);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const columnHeaders = within(table).getAllByRole("columnheader");
      expect(columnHeaders).toHaveLength(4);

      const rows = within(table).getAllByRole("row");
      // 1 header row + N data rows
      expect(rows).toHaveLength(liveEntries.length + 1);

      expect(
        screen.getByRole("region", { name: /top 3 juara klasemen/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Empty Mode", () => {
    it("renders the empty state without any dummy ranking rows", async () => {
      mockedGetLeaderboardData.mockResolvedValue({ mode: "empty", entries: [] });

      const Component = await LeaderboardPage();
      render(Component);

      expect(screen.getByText(/belum ada catatan skor/i)).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("Error Mode", () => {
    it("renders the failure banner without any dummy ranking rows", async () => {
      mockedGetLeaderboardData.mockResolvedValue({
        mode: "error",
        entries: [],
        errorMessage: "boom",
      });

      const Component = await LeaderboardPage();
      render(Component);

      expect(screen.getByText(/gagal memuat data/i)).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });
});
