import { render, screen, within } from "@testing-library/react";
import LeaderboardPage from "@/app/leaderboard/page";
import LeaderboardSection from "@/components/LeaderboardSection";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

jest.mock("@/lib/leaderboard/getLeaderboard", () => ({
  getLeaderboardData: jest.fn(),
}));

const mockedGetLeaderboardData = getLeaderboardData as jest.MockedFunction<
  typeof getLeaderboardData
>;

describe("LeaderboardPage & LeaderboardSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Empty State (No fabricated entries)", () => {
    beforeEach(() => {
      mockedGetLeaderboardData.mockResolvedValue({
        mode: "empty",
        entries: [],
      });
    });

    it("renders honest empty state on /leaderboard without fake players", async () => {
      const Component = await LeaderboardPage();
      render(Component);

      expect(
        screen.getByRole("heading", { level: 1, name: /leaderboard/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Belum ada data skor klasemen yang tercatat\./i),
      ).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.queryByText(/CyberKnight|CyberRider/i)).not.toBeInTheDocument();
    });

    it("renders honest empty state on homepage LeaderboardSection without hardcoded podium players", async () => {
      const Component = await LeaderboardSection();
      render(Component);

      expect(screen.getByTestId("leaderboard-empty-state")).toBeInTheDocument();
      expect(screen.getByText(/Belum Ada Skor Tercatat/i)).toBeInTheDocument();
      for (const fakeName of ["CyberRider", "PixelMage", "NeonNinja", "Quantum Shift"]) {
        expect(screen.queryByText(fakeName)).not.toBeInTheDocument();
      }
    });
  });

  describe("Live Mode (API data)", () => {
    const liveEntries = [
      { rank: 1, playerName: "LiveChampion", gameName: "PixelType", score: 120000 },
      { rank: 2, playerName: "RunnerTwo", gameName: "PixelType", score: 95000 },
      { rank: 3, playerName: "RunnerThree", gameName: "PixelType", score: 80000 },
    ];

    it("renders live podium, table headers, and formatted scores on /leaderboard", async () => {
      mockedGetLeaderboardData.mockResolvedValueOnce({
        mode: "live",
        entries: liveEntries,
      });

      const Component = await LeaderboardPage();
      render(Component);

      expect(screen.getAllByText("LiveChampion").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/120\.000/i).length).toBeGreaterThan(0);

      const table = screen.getByRole("table");
      expect(within(table).getAllByRole("columnheader")).toHaveLength(3);
      expect(within(table).getAllByRole("row")).toHaveLength(liveEntries.length + 1);
    });

    it("renders only real podium players in LeaderboardSection when fewer than 3 players exist", async () => {
      mockedGetLeaderboardData.mockResolvedValueOnce({
        mode: "live",
        entries: [liveEntries[0]],
      });

      const Component = await LeaderboardSection();
      render(Component);

      expect(screen.getByText("LiveChampion")).toBeInTheDocument();
      expect(screen.queryByText("PixelMage")).not.toBeInTheDocument();
      expect(screen.queryByText("NeonNinja")).not.toBeInTheDocument();
    });

    it("renders full podium and ranks 4+ with game names in LeaderboardSection", async () => {
      mockedGetLeaderboardData.mockResolvedValueOnce({
        mode: "live",
        entries: [
          ...liveEntries,
          { rank: 4, playerName: "PlayerFour", gameName: "ArcadeDash", score: 64200 },
        ],
      });

      const Component = await LeaderboardSection();
      render(Component);

      expect(screen.getByText("LiveChampion")).toBeInTheDocument();
      expect(screen.getByText("RunnerTwo")).toBeInTheDocument();
      expect(screen.getByText("RunnerThree")).toBeInTheDocument();
      expect(screen.getByText("PlayerFour")).toBeInTheDocument();
      expect(screen.getByText("ArcadeDash")).toBeInTheDocument();
      expect(screen.getByText(/64\.200 PTS/i)).toBeInTheDocument();
    });
  });
});
