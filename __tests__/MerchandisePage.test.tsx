import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MerchandisePage from "@/app/merchandise/page"
import { fetchProducts } from "@/lib/api/products"
import type { Product } from "@/lib/api/types/product"

jest.mock("@/lib/api/products", () => ({
  fetchProducts: jest.fn(),
}))

const mockedFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Cyber T-Shirt",
    slug: "cyber-t-shirt",
    description: "Official cyberpunk t-shirt.",
    price: 85000,
    image_url: "https://example.com/tshirt.png",
  },
  {
    id: "prod-2",
    name: "Pixel Lanyard",
    slug: "pixel-lanyard",
    description: "Retro pixel arcade lanyard.",
    price: 25000,
    image_url: null,
  },
]

describe("MerchandisePage (/merchandise)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.alert = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders page heading, description, and back-to-home link", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProducts)

    const Component = await MerchandisePage()
    render(Component)

    expect(
      screen.getByRole("heading", { level: 1, name: /katalog merchandise/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/koleksi merchandise resmi dan produk dana usaha/i),
    ).toBeInTheDocument()

    const backLinks = screen.getAllByRole("link", {
      name: /kembali ke beranda/i,
    })
    expect(backLinks.length).toBeGreaterThan(0)
    expect(backLinks[0]).toHaveAttribute("href", "/")
  })

  it("renders empty state 'Merchandise Segera Hadir' when API returns empty array", async () => {
    mockedFetchProducts.mockResolvedValueOnce([])

    const Component = await MerchandisePage()
    render(Component)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Merchandise Segera Hadir",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Koleksi resmi Pixel To Reality sedang dipersiapkan/i),
    ).toBeInTheDocument()
  })

  it("renders product cards when API returns products", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProducts)

    const Component = await MerchandisePage()
    render(Component)

    expect(
      screen.getByAltText("Cyber T-Shirt merchandise"),
    ).toBeInTheDocument()
    expect(screen.getByText("Pixel Lanyard")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Pesan Cyber T-Shirt" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Pesan Pixel Lanyard" }),
    ).toBeInTheDocument()

    const section = screen.getByRole("region", {
      name: /daftar merchandise pameran/i,
    })
    expect(section).toBeInTheDocument()
    expect(
      within(section).getByAltText("Cyber T-Shirt merchandise"),
    ).toBeInTheDocument()
  })

  it("opens Order modal with the selected product when a product card is clicked", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProducts)
    const user = userEvent.setup()

    const Component = await MerchandisePage()
    render(Component)

    const orderButton = screen.getByRole("button", {
      name: "Pesan Cyber T-Shirt",
    })
    await user.click(orderButton)

    expect(
      screen.getByRole("heading", { level: 2, name: "Cyber T-Shirt" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Price : Rp 85.000")).toBeInTheDocument()
    expect(
      screen.getByText("Official cyberpunk t-shirt."),
    ).toBeInTheDocument()
  })
})
