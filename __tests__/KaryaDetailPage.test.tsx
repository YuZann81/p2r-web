import { render, screen } from "@testing-library/react"
import KaryaDetailPage, { generateMetadata } from "@/app/karya/[slug]/page"
import { getKaryaBySlug } from "@/lib/karya/getKaryaBySlug"
import { notFound } from "next/navigation"

jest.mock("@/lib/karya/getKaryaBySlug", () => ({
  getKaryaBySlug: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
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
      id: "web-1",
      title: "Smart School Portal",
      slug: "smart-school-portal",
      description: "Portal modern manajemen sekolah.",
      creators: "Tim Web Dev RPL",
      category: "website",
      tech_stack: ["Next.js", "Tailwind CSS", "PostgreSQL"],
      media_urls: ["/images/game-1.png"],
      live_url: "https://school.example.com",
      repo_url: "https://github.com/example/school",
      is_featured: true,
      status: "published",
      votes_count: 45,
      created_at: null,
      updated_at: null,
      is_voted_by_me: "0",
    })

    const Component = await KaryaDetailPage({
      params: Promise.resolve({ slug: "smart-school-portal" }),
    })
    render(Component)

    expect(
      screen.getByRole("heading", { level: 1, name: "Smart School Portal" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Web Innovation/i)).toBeInTheDocument()
    expect(
      screen.getByText("Portal modern manajemen sekolah."),
    ).toBeInTheDocument()
    expect(screen.getByText("Next.js")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "← Kembali ke Semua Karya" }),
    ).toHaveAttribute("href", "/karya")
  })

  it("calls notFound() when karya slug does not exist", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce(null)

    await KaryaDetailPage({
      params: Promise.resolve({ slug: "unknown-slug" }),
    })

    expect(notFound).toHaveBeenCalledTimes(1)
  })

  it("generates correct SEO metadata for existing and non-existing karya", async () => {
    mockedGetKaryaBySlug.mockResolvedValueOnce({
      id: "web-1",
      title: "Smart School Portal",
      slug: "smart-school-portal",
      description: "Portal modern manajemen sekolah.",
      creators: "Tim Web Dev",
      category: "website",
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
      params: Promise.resolve({ slug: "smart-school-portal" }),
    })
    expect(metadata.title).toBe("Smart School Portal — Detail Karya | Pixels to Reality")

    mockedGetKaryaBySlug.mockResolvedValueOnce(null)
    const notFoundMeta = await generateMetadata({
      params: Promise.resolve({ slug: "not-found" }),
    })
    expect(notFoundMeta.title).toBe("Karya Tidak Ditemukan — Pixels to Reality")
  })
})
