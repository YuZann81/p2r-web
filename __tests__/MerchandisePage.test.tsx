import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MerchandisePage from "@/app/merchandise/page"
import { fetchProducts } from "@/lib/api/products"
import type { Product } from "@/lib/api/types/product"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"

jest.mock("@/lib/api/products", () => ({
  fetchProducts: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock("@/lib/auth/auth-context", () => ({
  useAuth: jest.fn(),
}))

const mockedFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

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
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    window.alert = jest.fn()
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      bfcacheId: "",
    })
    mockedUseSearchParams.mockReturnValue(new URLSearchParams() as any)
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: "Player One", email: "player@test.com" },
      token: "valid-token",
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    })
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

  it("renders empty state 'Belum ada merchandise yang tersedia.' when API returns empty array", async () => {
    mockedFetchProducts.mockResolvedValueOnce([])

    const Component = await MerchandisePage()
    render(Component)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Belum ada merchandise yang tersedia.",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Koleksi cinderamata resmi pameran sedang dipersiapkan/i),
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

  it("opens Order modal with the selected product when authenticated user clicks order button", async () => {
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
    expect(screen.getByText("Harga: Rp 85.000")).toBeInTheDocument()
    expect(
      screen.getAllByText("Official cyberpunk t-shirt.").length,
    ).toBeGreaterThan(0)
  })

  it("redirects guest to login with redirect param when order button is clicked", async () => {
    mockedUseAuth.mockReturnValueOnce({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    })

    mockedFetchProducts.mockResolvedValueOnce(mockProducts)
    const user = userEvent.setup()

    const Component = await MerchandisePage()
    render(Component)

    const orderButton = screen.getByRole("button", {
      name: "Pesan Cyber T-Shirt",
    })
    await user.click(orderButton)

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/login?redirect="),
    )
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("productId=prod-1"),
    )
  })

  it("filters products via live search input", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProducts)
    const user = userEvent.setup()

    const Component = await MerchandisePage()
    render(Component)

    const searchInput = screen.getByLabelText(/cari katalog merchandise/i)
    await user.type(searchInput, "Lanyard")

    expect(screen.getByText("Menampilkan 1 dari 2 Merchandise")).toBeInTheDocument()
    expect(screen.getByText("Pixel Lanyard")).toBeInTheDocument()
    expect(screen.queryByText("Cyber T-Shirt")).not.toBeInTheDocument()
  })

  it("renders fundraising context and exploration navigation links", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProducts)

    const Component = await MerchandisePage()
    render(Component)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /tentang dana usaha & merchandise/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole("link", { name: /jelajahi galeri karya →/i }),
    ).toHaveAttribute("href", "/karya")

    expect(
      screen.getByRole("link", { name: /mainkan game arcade →/i }),
    ).toHaveAttribute("href", "/games")
  })
})
