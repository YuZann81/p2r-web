import { fireEvent, render, screen } from "@testing-library/react"
import MerchandiseSection from "@/components/MerchandiseSection"
import MerchandiseCard from "@/components/MerchandiseCard"
import MerchandiseDetailModal from "@/components/MerchandiseDetailModal"
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

describe("MerchandiseSection & Components", () => {
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
      bfcacheId: '',
    })
    mockedUseSearchParams.mockReturnValue(new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>)
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

  describe("MerchandiseCard", () => {
    const mockProduct: Product = {
      id: "prod-1",
      name: "Cyber Arcade Lanyard",
      slug: "cyber-arcade-lanyard",
      description: "Official lanyard with retro pixel artwork.",
      price: 25000,
      coin_price: 35,
      source_type: "organizer",
      image_url: "https://example.com/lanyard.png",
    }

    it("renders product name and accessible image alt text", () => {
      render(<MerchandiseCard product={mockProduct} onClick={jest.fn()} />)

      expect(
        screen.getByAltText(`${mockProduct.name} merchandise`),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: `Pesan ${mockProduct.name}` }),
      ).toBeInTheDocument()
    })

    it("triggers onClick when the card or order button is clicked", () => {
      const onClick = jest.fn()

      render(<MerchandiseCard product={mockProduct} onClick={onClick} />)

      fireEvent.click(
        screen.getByRole("button", { name: `Pesan ${mockProduct.name} Sekarang` }),
      )
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe("MerchandiseDetailModal", () => {
    it("renders selected product information with provider and acquisition instructions", () => {
      const mockProduct: Product = {
        id: "prod-2",
        name: "Cyber Keychain",
        slug: "cyber-keychain",
        description: "Pixel keychain collectible.",
        coin_price: 35,
        source_type: "organizer",
        image_url: null,
      }

      render(<MerchandiseDetailModal product={mockProduct} onClose={jest.fn()} />)

      expect(screen.getByText("Cyber Keychain")).toBeInTheDocument()
      expect(
        screen.getByText("Pixel keychain collectible."),
      ).toBeInTheDocument()
      expect(screen.getByText("★ Made by Committee")).toBeInTheDocument()
      expect(screen.getByText("Redeem at the committee booth")).toBeInTheDocument()
    })

    it("handles null product prop safely without rendering", () => {
      const { container } = render(<MerchandiseDetailModal product={null} onClose={jest.fn()} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe("MerchandiseSection Integration", () => {
    it("renders loading indicator initially while fetching", () => {
      mockedFetchProducts.mockReturnValue(new Promise(() => {}))

      render(<MerchandiseSection />)

      expect(
        screen.getByText("Memuat Katalog Merchandise..."),
      ).toBeInTheDocument()
    })

    it("displays empty state when API returns no products (data: [])", async () => {
      mockedFetchProducts.mockResolvedValue([])

      render(<MerchandiseSection />)

      expect(
        await screen.findByText("Merchandise Segera Hadir"),
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          /Koleksi resmi Pixel To Reality sedang dipersiapkan/,
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("link", { name: "Lihat Semua Merchandise" }),
      ).toBeInTheDocument()
    })

    it("renders product cards and opens modal with selected product when authenticated", async () => {
      const mockProducts: Product[] = [
        {
          id: "prod-1",
          name: "Cyber T-Shirt",
          slug: "cyber-t-shirt",
          description: "Black neon cyber t-shirt.",
          price: 85000,
          coin_price: 45,
          source_type: "organizer",
          image_url: "https://example.com/shirt.png",
        },
      ]

      mockedFetchProducts.mockResolvedValue(mockProducts)

      render(<MerchandiseSection />)

      expect(
        await screen.findByRole("button", { name: "Pesan Cyber T-Shirt" }),
      ).toBeInTheDocument()

      fireEvent.click(
        screen.getByRole("button", { name: "Pesan Cyber T-Shirt" }),
      )

      expect(screen.getAllByText("Cyber T-Shirt").length).toBeGreaterThan(0)
      expect(screen.getByText("Black neon cyber t-shirt.")).toBeInTheDocument()
    })

    it("allows guests to view merchandise details without redirecting to login", async () => {
      mockedUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
      })

      const mockProducts: Product[] = [
        {
          id: "prod-1",
          name: "Cyber T-Shirt",
          slug: "cyber-t-shirt",
          description: "Black neon cyber t-shirt.",
          price: 85000,
          coin_price: 45,
          source_type: "organizer",
          image_url: null,
        },
      ]

      mockedFetchProducts.mockResolvedValue(mockProducts)

      render(<MerchandiseSection />)

      expect(
        await screen.findByRole("button", { name: "Pesan Cyber T-Shirt" }),
      ).toBeInTheDocument()

      fireEvent.click(
        screen.getByRole("button", { name: "Pesan Cyber T-Shirt" }),
      )

      expect(screen.getAllByText("Cyber T-Shirt").length).toBeGreaterThan(0)
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
