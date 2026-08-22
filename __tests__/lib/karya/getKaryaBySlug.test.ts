import { getKaryaBySlug } from "@/lib/karya/getKaryaBySlug"
import { fetchKaryaBySlug } from "@/lib/api/karya"
import type { KaryaDetail } from "@/lib/api/types/karya"

jest.mock("@/lib/api/karya", () => ({
  fetchKaryaBySlug: jest.fn(),
}))

const mockedFetchKaryaBySlug = fetchKaryaBySlug as jest.MockedFunction<
  typeof fetchKaryaBySlug
>

describe("getKaryaBySlug", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("returns karya detail from API when fetch succeeds", async () => {
    const mockKarya: KaryaDetail = {
      id: "game-100",
      title: "Neon Racer",
      slug: "neon-racer",
      description: "Exciting racer game.",
      creators: "RPL Studio",
      category: "game",
      tech_stack: ["Unity", "C#"],
      media_urls: ["https://example.com/neon.png"],
      live_url: "https://example.com/play",
      repo_url: "https://github.com/example/neon",
      is_featured: true,
      status: "published",
      votes_count: 50,
      created_at: null,
      updated_at: null,
      is_voted_by_me: "0",
    }

    mockedFetchKaryaBySlug.mockResolvedValueOnce(mockKarya)

    const result = await getKaryaBySlug("neon-racer")

    expect(mockedFetchKaryaBySlug).toHaveBeenCalledWith("neon-racer")
    expect(result).toEqual(mockKarya)
  })

  it("falls back to static fallback game when API fails or returns null", async () => {
    mockedFetchKaryaBySlug.mockRejectedValueOnce(new Error("API Not Found"))

    const result = await getKaryaBySlug("game-1")

    expect(result).not.toBeNull()
    expect(result?.title).toBe("Cyber Runner 2099")
    expect(result?.slug).toBe("game-1")
    expect(result?.category).toBe("game")
  })

  it("returns null when slug is not in API and not in fallback", async () => {
    mockedFetchKaryaBySlug.mockRejectedValueOnce(new Error("API Not Found"))

    const result = await getKaryaBySlug("non-existent-slug")

    expect(result).toBeNull()
  })
})
