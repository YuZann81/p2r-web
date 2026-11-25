import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeaderboardPage from "@/app/leaderboard/page";
import LeaderboardSection from "@/components/LeaderboardSection";
import {
  getDualLeaderboardBootstrap,
  getGameLeaderboardData,
  getOverallLeaderboardData,
} from "@/lib/leaderboard/getLeaderboard";

jest.mock("@/lib/leaderboard/getLeaderboard", () => ({
  DEFAULT_LEADERBOARD_LIMIT: 100,
  getDualLeaderboardBootstrap: jest.fn(),
  getOverallLeaderboardData: jest.fn(),
  getGameLeaderboardData: jest.fn(),
}));

const mockedBootstrap = getDualLeaderboardBootstrap as jest.MockedFunction<
  typeof getDualLeaderboardBootstrap
>;
const mockedGetOverall = getOverallLeaderboardData as jest.MockedFunction<
  typeof getOverallLeaderboardData
>;
const mockedGetGame = getGameLeaderboardData as jest.MockedFunction<
  typeof getGameLeaderboardData
>;

describe("LeaderboardPage & LeaderboardSection (Dual Live Leaderboard)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Empty State (No fabricated entries)", () => {
    beforeEach(() => {
      mockedBootstrap.mockResolvedValue({
        overall: {
          status: "empty",
          data: {
            event: null,
            totalPlayers: 0,
            entries: [],
            myRank: null,
          },
        },
        games: [{ slug: "pixeltype", title: "PixelType" }],
      });
    });

    it("renders honest empty state on /leaderboard without fake players", async () => {
      const Component = await LeaderboardPage();
      render(Component);

      expect(
        screen.getByRole("heading", { level: 1, name: /leaderboard/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("leaderboard-empty-state")).toBeInTheDocument();
      expect(screen.getByTestId("leaderboard-no-event")).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(
        screen.queryByText(/CyberKnight|CyberRider|PixelQueen/i),
      ).not.toBeInTheDocument();
    });

    it("renders honest empty state on homepage LeaderboardSection", async () => {
      const Component = await LeaderboardSection();
      render(Component);

      expect(screen.getByTestId("leaderboard-empty-state")).toBeInTheDocument();
      expect(screen.getByText(/Belum Ada Skor Tercatat/i)).toBeInTheDocument();
      for (const fakeName of [
        "CyberRider",
        "PixelMage",
        "NeonNinja",
        "CyberKnight",
      ]) {
        expect(screen.queryByText(fakeName)).not.toBeInTheDocument();
      }
    });
  });

  describe("Overall & Per-Game Live Mode", () => {
    const overallEntries = Array.from({ length: 11 }, (_, idx) => ({
      rank: idx + 1,
      playerId: idx + 1,
      playerName: `Player${idx + 1}`,
      totalScore: 600 - idx * 25,
      gamesPlayed: (idx % 3) + 1,
      lastSubmittedAt: "2026-11-26T02:00:00Z",
    }));

    const bootstrapLive = {
      overall: {
        status: "live" as const,
        data: {
          event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
          totalPlayers: 11,
          entries: overallEntries,
          myRank: {
            rank: 4,
            playerId: 4,
            playerName: "Player4",
            totalScore: 525,
            gamesPlayed: 1,
            lastSubmittedAt: "2026-11-26T02:00:00Z",
          },
        },
      },
      games: [
        { slug: "pixeltype", title: "PixelType" },
        { slug: "speed-maze", title: "Speed Maze" },
      ],
    };

    it("renders active event, my_rank, games_played, and full table on /leaderboard without inventing breakdowns", async () => {
      mockedBootstrap.mockResolvedValueOnce(bootstrapLive);

      const Component = await LeaderboardPage();
      render(Component);

      expect(screen.getByTestId("leaderboard-active-event")).toHaveTextContent(
        "Event Aktif: P2R 2026",
      );
      expect(screen.getByTestId("leaderboard-my-rank")).toHaveTextContent(
        "#4 · Player4",
      );
      expect(screen.getAllByText("Player1").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/1 Game Dimainkan/i).length).toBeGreaterThan(0);

      const table = screen.getByRole("table");
      expect(within(table).getAllByRole("columnheader")).toHaveLength(3);
      // Full page displays all 11 available entries (+ 1 header row)
      expect(within(table).getAllByRole("row")).toHaveLength(12);
    });

    it("caps homepage compact LeaderboardSection to top 9 entries", async () => {
      mockedBootstrap.mockResolvedValueOnce(bootstrapLive);

      const Component = await LeaderboardSection({
        games: bootstrapLive.games,
      });
      render(Component);

      expect(screen.getByText("Player1")).toBeInTheDocument();
      expect(screen.getByText("Player9")).toBeInTheDocument();
      expect(screen.queryByText("Player10")).not.toBeInTheDocument();
      expect(screen.queryByText("Player11")).not.toBeInTheDocument();
    });

    it("switches to Per-Game tab, fetches selected game, respects lower_is_better direction, and switches games", async () => {
      const user = userEvent.setup();
      mockedBootstrap.mockResolvedValueOnce(bootstrapLive);
      mockedGetGame
        .mockResolvedValueOnce({
          status: "live",
          data: {
            game: { id: "g-1", slug: "pixeltype", title: "PixelType" },
            event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
            direction: "higher_is_better",
            totalPlayers: 1,
            entries: [
              {
                rank: 1,
                playerId: 21,
                playerName: "TypeMaster",
                gameName: "PixelType",
                score: 590,
              },
            ],
            myRank: null,
            unavailable: false,
          },
        })
        .mockResolvedValueOnce({
          status: "live",
          data: {
            game: { id: "g-2", slug: "speed-maze", title: "Speed Maze" },
            event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
            direction: "lower_is_better",
            totalPlayers: 2,
            entries: [
              {
                rank: 1,
                playerId: 31,
                playerName: "MazeSprint",
                gameName: "Speed Maze",
                score: 38,
              },
              {
                rank: 2,
                playerId: 32,
                playerName: "MazeRunner",
                gameName: "Speed Maze",
                score: 49,
              },
            ],
            myRank: null,
            unavailable: false,
          },
        });

      const Component = await LeaderboardPage();
      render(Component);

      await user.click(
        screen.getByRole("tab", { name: /leaderboard per game/i }),
      );

      await waitFor(() => {
        expect(mockedGetGame).toHaveBeenCalledWith("pixeltype", {
          limit: 100,
          token: null,
          forceRefresh: undefined,
        });
      });
      expect(screen.getAllByText("TypeMaster").length).toBeGreaterThan(0);

      await user.click(screen.getByRole("button", { name: "Speed Maze" }));

      await waitFor(() => {
        expect(mockedGetGame).toHaveBeenCalledWith("speed-maze", {
          limit: 100,
          token: null,
          forceRefresh: undefined,
        });
      });
      expect(screen.getByTestId("leaderboard-score-direction")).toHaveTextContent(
        "Skor Terendah Terbaik",
      );
      expect(screen.getAllByText("MazeSprint").length).toBeGreaterThan(0);
    });

    it("renders error state and retries with forceRefresh when Coba Lagi is clicked", async () => {
      const user = userEvent.setup();
      mockedBootstrap.mockResolvedValueOnce({
        overall: {
          status: "error",
          data: {
            event: null,
            totalPlayers: 0,
            entries: [],
            myRank: null,
          },
          errorMessage: "Timeout dari server",
        },
        games: [],
      });

      mockedGetOverall.mockResolvedValueOnce({
        status: "live",
        data: {
          event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
          totalPlayers: 1,
          entries: [
            {
              rank: 1,
              playerId: 99,
              playerName: "RecoveredPlayer",
              totalScore: 500,
              gamesPlayed: 1,
            },
          ],
          myRank: null,
        },
      });

      const Component = await LeaderboardPage();
      render(Component);

      expect(screen.getByTestId("leaderboard-error-state")).toHaveTextContent(
        "Timeout dari server",
      );

      await user.click(screen.getByRole("button", { name: /coba lagi/i }));

      await waitFor(() => {
        expect(mockedGetOverall).toHaveBeenCalledWith({
          limit: 100,
          token: null,
          forceRefresh: true,
        });
      });
      expect(screen.getAllByText("RecoveredPlayer").length).toBeGreaterThan(0);
    });
  });
});
