import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MerchandiseSection from "@/components/MerchandiseSection"
import MerchandiseCard from "@/components/MerchandiseCard"
import OrderModal from "@/components/Order"
import { fetchProducts } from "@/lib/api/products"
import type { Product } from "@/lib/api/types/product"

jest.mock("@/lib/api/products", () => ({
  fetchProducts: jest.fn(),
}))

const mockedFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>

describe("MerchandiseSection & Components", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.alert = jest.fn()
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

    it("triggers onClick when the card or order button is clicked", async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()

      render(<MerchandiseCard product={mockProduct} onClick={onClick} />)

      await user.click(
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
      mockedFetchProducts.mockReturnValueOnce(new Promise(() => {}))

      render(<MerchandiseSection />)

      expect(
        screen.getByText("Memuat Katalog Merchandise..."),
      ).toBeInTheDocument()
    })

    it("displays empty state when API returns no products (data: [])", async () => {
      mockedFetchProducts.mockResolvedValueOnce([])

      render(<MerchandiseSection />)

      await waitFor(() => {
        expect(
          screen.getByText("Merchandise Segera Hadir"),
        ).toBeInTheDocument()
      })

      expect(
        screen.getByText(
          /Koleksi resmi Pixel To Reality sedang dipersiapkan/,
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("link", { name: "Lihat Semua Merchandise" }),
      ).toBeInTheDocument()
    })

    it("renders product cards and opens modal with selected product when clicked", async () => {
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

      mockedFetchProducts.mockResolvedValueOnce(mockProducts)
      const user = userEvent.setup()

      render(<MerchandiseSection />)

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Pesan Cyber T-Shirt" }),
        ).toBeInTheDocument()
      })

      await user.click(
        screen.getByRole("button", { name: "Pesan Cyber T-Shirt" }),
      )

      expect(screen.getByText("Cyber T-Shirt")).toBeInTheDocument()
      expect(screen.getByText("Price : Rp 85.000")).toBeInTheDocument()
    })
  })
})
