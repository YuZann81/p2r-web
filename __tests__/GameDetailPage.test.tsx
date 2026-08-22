import { render, screen } from "@testing-library/react"
import GameDetailPage, { generateMetadata } from "@/app/games/[slug]/page"
import { getKaryaBySlug } from "@/lib/karya/getKaryaBySlug"
import { notFound } from "next/navigation"

jest.mock("@/lib/karya/getKaryaBySlug", () => ({
  getKaryaBySlug: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}))

const mockedGetKaryaBySlug = getKaryaBySlug as jest.MockedFunction<
  typeof getKaryaBySlug
>

describe("GameDetailPage (/games/[slug])", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders game title, creator, tech stack, and back link to games", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce({
      id: "game-1",
      title: "Cyber Runner 2099",
      slug: "game-1",
      description: "Fast paced cyberpunk runner game.",
      creators: "Tim RPL Cyber",
      category: "game",
      tech_stack: ["Phaser.js", "WebAudio"],
      media_urls: ["/images/game-1.png", "/images/game-1-logo.png"],
      live_url: "https://play.example.com",
      repo_url: "https://github.com/example/cyber-runner",
      is_featured: true,
      status: "published",
      votes_count: 88,
      created_at: null,
      updated_at: null,
      is_voted_by_me: "0",
    })

    const Component = await GameDetailPage({
      params: Promise.resolve({ slug: "game-1" }),
    })
    render(Component)

    expect(
      screen.getByRole("heading", { level: 1, name: "Cyber Runner 2099" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Tim RPL Cyber/i)).toBeInTheDocument()
    expect(
      screen.getByText("Fast paced cyberpunk runner game."),
    ).toBeInTheDocument()
    expect(screen.getByText("Phaser.js")).toBeInTheDocument()
    expect(screen.getByText("WebAudio")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "← Kembali ke Direktori Game" }),
    ).toHaveAttribute("href", "/games")
    expect(
      screen.getByRole("link", { name: /Mainkan \/ Buka Live Demo/i }),
    ).toHaveAttribute("href", "https://play.example.com")
  })

  it("calls notFound() when game slug does not exist", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce(null)

    await GameDetailPage({
      params: Promise.resolve({ slug: "unknown-slug" }),
    })

    expect(notFound).toHaveBeenCalledTimes(1)
  })

  it("generates correct SEO metadata for existing and non-existing game", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce({
      id: "game-1",
      title: "Cyber Runner 2099",
      slug: "game-1",
      description: "Fast paced cyberpunk runner game.",
      creators: "Tim RPL",
      category: "game",
      tech_stack: [],
      media_urls: [],
      live_url: null,
      repo_url: null,
      is_featured: true,
      status: "published",
      votes_count: 0,
      created_at: null,
      updated_at: null,
      is_voted_by_me: "0",
    })

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "game-1" }),
    })
    expect(metadata.title).toBe("Cyber Runner 2099 — Detail Game | Pixels to Reality")

    mockedGetKaryaBySlug.mockResolvedValueOnce(null)
    const notFoundMeta = await generateMetadata({
      params: Promise.resolve({ slug: "not-found" }),
    })
    expect(notFoundMeta.title).toBe("Game Tidak Ditemukan — Pixels to Reality")
  })
})
