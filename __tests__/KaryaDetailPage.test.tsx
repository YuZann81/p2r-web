import { render, screen } from "@testing-library/react"
import KaryaDetailPage, { generateMetadata } from "@/app/karya/[slug]/page"
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

describe("KaryaDetailPage (/karya/[slug])", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders karya title, category, description, and back link to karya", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce({
      id: "karya-1",
      title: "Smart Waste Sorter IoT",
      slug: "smart-waste-sorter-iot",
      description: "Automatic waste classification with AI and servo motors.",
      creators: "Tim IoT Industri",
      category: "hardware_robotics",
      tech_stack: ["ESP32", "TensorFlow Lite", "Servo"],
      media_urls: ["/images/iot-1.png"],
      live_url: "https://iot.example.com",
      repo_url: "https://github.com/example/iot-sorter",
      is_featured: true,
      status: "published",
      votes_count: 42,
      created_at: null,
      updated_at: null,
      is_voted_by_me: "0",
    })

    const Component = await KaryaDetailPage({
      params: Promise.resolve({ slug: "smart-waste-sorter-iot" }),
    })
    render(Component)

    expect(
      screen.getByRole("heading", { level: 1, name: "Smart Waste Sorter IoT" }),
    ).toBeInTheDocument()
    expect(screen.getByText("IoT & Hardware")).toBeInTheDocument()
    expect(screen.getByText(/Tim IoT Industri/i)).toBeInTheDocument()
    expect(
      screen.getByText("Automatic waste classification with AI and servo motors."),
    ).toBeInTheDocument()
    expect(screen.getByText("ESP32")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "← Kembali ke Semua Karya" }),
    ).toHaveAttribute("href", "/karya")
    expect(
      screen.getByRole("button", { name: /beri vote/i }),
    ).toHaveTextContent("42")
  })

  it("calls notFound() when karya slug is not found", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce(null)

    await KaryaDetailPage({
      params: Promise.resolve({ slug: "non-existent-slug" }),
    })

    expect(notFound).toHaveBeenCalledTimes(1)
  })

  it("generates correct SEO metadata for karya detail", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce({
      id: "karya-1",
      title: "Smart Waste Sorter IoT",
      slug: "smart-waste-sorter-iot",
      description: "Automatic waste classification.",
      creators: "Tim IoT",
      category: "hardware_robotics",
      tech_stack: [],
      media_urls: [],
      live_url: null,
      repo_url: null,
      is_featured: false,
      status: "published",
      votes_count: 10,
      created_at: null,
      updated_at: null,
      is_voted_by_me: "0",
    })

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "smart-waste-sorter-iot" }),
    })
    expect(metadata.title).toBe("Smart Waste Sorter IoT — Detail Karya | Pixels to Reality")

    mockedGetKaryaBySlug.mockResolvedValueOnce(null)
    const notFoundMeta = await generateMetadata({
      params: Promise.resolve({ slug: "not-found" }),
    })
    expect(notFoundMeta.title).toBe("Karya Tidak Ditemukan — Pixels to Reality")
  })
})
