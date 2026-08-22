import { getGames } from "@/lib/games/getGames"

jest.mock("@/lib/api/karya", () => ({
  fetchGameKaryas: jest.fn(),
}))

import { fetchGameKaryas } from "@/lib/api/karya"

const mockedFetchGameKaryas = fetchGameKaryas as jest.MockedFunction<
  typeof fetchGameKaryas
>

describe("getGames", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
    mockedFetchGameKaryas.mockReset()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("returns mapped games when the API has published game karyas", async () => {
    mockedFetchGameKaryas.mockResolvedValue([
      {
        id: "1",
        title: "Pixel Runner",
        slug: "pixel-runner",
        description: "An arcade platformer.",
        creators: null,
        category: "game",
        tech_stack: [],
        media_urls: ["https://cdn.example.com/game.png"],
        live_url: null,
        repo_url: null,
        is_featured: true,
        status: "published",
        votes_count: 0,
        created_at: null,
        updated_at: null,
        is_voted_by_me: "false",
      },
    ])

    const games = await getGames()

    expect(games).toHaveLength(1)
    expect(games[0]?.name).toBe("Pixel Runner")
  })

  it("returns an empty array when the API returns no items", async () => {
    mockedFetchGameKaryas.mockResolvedValue([])

    const games = await getGames()

    expect(games).toEqual([])
  })

  it("returns an empty array when the API call fails", async () => {
    mockedFetchGameKaryas.mockRejectedValue(new Error("Network failure"))

    const games = await getGames()

    expect(games).toEqual([])
  })
})
