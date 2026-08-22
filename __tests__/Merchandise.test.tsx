import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import MerchandiseSection from "@/components/MerchandiseSection"
import MerchandiseCard from "@/components/MerchandiseCard"
import OrderModal from "@/components/Order"
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

  describe("MerchandiseCard", () => {
    const mockProduct: Product = {
      id: "prod-1",
      name: "Cyber Arcade Lanyard",
      slug: "cyber-arcade-lanyard",
      description: "Official lanyard with retro pixel artwork.",
      price: 25000,
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

  describe("OrderModal", () => {
    it("renders selected product information with formatted price", () => {
      const mockProduct: Product = {
        id: "prod-2",
        name: "Cyber Keychain",
        slug: "cyber-keychain",
        description: "Pixel keychain collectible.",
        price: 35000,
        image_url: null,
      }

      render(<OrderModal product={mockProduct} onClose={jest.fn()} />)

      expect(screen.getByText("Cyber Keychain")).toBeInTheDocument()
      expect(
        screen.getByText("Pixel keychain collectible."),
      ).toBeInTheDocument()
      expect(screen.getByText("Price : Rp 35.000")).toBeInTheDocument()
    })

    it("renders neutral 'Price : Info via Admin' when price is null", () => {
      const mockProduct: Product = {
        id: "prod-3",
        name: "Special Sticker Pack",
        slug: "special-sticker-pack",
        description: null,
        price: null,
      }

      render(<OrderModal product={mockProduct} onClose={jest.fn()} />)

      expect(screen.getByText("Special Sticker Pack")).toBeInTheDocument()
      expect(screen.getByText("Price : Info via Admin")).toBeInTheDocument()
    })

    it("renders neutral 'Price : Info via Admin' when price is 0 or undefined", () => {
      const mockZeroPriceProduct: Product = {
        id: "prod-zero",
        name: "Promo Card",
        slug: "promo-card",
        description: "Free promo item",
        price: 0,
      }

      render(<OrderModal product={mockZeroPriceProduct} onClose={jest.fn()} />)

      expect(screen.getByText("Promo Card")).toBeInTheDocument()
      expect(screen.getByText("Price : Info via Admin")).toBeInTheDocument()
    })

    it("handles null product prop safely with defaults", () => {
      render(<OrderModal product={null} onClose={jest.fn()} />)

      expect(
        screen.getByText("Official P2R Merchandise"),
      ).toBeInTheDocument()
      expect(screen.getByText("Price : Info via Admin")).toBeInTheDocument()
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

      expect(screen.getByText("Cyber T-Shirt")).toBeInTheDocument()
      expect(screen.getByText("Price : Rp 85.000")).toBeInTheDocument()
    })

    it("redirects guest to login when ordering without authentication", async () => {
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

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/login?redirect="),
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("productId=prod-1"),
      )
    })
  })
})
