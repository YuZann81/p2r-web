import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound (404 Page)", () => {
  it("renders the pixel art 404 illustration, animated heading, description, and navigation links without badge", () => {
    render(<NotFound />);

    // 1. Illustration
    expect(
      screen.getByRole("img", {
        name: /Ilustrasi Pixel Art Retro Arcade Error 404/i,
      }),
    ).toBeInTheDocument();

    // 2. Ensure badge (404 • LOST IN ARCADE) is completely removed
    expect(screen.queryByText(/LOST IN ARCADE/i)).not.toBeInTheDocument();

    // 3. Primary heading (initial phrase: PAGE NOT FOUND)
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "PAGE NOT FOUND",
    });
    expect(heading).toBeInTheDocument();

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

    // Ensure old card content is removed
    expect(screen.queryByText("GAME OVER")).not.toBeInTheDocument();
    expect(screen.queryByText("Lihat Game Arcade")).not.toBeInTheDocument();
    expect(screen.queryByText(/Stage Not Found/i)).not.toBeInTheDocument();
  });
});
