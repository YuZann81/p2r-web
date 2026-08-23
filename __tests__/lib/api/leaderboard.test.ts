import {
  fetchGlobalLeaderboard,
  fetchKaryaLeaderboard,
} from "@/lib/api/leaderboard";
import { apiGet } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

describe("Leaderboard API service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchGlobalLeaderboard", () => {
    it("calls /leaderboards/global and returns data array", async () => {
      const mockRawData = [
        { rank: 1, player_name: "Player1", game: { name: "Cyber Runner", slug: "cyber-runner" }, final_score: 9999, played_at: "2026-08-23T12:00:00Z" },
      ];
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "",
        data: mockRawData,
      });

      const result = await fetchGlobalLeaderboard();

      expect(mockedApiGet).toHaveBeenCalledWith("/leaderboards/global");
      expect(result[0]?.playerName).toBe("Player1");
      expect(result[0]?.gameName).toBe("Cyber Runner");
      expect(result[0]?.score).toBe(9999);
    });

    it("returns empty array when API rejects", async () => {
      mockedApiGet.mockRejectedValueOnce(new Error("Network Error"));

      const result = await fetchGlobalLeaderboard();

      expect(result).toEqual([]);
    });
  });

  describe("fetchKaryaLeaderboard", () => {
    it("calls /leaderboards/karyas and returns data array", async () => {
      const mockRawData = [
        { rank: 1, karya: { title: "Best Web", category: "website", slug: "best-web" }, votes_count: 50 },
      ];
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "",
        data: mockRawData,
      });

      const result = await fetchKaryaLeaderboard();

      expect(mockedApiGet).toHaveBeenCalledWith("/leaderboards/karyas");
      expect(result[0]?.karyaTitle).toBe("Best Web");
      expect(result[0]?.category).toBe("website");
      expect(result[0]?.votesCount).toBe(50);
    });

    it("returns empty array when API rejects", async () => {
      mockedApiGet.mockRejectedValueOnce(new Error("Network Error"));

      const result = await fetchKaryaLeaderboard();

      expect(result).toEqual([]);
    });
  });
});
