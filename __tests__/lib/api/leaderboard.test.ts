import { fetchGameLeaderboard } from "@/lib/api/leaderboard";
import { apiGet } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

describe("Leaderboard API service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchGameLeaderboard", () => {
    it("calls /games/{slug}/leaderboard and maps live entries", async () => {
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

      expect(mockedApiGet).toHaveBeenCalledWith("/games/pixeltype/leaderboard");
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
});
