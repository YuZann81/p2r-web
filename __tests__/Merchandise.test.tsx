import { fireEvent, render, screen } from "@testing-library/react";
import MerchandiseSection from "@/components/MerchandiseSection";
import MerchandiseCard from "@/components/MerchandiseCard";
import MerchandiseInfoModal from "@/components/MerchandiseInfoModal";
import { fetchProducts } from "@/lib/api/products";
import type { Product } from "@/lib/api/types/product";

jest.mock("@/lib/api/products", () => {
  const actual = jest.requireActual("@/lib/api/products");
  return {
    ...actual,
    fetchProducts: jest.fn(),
  };
});

const mockedFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>;

describe("MerchandiseSection & Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("MerchandiseCard", () => {
    const mockProduct: Product = {
      id: "prod-1",
      name: "Cyber Arcade Lanyard",
      slug: "cyber-arcade-lanyard",
      description: "Official lanyard with retro pixel artwork.",
      price: 25,
      coin_price: 25,
      source_type: "organizer",
      image_url: "https://example.com/lanyard.png",
    };

    it("renders product name and accessible image alt text", () => {
      render(<MerchandiseCard product={mockProduct} onClick={jest.fn()} />);

      expect(
        screen.getByAltText(`${mockProduct.name} merchandise`),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: `Lihat detail ${mockProduct.name}` }),
      ).toBeInTheDocument();
    });

    it("triggers onClick when detail button is clicked", () => {
      const onClick = jest.fn();

      render(<MerchandiseCard product={mockProduct} onClick={onClick} />);

      fireEvent.click(
        screen.getByRole("button", { name: `Detail ${mockProduct.name}` }),
      );
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("MerchandiseInfoModal", () => {
    it("renders selected product information with coin price and booth instruction", () => {
      const mockProduct: Product = {
        id: "prod-2",
        name: "Cyber Keychain",
        slug: "cyber-keychain",
        description: "Pixel keychain collectible.",
        price: 35,
        coin_price: 35,
        source_type: "organizer",
        image_url: null,
      };

      render(<MerchandiseInfoModal product={mockProduct} onClose={jest.fn()} />);

      expect(screen.getByText("Cyber Keychain")).toBeInTheDocument();
      expect(
        screen.getByText("Pixel keychain collectible."),
      ).toBeInTheDocument();
      expect(screen.getByText("35 P2R Koin")).toBeInTheDocument();
      expect(screen.getByText(/booth panitia/i)).toBeInTheDocument();
    });

    it("returns null when product is null", () => {
      const { container } = render(
        <MerchandiseInfoModal product={null} onClose={jest.fn()} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("MerchandiseSection Integration", () => {
    it("renders loading indicator initially while fetching", () => {
      mockedFetchProducts.mockReturnValue(new Promise(() => {}));

      render(<MerchandiseSection />);

      expect(
        screen.getByText("Memuat Katalog Merchandise..."),
      ).toBeInTheDocument();
    });

    it("displays empty state when API returns no products", async () => {
      mockedFetchProducts.mockResolvedValue([]);

      render(<MerchandiseSection />);

      expect(
        await screen.findByText("Merchandise Segera Hadir"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Lihat Semua Merchandise" }),
      ).toBeInTheDocument();
    });

    it("renders product cards and opens info modal on click", async () => {
      const mockProducts: Product[] = [
        {
          id: "prod-1",
          name: "Cyber T-Shirt",
          slug: "cyber-t-shirt",
          description: "Black neon cyber t-shirt.",
          price: 85,
          coin_price: 85,
          source_type: "organizer",
          image_url: "https://example.com/shirt.png",
        },
      ];

      mockedFetchProducts.mockResolvedValue(mockProducts);

      render(<MerchandiseSection />);

      expect(
        await screen.findByRole("button", { name: "Lihat detail Cyber T-Shirt" }),
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", { name: "Lihat detail Cyber T-Shirt" }),
      );

      expect(screen.getByRole("dialog", { name: "Detail Cyber T-Shirt" })).toBeInTheDocument();
      expect(screen.getByText("85 P2R Koin")).toBeInTheDocument();
    });
  });
});
