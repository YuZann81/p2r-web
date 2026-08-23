import { fetchGameKaryas, fetchKaryaBySlug, fetchKaryaSlugs } from "@/lib/api/karya"

const mockKaryaDetail = {
  id: "1",
  title: "Pixel Runner",
  slug: "pixel-runner",
  description: "An arcade platformer.",
  creators: "Team Alpha",
  category: "game",
  tech_stack: [],
  media_urls: ["https://cdn.example.com/game.png", "https://cdn.example.com/logo.png"],
  live_url: null,
  repo_url: null,
  is_featured: true,
  status: "published",
  votes_count: 42,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  is_voted_by_me: "false",
}

const originalFetch = global.fetch

describe("karya API", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it("fetchKaryaSlugs requests /karyas with category=game", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: "Karya list retrieved.",
        data: [mockKaryaDetail],
      }),
    })
    global.fetch = fetchMock as typeof fetch

    const slugs = await fetchKaryaSlugs({ category: "game", limit: 10 })

    expect(slugs).toEqual(["pixel-runner"])
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/karyas?category=game&limit=10"),
      expect.objectContaining({ method: "GET" }),
    )
  })

  it("fetchKaryaBySlug requests /karyas/{slug}", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: "Karya retrieved.",
        data: mockKaryaDetail,
      }),
    })
    global.fetch = fetchMock as typeof fetch

    const karya = await fetchKaryaBySlug("pixel-runner")

    expect(karya).toEqual(mockKaryaDetail)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/karyas/pixel-runner"),
      expect.objectContaining({ method: "GET" }),
    )
  })

  it("fetchGameKaryas loads karyas for category=game", async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Karya list retrieved.",
        data: [
          mockKaryaDetail,
          { ...mockKaryaDetail, slug: "space-blitz", title: "Space Blitz" },
        ],
      }),
    })
    global.fetch = fetchMock as typeof fetch

    const karyas = await fetchGameKaryas()

    expect(karyas).toHaveLength(2)
    expect(karyas[0]?.title).toBe("Pixel Runner")
    expect(karyas[1]?.title).toBe("Space Blitz")
  })
})
