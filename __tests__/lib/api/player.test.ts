import { fetchPlayerProfileData } from "@/lib/api/player";
import { apiGet } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/api/auth";
import { fetchGameKaryas } from "@/lib/api/karya";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
}));
jest.mock("@/lib/api/auth", () => ({
  getCurrentUser: jest.fn(),
}));
jest.mock("@/lib/api/karya", () => ({
  fetchGameKaryas: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;
const mockedFetchGameKaryas = fetchGameKaryas as jest.MockedFunction<typeof fetchGameKaryas>;

describe("fetchPlayerProfileData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("aggregates real user, wallet, redemptions, and per-game my_rank stats without fabricating data", async () => {
    mockedGetCurrentUser.mockResolvedValueOnce({
      success: true,
      message: "",
      data: {
        id: 7,
        name: "Test Player",
        email: "player@example.com",
        role: "player",
        wallet: { id: "w-1", balance: 120 },
      },
    });

    mockedFetchGameKaryas.mockResolvedValueOnce([
      {
        id: "g-1",
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
        is_voted_by_me: "0",
      },
      {
        id: "g-2",
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
        is_voted_by_me: "0",
      },
    ]);

    mockedApiGet.mockImplementation(async (endpoint) => {
      if (endpoint === "/me/wallet") {
        return {
          success: true,
          message: "",
          data: {
            wallet_id: "w-1",
            balance: 150,
            transactions: [
              { id: "tx-1", type: "credit", amount: 50, description: "Reward", created_at: "2026-11-23T10:00:00Z" },
            ],
          },
        };
      }
      if (endpoint === "/redemptions") {
        return { success: true, message: "", data: { data: [] } };
      }
      if (endpoint === "/games/pixeltype/leaderboard") {
        return {
          success: true,
          message: "",
          data: {
            game: { id: "g-1", slug: "pixeltype", title: "PixelType" },
            total_players: 12,
            leaderboard: [],
            my_rank: { rank: 2, score: 4500, submitted_at: "2026-11-23T09:00:00Z" },
          },
        };
      }
      throw new Error("CAPABILITY_NOT_ENABLED");
    });

    const data = await fetchPlayerProfileData("token-abc");

    expect(data.coinBalance).toBe(150);
    expect(data.activeLeaderboardGamesCount).toBe(1);
    expect(data.summary).toEqual({
      gamesRecorded: 1,
      totalAccumulatedScore: 4500,
      bestScore: 4500,
      bestRank: 2,
    });
    expect(data.gameRecords).toHaveLength(1);
    expect(data.gameRecords[0].gameTitle).toBe("PixelType");
    expect(data.walletTransactions).toHaveLength(1);
  });
});
