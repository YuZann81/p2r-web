import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import KaryaPage from "@/app/karya/page"
import { getAllKaryas } from "@/lib/karya/getKaryas"
import type { KaryaDetail } from "@/lib/api/types/karya"

jest.mock("@/lib/karya/getKaryas", () => ({
  getAllKaryas: jest.fn(),
}))

const mockedGetAllKaryas = getAllKaryas as jest.MockedFunction<
  typeof getAllKaryas
>

const mockKaryas: KaryaDetail[] = [
  {
    id: "karya-1",
    title: "Cyber Runner 2099",
    slug: "cyber-runner-2099",
    description: "Fast paced endless runner game.",
    creators: "Tim Game RPL",
    category: "game",
    tech_stack: ["Phaser.js", "WebAudio"],
    media_urls: ["/images/game-1.png"],
    live_url: "https://play.example.com",
    repo_url: null,
    is_featured: true,
    status: "published",
    votes_count: 99,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
  {
    id: "karya-2",
    title: "Smart Attendance IoT",
    slug: "smart-attendance-iot",
    description: "Sistem presensi berbasis RFID dan sensor ESP32.",
    creators: "Tim IoT RPL",
    category: "hardware_robotics",
    tech_stack: ["ESP32", "C++", "MQTT"],
    media_urls: ["/images/game-2.png"],
    live_url: null,
    repo_url: "https://github.com/example/iot",
    is_featured: false,
    status: "published",
    votes_count: 42,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
]

describe("KaryaPage (/karya)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders page heading, description, back link, and initial karya list", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce(mockKaryas)

    const Component = await KaryaPage()
    render(Component)

    expect(
      screen.getByRole("heading", { level: 1, name: /semua karya/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/direktori lengkap seluruh karya pameran/i),
    ).toBeInTheDocument()

    // Back to home links
    const backLinks = screen.getAllByRole("link", {
      name: /kembali ke beranda/i,
    })
    expect(backLinks.length).toBeGreaterThan(0)
    expect(backLinks[0]).toHaveAttribute("href", "/")

    // Initial items rendered
    expect(screen.getByText("Cyber Runner 2099")).toBeInTheDocument()
    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument()

    // Detail links
    const detailLinks = screen.getAllByRole("link", {
      name: /lihat detail karya/i,
    })
    expect(detailLinks[0]).toHaveAttribute("href", "/karya/cyber-runner-2099")
    expect(detailLinks[1]).toHaveAttribute("href", "/karya/smart-attendance-iot")
  })

  it("filters karya list by category tab and shows empty state when no karya matches", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce(mockKaryas)
    const user = userEvent.setup()

    const Component = await KaryaPage()
    render(Component)

    // Filter to Game category
    const gameTab = screen.getByRole("tab", { name: "Game Arcade" })
    await user.click(gameTab)

    expect(screen.getByText("Cyber Runner 2099")).toBeInTheDocument()
    expect(screen.queryByText("Smart Attendance IoT")).not.toBeInTheDocument()

    // Filter to Website category (empty)
    const webTab = screen.getByRole("tab", { name: "Web Innovation" })
    await user.click(webTab)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Karya Segera Hadir",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Karya pameran untuk kategori Web Innovation/i),
    ).toBeInTheDocument()
  })

  it("handles empty initial karyas array gracefully", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce([])

    const Component = await KaryaPage()
    render(Component)

    expect(
      screen.getByRole("heading", { level: 1, name: /semua karya/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Karya Segera Hadir",
      }),
    ).toBeInTheDocument()
  })
})
