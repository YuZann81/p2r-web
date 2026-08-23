import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutPage from "@/app/checkout/page";
import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { CartProvider, useCart } from "@/lib/cart/cart-context";
import { submitCheckout } from "@/lib/api/checkout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import type { Product } from "@/lib/api/types/product";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock("@/lib/api/checkout", () => ({
  submitCheckout: jest.fn(),
}));

const mockPush = jest.fn();
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedSubmitCheckout = submitCheckout as jest.MockedFunction<
  typeof submitCheckout
>;

const sampleProduct: Product = {
  id: "prod-1",
  name: "Cyber T-Shirt",
  slug: "cyber-t-shirt",
  description: "Official cyberpunk t-shirt.",
  price: 85000,
  stock: 10,
  image_url: "https://example.com/tshirt.png",
  category: "Fashion",
  status: "Ready Stock",
};

function SeedCart({ items = [sampleProduct], qty = 2 }: { items?: Product[]; qty?: number }) {
  const { addItem } = useCart();
  useEffect(() => {
    for (const item of items) {
      addItem(item, qty);
    }
  }, [addItem, items, qty]);
  return null;
}

describe("CheckoutPage Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as unknown as ReturnType<typeof useRouter>);
  });

  it("renders empty cart state with CTA to merchandise catalog when cart has no items", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByText("Keranjang Belanja Kosong")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /jelajahi merchandise/i }),
    ).toHaveAttribute("href", "/merchandise");
  });

  it("renders cart items, unit price, quantity, and total price correctly", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <SeedCart items={[sampleProduct]} qty={2} />
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByText("Cyber T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("Rp 85.000")).toBeInTheDocument();
    expect(screen.getAllByText("Rp 170.000").length).toBeGreaterThan(0);
    expect(screen.getByText("Total Item")).toBeInTheDocument();
  });

  it("increments and decrements item quantity and updates subtotal", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <CartProvider>
          <SeedCart items={[sampleProduct]} qty={2} />
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    const plusBtn = screen.getByRole("button", { name: /tambah cyber t-shirt/i });
    await user.click(plusBtn);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getAllByText("Rp 255.000").length).toBeGreaterThan(0);

    const minusBtn = screen.getByRole("button", { name: /kurangi cyber t-shirt/i });
    await user.click(minusBtn);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("Rp 170.000").length).toBeGreaterThan(0);
  });

  it("removes item from cart when remove button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <CartProvider>
          <SeedCart items={[sampleProduct]} qty={1} />
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByText("Cyber T-Shirt")).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: "Hapus" });
    await user.click(removeBtn);

    expect(screen.getByText("Keranjang Belanja Kosong")).toBeInTheDocument();
  });

  it("redirects guest to login with redirect param when submitting unauthenticated", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <CartProvider>
          <SeedCart items={[sampleProduct]} qty={1} />
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    expect(
      screen.getByRole("status", { name: "Pemberitahuan Masuk" }),
    ).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", {
      name: /masuk & konfirmasi pesanan/i,
    });
    await user.click(submitBtn);

    expect(mockPush).toHaveBeenCalledWith("/login?redirect=/checkout");
  });

  it("submits checkout payload successfully when authenticated and clears cart", async () => {
    localStorage.setItem("p2r_auth_token", "sample-valid-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({
        id: "usr-1",
        name: "Razzan Player",
        email: "razzan@example.com",
        phone: "081234567890",
      }),
    );

    mockedSubmitCheckout.mockResolvedValueOnce({
      success: true,
      message: "Order placed successfully",
      data: {
        id: "P2R-998877",
        order_number: "ORD-998877",
        customer_name: "Razzan Player",
        customer_phone: "081234567890",
        total_amount: 170000,
        status: "pending",
      },
    });

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <CartProvider>
          <SeedCart items={[sampleProduct]} qty={2} />
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>,
    );

    // Form should be auto pre-filled from auth user
    const nameInput = screen.getByLabelText(/nama lengkap \*/i);
    expect(nameInput).toHaveValue("Razzan Player");

    const phoneInput = screen.getByLabelText(/nomor whatsapp \/ hp \*/i);
    expect(phoneInput).toHaveValue("081234567890");

    const submitBtn = screen.getByRole("button", {
      name: /konfirmasi pesanan sekarang/i,
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockedSubmitCheckout).toHaveBeenCalledWith(
        {
          customer_name: "Razzan Player",
          customer_phone: "081234567890",
          customer_class: undefined,
          customer_major: undefined,
          notes: undefined,
          items: [{ product_id: "prod-1", quantity: 2 }],
        },
        "sample-valid-token",
      );
    });

    // Confirmation receipt screen should be visible
    expect(
      await screen.findByRole("heading", { name: "PESANAN BERHASIL DIBUAT!" }),
    ).toBeInTheDocument();
    expect(screen.getByText("P2R-998877")).toBeInTheDocument();
  });
});
