import React, { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ShopHubPage from "@/app/shop/page";
import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { CartProvider, useCart } from "@/lib/cart/cart-context";
import { getOrders } from "@/lib/api/orders";

jest.mock("@/lib/api/orders", () => ({
  getOrders: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/shop",
}));

const mockedGetOrders = getOrders as jest.MockedFunction<typeof getOrders>;

function SeedCartItems() {
  const { addItem } = useCart();
  useEffect(() => {
    addItem(
      {
        id: "prod-1",
        name: "Kaos Cyber Arcade",
        slug: "kaos-cyber-arcade",
        price: 85000,
      },
      2,
    );
  }, [addItem]);
  return null;
}

describe("ShopHubPage (/shop)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockedGetOrders.mockResolvedValue([]);
  });

  it("renders page header and three core commerce hub cards (Cart, Orders, Catalog)", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <ShopHubPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByRole("heading", { name: "P2R COMMERCE" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Keranjang Belanja" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Pesanan Saya" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Katalog Merchandise" })).toBeInTheDocument();

    // Verify destination links
    expect(screen.getByRole("link", { name: /buka keranjang/i })).toHaveAttribute("href", "/checkout");
    expect(screen.getByRole("link", { name: /lihat semua pesanan/i })).toHaveAttribute("href", "/orders");
    expect(screen.getByRole("link", { name: /jelajahi katalog/i })).toHaveAttribute("href", "/merchandise");
  });

  it("displays cart item quantity and estimated total price when items exist in cart", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <SeedCartItems />
          <ShopHubPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByText("2 Item")).toBeInTheDocument();
    expect(screen.getByText("Rp 170.000")).toBeInTheDocument();
    expect(screen.getByText(/item terbaru: kaos cyber arcade/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /buka keranjang & checkout →/i }),
    ).toBeInTheDocument();
  });

  it("fetches and displays active orders count for authenticated user", async () => {
    localStorage.setItem("p2r_auth_token", "sample-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "GamerPro" }),
    );

    mockedGetOrders.mockResolvedValueOnce([
      {
        id: "ord_1",
        order_code: "ORD-001",
        status: "processing",
        payment_status: "waiting_payment",
        subtotal: "85000",
        grand_total: "85000",
        total_items: 1,
        total_quantity: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [],
      },
    ]);

    render(
      <AuthProvider>
        <CartProvider>
          <ShopHubPage />
        </CartProvider>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("1 Aktif")).toBeInTheDocument();
      expect(
        screen.getByText(/ada 1 pesanan yang sedang diproses/i),
      ).toBeInTheDocument();
    });
  });
});
