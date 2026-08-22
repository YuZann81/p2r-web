import { fetchFeeds, fetchFeedById } from "@/lib/api/feeds";
import { apiGet } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

describe("Feeds API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches feeds list successfully", async () => {
    const mockFeeds = [
      {
        id: "feed-1",
        title: "Pameran P2R Dimulai!",
        content: "Hari pertama pameran Cyber Arcade resmi dibuka.",
        source: "announcement",
        created_at: "2026-08-22T08:00:00Z",
      },
    ];

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Feeds retrieved",
      data: mockFeeds,
    });

    const result = await fetchFeeds({ limit: 10 });

    expect(mockedApiGet).toHaveBeenCalledWith("/feeds", {
      searchParams: { limit: 10, source: undefined },
    });
    expect(result).toEqual(mockFeeds);
  });

  it("fetches single feed item by ID", async () => {
    const mockFeed = {
      id: "feed-1",
      title: "Pameran P2R Dimulai!",
      content: "Hari pertama pameran Cyber Arcade resmi dibuka.",
      source: "announcement",
    };

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Feed retrieved",
      data: mockFeed,
    });

    const result = await fetchFeedById("feed-1");

    expect(mockedApiGet).toHaveBeenCalledWith("/feeds/feed-1");
    expect(result).toEqual(mockFeed);
  });

  it("returns empty array on API error in fetchFeeds", async () => {
    mockedApiGet.mockRejectedValueOnce(new Error("Network failure"));

    const result = await fetchFeeds();
    expect(result).toEqual([]);
  });
});
