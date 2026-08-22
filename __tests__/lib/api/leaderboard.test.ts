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
      const mockData = [
        { rank: 1, playerName: "Player1", gameName: "Cyber Runner", score: 9999 },
      ];
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "",
        data: mockData,
      });

      const result = await fetchGlobalLeaderboard();

      expect(mockedApiGet).toHaveBeenCalledWith("/leaderboards/global");
      expect(result).toEqual(mockData);
    });

    it("returns empty array when API rejects", async () => {
      mockedApiGet.mockRejectedValueOnce(new Error("Network Error"));

      const result = await fetchGlobalLeaderboard();

      expect(result).toEqual([]);
    });
  });

  describe("fetchKaryaLeaderboard", () => {
    it("calls /leaderboards/karyas and returns data array", async () => {
      const mockData = [
        { rank: 1, karyaTitle: "Best Web", category: "website", votesCount: 50, slug: "best-web" },
      ];
      mockedApiGet.mockResolvedValueOnce({
        success: true,
        message: "",
        data: mockData,
      });

      const result = await fetchKaryaLeaderboard();

      expect(mockedApiGet).toHaveBeenCalledWith("/leaderboards/karyas");
      expect(result).toEqual(mockData);
    });

    it("returns empty array when API rejects", async () => {
      mockedApiGet.mockRejectedValueOnce(new Error("Network Error"));

      const result = await fetchKaryaLeaderboard();

      expect(result).toEqual([]);
    });
  });
});
