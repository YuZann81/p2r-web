import { fetchGameLeaderboard } from "@/lib/api/leaderboard";
import { apiGet } from "@/lib/api/client";
import { fetchGameKaryas } from "@/lib/api/karya";
import {
  getLeaderboardData,
  LEADERBOARD_CACHE_TTL_MS,
  resetLeaderboardCacheForTests,
} from "@/lib/leaderboard/getLeaderboard";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
}));

jest.mock("@/lib/api/karya", () => ({
  fetchGameKaryas: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedFetchGameKaryas = fetchGameKaryas as jest.MockedFunction<
  typeof fetchGameKaryas
>;

describe("Leaderboard API service & loader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetLeaderboardCacheForTests();
  });

  describe("fetchGameLeaderboard", () => {
    it("calls /games/{slug}/leaderboard with silentStatuses:[422] and maps live entries", async () => {
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "Leaderboard retrieved successfully.",
        data: {
          game: { id: "g-1", slug: "pixeltype", title: "PixelType" },
          leaderboard: [
            { rank: 1, player: { id: 10, name: "Player1" }, score: 9999 },
          ],
        },
      });

      const result = await fetchGameLeaderboard("pixeltype");

      expect(mockedApiGet).toHaveBeenCalledWith(
        "/games/pixeltype/leaderboard",
        { silentStatuses: [422] },
      );
      expect(result).toEqual([
        { rank: 1, playerName: "Player1", gameName: "PixelType", score: 9999 },
      ]);
    });

    it("returns empty array when game has no leaderboard entries", async () => {
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "Leaderboard retrieved successfully.",
        data: {
          game: { id: "g-1", slug: "pixeltype", title: "PixelType" },
          leaderboard: [],
        },
      });

      const result = await fetchGameLeaderboard("pixeltype");

      expect(result).toEqual([]);
    });

    it("returns empty array when API rejects (e.g. 422 CAPABILITY_NOT_ENABLED)", async () => {
      mockedApiGet.mockRejectedValueOnce(new Error("CAPABILITY_NOT_ENABLED"));

      const result = await fetchGameLeaderboard("save-the-savanna");

      expect(result).toEqual([]);
    });
  });

  describe("getLeaderboardData", () => {
    it("queries games concurrently and returns live entries without fabricating fallback scores", async () => {
      mockedFetchGameKaryas.mockResolvedValueOnce([
        {
          id: "1",
          title: "Save The Savanna",
          slug: "save-the-savanna",
          description: null,
          creators: null,
          category: "game",
          tech_stack: [],
          media_urls: [],
          live_url: null,
          repo_url: null,
          is_featured: false,
          status: "published",
          votes_count: 0,
          created_at: null,
          updated_at: null,
          is_voted_by_me: "false",
        },
        {
          id: "2",
          title: "PixelType",
          slug: "pixeltype",
          description: null,
          creators: null,
          category: "game",
          tech_stack: [],
          media_urls: [],
          live_url: null,
          repo_url: null,
          is_featured: false,
          status: "published",
          votes_count: 0,
          created_at: null,
          updated_at: null,
          is_voted_by_me: "false",
        },
      ]);

      mockedApiGet
        .mockRejectedValueOnce(new Error("CAPABILITY_NOT_ENABLED"))
        .mockResolvedValueOnce({
          success: true,
          message: "ok",
          data: {
            game: { id: "2", slug: "pixeltype", title: "PixelType" },
            leaderboard: [
              { rank: 1, player: { id: 1, name: "RealPlayer" }, score: 1500 },
            ],
          },
        });

      const data = await getLeaderboardData();
      expect(data).toEqual({
        mode: "live",
        entries: [
          {
            rank: 1,
            playerName: "RealPlayer",
            gameName: "PixelType",
            score: 1500,
          },
        ],
      });
    });

    it("returns empty mode with zero entries when no game has scores", async () => {
      mockedFetchGameKaryas.mockResolvedValueOnce([]);

      const data = await getLeaderboardData();
      expect(data).toEqual({ mode: "empty", entries: [] });
    });

    it("reuses preloaded game slugs without calling fetchGameKaryas again", async () => {
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "ok",
        data: {
          game: { id: "1", slug: "bindmaze", title: "BindMaze" },
          leaderboard: [
            { rank: 1, player: { id: 1, name: "Saepudin" }, score: 350 },
          ],
        },
      });

      const data = await getLeaderboardData({ gameSlugs: ["bindmaze", "bindmaze"] });

      expect(mockedFetchGameKaryas).not.toHaveBeenCalled();
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
      expect(data).toEqual({
        mode: "live",
        entries: [
          { rank: 1, playerName: "Saepudin", gameName: "BindMaze", score: 350 },
        ],
      });
    });

    it("caches leaderboard responses within TTL and deduplicates concurrent in-flight requests", async () => {
      const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
      mockedApiGet.mockResolvedValue({
        success: true,
        message: "ok",
        data: {
          game: { id: "1", slug: "bindmaze", title: "BindMaze" },
          leaderboard: [
            { rank: 1, player: { id: 1, name: "Saepudin" }, score: 350 },
          ],
        },
      });

      // Two concurrent calls share a single API request
      const [first, second] = await Promise.all([
        getLeaderboardData({ gameSlugs: ["bindmaze"] }),
        getLeaderboardData({ gameSlugs: ["bindmaze"] }),
      ]);
      expect(first).toEqual(second);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);

      // Subsequent call within TTL returns cached data without API call
      nowSpy.mockReturnValue(1_000_000 + LEADERBOARD_CACHE_TTL_MS - 1_000);
      const cached = await getLeaderboardData({ gameSlugs: ["bindmaze"] });
      expect(cached).toEqual(first);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);

      // Call after TTL expires fetches fresh data
      nowSpy.mockReturnValue(1_000_000 + LEADERBOARD_CACHE_TTL_MS + 1);
      await getLeaderboardData({ gameSlugs: ["bindmaze"] });
      expect(mockedApiGet).toHaveBeenCalledTimes(2);
      nowSpy.mockRestore();
    });
  });
});
