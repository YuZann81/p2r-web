import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound (404 Page)", () => {
  it("renders the pixel art 404 illustration, stable accessible heading, description, and navigation links", () => {
    render(<NotFound />);

    // 1. Illustration
    const illustration = screen.getByRole("img", {
      name: /Ilustrasi Pixel Art Retro Arcade Error 404/i,
    });
    expect(illustration).toBeInTheDocument();

    // Verify animated SVG groups include motion-reduce:animate-none
    const animatedGroups = illustration.querySelectorAll("g[class*='animate-']");
    expect(animatedGroups.length).toBeGreaterThanOrEqual(3);
    animatedGroups.forEach((group) => {
      expect(group.getAttribute("class")).toContain("motion-reduce:animate-none");
    });

    // 2. Ensure badge (404 • LOST IN ARCADE) is not rendered
    expect(screen.queryByText(/LOST IN ARCADE/i)).not.toBeInTheDocument();

    // 3. Stable accessible primary heading (no aria-live)
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "PAGE NOT FOUND",
    });
    expect(heading).toBeInTheDocument();
    expect(heading).not.toHaveAttribute("aria-live");

    // 4. Short description
    expect(
      screen.getByText(
        "Oops! Halaman yang kamu cari tidak ditemukan atau mungkin telah berpindah dimensi.",
      ),
    ).toBeInTheDocument();

    // 5. Navigation links
    const homeLink = screen.getByRole("link", { name: "Kembali ke Beranda" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    const gamesLink = screen.getByRole("link", { name: "Jelajahi Game" });
    expect(gamesLink).toBeInTheDocument();
    expect(gamesLink).toHaveAttribute("href", "/games");
  });
});
