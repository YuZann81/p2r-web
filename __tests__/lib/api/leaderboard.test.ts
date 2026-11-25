import { ApiError, apiGet } from "@/lib/api/client";
import { fetchGameKaryas } from "@/lib/api/karya";
import {
  fetchGameLeaderboard,
  fetchGameLeaderboardDetail,
  fetchOverallLeaderboard,
} from "@/lib/api/leaderboard";
import {
  DEFAULT_LEADERBOARD_LIMIT,
  getDualLeaderboardBootstrap,
  getGameLeaderboardData,
  getOverallLeaderboardData,
  LEADERBOARD_CACHE_TTL_MS,
  resetLeaderboardCacheForTests,
} from "@/lib/leaderboard/getLeaderboard";

jest.mock("@/lib/api/client", () => {
  const actual = jest.requireActual("@/lib/api/client");
  return {
    ...actual,
    apiGet: jest.fn(),
  };
});

jest.mock("@/lib/api/karya", () => ({
  fetchGameKaryas: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedFetchGameKaryas = fetchGameKaryas as jest.MockedFunction<
  typeof fetchGameKaryas
>;

describe("Leaderboard API service & cached loader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetLeaderboardCacheForTests();
  });

  describe("fetchOverallLeaderboard", () => {
    it("calls /leaderboards/overall and maps event, total_score, games_played, and my_rank", async () => {
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "Overall leaderboard retrieved successfully.",
        data: {
          event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
          total_players: 2,
          leaderboard: [
            {
              rank: 1,
              player: { id: 10, name: "Alya" },
              total_score: 1150,
              games_played: 2,
              last_submitted_at: "2026-11-26T01:00:00Z",
            },
            {
              rank: 2,
              player: { id: 11, name: "Bima" },
              total_score: 580,
              games_played: 1,
              last_submitted_at: "2026-11-26T01:05:00Z",
            },
          ],
          my_rank: {
            rank: 2,
            player: { id: 11, name: "Bima" },
            total_score: 580,
            games_played: 1,
            last_submitted_at: "2026-11-26T01:05:00Z",
          },
        },
      });

      const result = await fetchOverallLeaderboard({ limit: 50, token: "tok" });

      expect(mockedApiGet).toHaveBeenCalledWith("/leaderboards/overall", {
        searchParams: { limit: 50, offset: undefined },
        token: "tok",
      });
      expect(result).toEqual({
        event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
        totalPlayers: 2,
        entries: [
          {
            rank: 1,
            playerId: 10,
            playerName: "Alya",
            totalScore: 1150,
            gamesPlayed: 2,
            lastSubmittedAt: "2026-11-26T01:00:00Z",
          },
          {
            rank: 2,
            playerId: 11,
            playerName: "Bima",
            totalScore: 580,
            gamesPlayed: 1,
            lastSubmittedAt: "2026-11-26T01:05:00Z",
          },
        ],
        myRank: {
          rank: 2,
          playerId: 11,
          playerName: "Bima",
          totalScore: 580,
          gamesPlayed: 1,
          lastSubmittedAt: "2026-11-26T01:05:00Z",
        },
      });
    });
  });

  describe("fetchGameLeaderboardDetail & fetchGameLeaderboard", () => {
    it("calls /games/{slug}/leaderboard with silentStatuses:[422] and preserves direction & order", async () => {
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "Leaderboard retrieved successfully.",
        data: {
          game: { id: "g-1", slug: "speed-maze", title: "Speed Maze" },
          event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
          direction: "lower_is_better",
          total_players: 2,
          leaderboard: [
            { rank: 1, player: { id: 10, name: "FastOne" }, score: 42 },
            { rank: 2, player: { id: 11, name: "FastTwo" }, score: 58 },
          ],
          my_rank: null,
        },
      });

      const result = await fetchGameLeaderboardDetail("speed-maze", {
        limit: 100,
      });

      expect(mockedApiGet).toHaveBeenCalledWith(
        "/games/speed-maze/leaderboard",
        {
          searchParams: { limit: 100, offset: undefined },
          token: undefined,
          silentStatuses: [422],
        },
      );
      expect(result.direction).toBe("lower_is_better");
      expect(result.unavailable).toBe(false);
      expect(result.entries).toEqual([
        {
          rank: 1,
          playerId: 10,
          playerName: "FastOne",
          gameName: "Speed Maze",
          score: 42,
          submittedAt: null,
        },
        {
          rank: 2,
          playerId: 11,
          playerName: "FastTwo",
          gameName: "Speed Maze",
          score: 58,
          submittedAt: null,
        },
      ]);
    });

    it("marks 422 CAPABILITY_NOT_ENABLED as unavailable without throwing", async () => {
      mockedApiGet.mockRejectedValueOnce(
        new ApiError("CAPABILITY_NOT_ENABLED", { status: 422 }),
      );

      const result = await fetchGameLeaderboardDetail("save-the-savanna");

      expect(result.unavailable).toBe(true);
      expect(result.entries).toEqual([]);
    });

    it("fetchGameLeaderboard returns empty array when API rejects", async () => {
      mockedApiGet.mockRejectedValueOnce(new Error("Network failure"));

      const result = await fetchGameLeaderboard("pixeltype");

      expect(result).toEqual([]);
    });
  });

  describe("30s cache & in-flight deduplication", () => {
    it("caches overall responses within 30s TTL, deduplicates concurrent calls, and never caches errors", async () => {
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
      mockedApiGet.mockResolvedValue({
        success: true,
        message: "ok",
        data: {
          event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
          total_players: 1,
          leaderboard: [
            {
              rank: 1,
              player: { id: 1, name: "Saepudin" },
              total_score: 550,
              games_played: 1,
            },
          ],
          my_rank: null,
        },
      });

      const [first, second] = await Promise.all([
        getOverallLeaderboardData(),
        getOverallLeaderboardData(),
      ]);
      expect(first).toEqual(second);
      expect(first.status).toBe("live");
      expect(mockedApiGet).toHaveBeenCalledTimes(1);

      // Cached within TTL
      nowSpy.mockReturnValue(1_000_000 + LEADERBOARD_CACHE_TTL_MS - 1_000);
      const cached = await getOverallLeaderboardData();
      expect(cached).toEqual(first);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);

      // Expired after TTL
      nowSpy.mockReturnValue(1_000_000 + LEADERBOARD_CACHE_TTL_MS + 1);
      await getOverallLeaderboardData();
      expect(mockedApiGet).toHaveBeenCalledTimes(2);

      // Error responses are not cached so retries hit API immediately
      mockedApiGet.mockRejectedValueOnce(new Error("Server unavailable"));
      const errored = await getOverallLeaderboardData({ forceRefresh: true });
      expect(errored.status).toBe("error");
      expect(errored.data.entries).toEqual([]);

      await getOverallLeaderboardData();
      expect(mockedApiGet).toHaveBeenCalledTimes(4);

      nowSpy.mockRestore();
    });

    it("caches per-game leaderboard per slug within 30s TTL and deduplicates concurrent requests", async () => {
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(2_000_000);
      mockedApiGet.mockResolvedValue({
        success: true,
        message: "ok",
        data: {
          game: { id: "g-1", slug: "bindmaze", title: "BindMaze" },
          event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
          direction: "higher_is_better",
          total_players: 1,
          leaderboard: [
            { rank: 1, player: { id: 1, name: "Saepudin" }, score: 350 },
          ],
          my_rank: null,
        },
      });

      const [first, second] = await Promise.all([
        getGameLeaderboardData("bindmaze"),
        getGameLeaderboardData("bindmaze"),
      ]);
      expect(first).toEqual(second);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);

      nowSpy.mockReturnValue(2_000_000 + LEADERBOARD_CACHE_TTL_MS - 500);
      await getGameLeaderboardData("bindmaze");
      expect(mockedApiGet).toHaveBeenCalledTimes(1);

      nowSpy.mockRestore();
    });
  });

  describe("getDualLeaderboardBootstrap", () => {
    it("reuses preloaded games without calling fetchGameKaryas and fetches only /leaderboards/overall", async () => {
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "ok",
        data: {
          event: { id: "ev-1", slug: "p2r-2026", name: "P2R 2026" },
          total_players: 0,
          leaderboard: [],
          my_rank: null,
        },
      });

      const bootstrap = await getDualLeaderboardBootstrap({
        games: [
          { slug: "pixeltype", title: "PixelType" },
          { slug: "pixeltype", title: "PixelType Duplicate" },
        ],
      });

      expect(mockedFetchGameKaryas).not.toHaveBeenCalled();
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
      expect(mockedApiGet).toHaveBeenCalledWith("/leaderboards/overall", {
        searchParams: { limit: DEFAULT_LEADERBOARD_LIMIT, offset: 0 },
        token: undefined,
      });
      expect(bootstrap.overall.status).toBe("empty");
      expect(bootstrap.games).toEqual([{ slug: "pixeltype", title: "PixelType" }]);
    });
  });
});
