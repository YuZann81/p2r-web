import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth/auth-context";
import React from "react";

jest.mock("@/lib/api/auth", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    success: true,
    data: { id: 1, name: "PlayerOne", email: "p1@test.com" },
  }),
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders desktop navigation links and login action", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>,
    );

    expect(screen.getByRole("link", { name: "Information" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Karya" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Games" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Leaderboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Feeds" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Masuk" })).toBeInTheDocument();
  });

  it("renders login button for guests and user session for authenticated user", async () => {
    // 1. Guest state
    const { unmount } = render(
      <AuthProvider>
        <Navbar />
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
        <Navbar />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hai, PlayerOne")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Keluar" })).toBeInTheDocument();
    });
  });

  it("toggles mobile drawer on hamburger click and closes on link click", () => {
    render(
      <AuthProvider>
        <Navbar />
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
});
