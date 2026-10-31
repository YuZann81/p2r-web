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

  it("fetches feeds list and maps the API platform shape", async () => {
    const apiFeeds = [
      {
        id: "feed-1",
        platform: "custom",
        original_url: "https://pameran.devsaka.id/feeds",
        title: "Pameran P2R Dimulai!",
        thumbnail_url: "/images/feed-1.png",
        embed_html: "<p>Hari pertama pameran <strong>Cyber Arcade</strong> resmi dibuka.</p>",
        created_at: "2026-08-22T08:00:00Z",
      },
      {
        id: "feed-2",
        platform: "tiktok",
        original_url: "https://tiktok.com/@p2r_cyberarcade/video/1",
        title: "Behind the scene",
        thumbnail_url: "/images/feed-2.png",
        embed_html: null,
        created_at: "2026-08-22T09:00:00Z",
      },
    ];

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Feeds retrieved",
      data: apiFeeds,
    });

    const result = await fetchFeeds({ limit: 10 });

    expect(mockedApiGet).toHaveBeenCalledWith("/feeds", {
      searchParams: { limit: 10, source: undefined },
    });
    expect(result).toEqual([
      {
        id: "feed-1",
        title: "Pameran P2R Dimulai!",
        content: "Hari pertama pameran Cyber Arcade resmi dibuka.",
        caption: null,
        image_url: "/images/feed-1.png",
        media_url: null,
        source: "announcement",
        author_name: null,
        external_url: "https://pameran.devsaka.id/feeds",
        created_at: "2026-08-22T08:00:00Z",
        updated_at: null,
      },
      {
        id: "feed-2",
        title: "Behind the scene",
        content: null,
        caption: null,
        image_url: "/images/feed-2.png",
        media_url: null,
        source: "activity",
        author_name: null,
        external_url: "https://tiktok.com/@p2r_cyberarcade/video/1",
        created_at: "2026-08-22T09:00:00Z",
        updated_at: null,
      },
    ]);
  });

  it("fetches single feed item by ID", async () => {
    const apiFeed = {
      id: "feed-1",
      platform: "custom",
      original_url: "https://pameran.devsaka.id/feeds",
      title: "Pameran P2R Dimulai!",
      thumbnail_url: null,
      embed_html: "Hari pertama pameran Cyber Arcade resmi dibuka.",
      created_at: "2026-08-22T08:00:00Z",
    };

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Feed retrieved",
      data: apiFeed,
    });

    const result = await fetchFeedById("feed-1");

    expect(mockedApiGet).toHaveBeenCalledWith("/feeds/feed-1");
    expect(result).toEqual({
      id: "feed-1",
      title: "Pameran P2R Dimulai!",
      content: "Hari pertama pameran Cyber Arcade resmi dibuka.",
      caption: null,
      image_url: null,
      media_url: null,
      source: "announcement",
      author_name: null,
      external_url: "https://pameran.devsaka.id/feeds",
      created_at: "2026-08-22T08:00:00Z",
      updated_at: null,
    });
  });

  it("returns null when the API reports a missing feed as an empty array", async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Feed retrieved.",
      data: [],
    });

    await expect(fetchFeedById("missing")).resolves.toBeNull();
  });

  it("returns empty array on API error in fetchFeeds", async () => {
    mockedApiGet.mockRejectedValueOnce(new Error("Network failure"));

    const result = await fetchFeeds();
    expect(result).toEqual([]);
  });
});
