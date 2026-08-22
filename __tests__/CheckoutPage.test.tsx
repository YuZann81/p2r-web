import React, { useEffect } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CheckoutPage from "@/app/checkout/page";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider, useCart } from "@/lib/cart/cart-context";
import { submitCheckout } from "@/lib/api/checkout";
import { getCurrentUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/api/types/product";

jest.mock("@/lib/api/checkout", () => ({
  submitCheckout: jest.fn(),
}));

jest.mock("@/lib/api/auth", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
  getCurrentUser: jest.fn().mockResolvedValue({
    success: true,
    data: { id: 1, name: "Cyber Player", phone: "0812345678" },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams() as any),
}));

const mockedSubmitCheckout = submitCheckout as jest.MockedFunction<
  typeof submitCheckout
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const mockProduct: Product = {
  id: "prod-1",
  name: "Cyber T-Shirt",
  slug: "cyber-t-shirt",
  description: "Cyberpunk graphic t-shirt",
  price: 85000,
};

function SeedCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  useEffect(() => {
    addItem(product, 2);
  }, [addItem, product]);
  return null;
}

describe("CheckoutPage (/checkout)", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it("renders empty cart state when no items are present", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /checkout pesanan/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /keranjang belanja kosong/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /jelajahi merchandise/i }),
    ).toBeInTheDocument();
  });

  it("renders cart items, quantity controls, and submits checkout successfully", async () => {
    // Seed user token in localStorage for authenticated state
    localStorage.setItem("p2r_auth_token", "sample-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Cyber Player", phone: "0812345678" }),
    );

    mockedSubmitCheckout.mockResolvedValueOnce({
      success: true,
      message: "Order placed",
      data: {
        id: "ORD-9999",
        order_number: "ORD-9999",
        customer_name: "Cyber Player",
        customer_phone: "0812345678",
        total_amount: 170000,
        status: "pending",
      },
    });

    render(
      <AuthProvider>
        <CartProvider>
          <SeedCart product={mockProduct} />
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(await screen.findByText("Cyber T-Shirt")).toBeInTheDocument();
    expect(screen.getAllByText("Rp 170.000").length).toBeGreaterThan(0);

    const submitButton = screen.getByRole("button", {
      name: /konfirmasi pesanan sekarang/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: /pesanan berhasil dibuat/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText("ORD-9999")).toBeInTheDocument();
    });
  });
});
