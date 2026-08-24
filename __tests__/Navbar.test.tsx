import { fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider, useCart } from "@/lib/cart/cart-context";
import React, { useEffect } from "react";

function SeedCart() {
  const { addItem } = useCart();
  useEffect(() => {
    addItem(
      {
        id: "prod-1",
        name: "Lanyard",
        slug: "lanyard",
        description: "",
        price: 25000,
      },
      3,
    );
  }, [addItem]);
  return null;
}

describe("Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders desktop navigation links and cart button with count", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <SeedCart />
          <Navbar />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByRole("link", { name: "Information" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Karya" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Games" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Leaderboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Feeds" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Merchandise" })).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /keranjang belanja \(3 item\)/i }),
    ).toBeInTheDocument();
  });

  it("renders login button for guests and user session for authenticated user", () => {
    // 1. Guest state
    const { unmount } = render(
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByRole("link", { name: "Masuk" })).toBeInTheDocument();
    unmount();

    // 2. Authenticated state
    localStorage.setItem("p2r_auth_token", "sample-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "PlayerOne" }),
    );

    render(
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
    const userMenuBtn = screen.getByRole("button", { name: /menu pengguna/i });
    fireEvent.click(userMenuBtn);
    expect(screen.getByRole("button", { name: /keluar dari akun/i })).toBeInTheDocument();
  });

  it("toggles mobile drawer on hamburger click and closes on link click", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>,
    );

    const hamburger = screen.getByRole("button", {
      name: /buka menu navigasi/i,
    });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    // Open drawer
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: /tutup menu navigasi/i }),
    ).toBeInTheDocument();

    // Click link inside drawer to close
    const karyaLinks = screen.getAllByRole("link", { name: "Karya" });
    const mobileKaryaLink = karyaLinks[karyaLinks.length - 1];
    fireEvent.click(mobileKaryaLink);

    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens CustomDialog when clicking Keluar and logs out on confirm", async () => {
    localStorage.setItem("p2r_auth_token", "sample-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "PlayerOne" }),
    );

    render(
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>,
    );

    const userMenuBtn = screen.getByRole("button", { name: /menu pengguna/i });
    fireEvent.click(userMenuBtn);

    const logoutBtn = screen.getByRole("button", { name: /keluar dari akun/i });
    fireEvent.click(logoutBtn);

    // Custom dialog appears
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Konfirmasi Keluar")).toBeInTheDocument();
    expect(
      screen.getByText("Apakah Anda yakin ingin keluar dari akun Anda?"),
    ).toBeInTheDocument();

    // Click confirm in dialog
    const confirmBtn = within(dialog).getByRole("button", { name: "Keluar" });
    fireEvent.click(confirmBtn);

    // Token removed
    await waitFor(() => {
      expect(localStorage.getItem("p2r_auth_token")).toBeNull();
    });
  });
});
