import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameShowcase from "@/components/GameShowcase";
import type { Game } from "@/lib/content";

const SAMPLE_GAMES: Game[] = [
  {
    id: "save-the-savanna",
    name: "Save The Savanna",
    description: "Petualangan menjaga ekosistem savana karya siswa RPL.",
    image: "/images/game-1.png",
    imageAlt: "Save The Savanna artwork",
    logo: "",
    logoAlt: "Save The Savanna logo",
  },
  {
    id: "pixeltype",
    name: "PixelType",
    description: "Tantangan mengetik cepat bergaya arcade retro.",
    image: "https://cdn.example.com/pixeltype.png",
    imageAlt: "PixelType artwork",
    logo: "",
    logoAlt: "PixelType logo",
  },
];

describe("GameShowcase (Phase 2 dark-purple exhibition redesign)", () => {
  it("renders real games, sanitizes dead legacy image paths without broken <img>, and navigates cleanly", async () => {
    const user = userEvent.setup();
    const { container } = render(<GameShowcase games={SAMPLE_GAMES} />);

    expect(
      screen.getByRole("heading", { level: 2, name: /GAME PAMERAN/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Save The Savanna").length).toBeGreaterThan(0);

    // Dead legacy /images/game-1.png must NOT be rendered as an <img> src
    const imgs = Array.from(container.querySelectorAll("img"));
    expect(
      imgs.some((img) => img.getAttribute("src") === "/images/game-1.png"),
    ).toBe(false);
    // Valid API media URL IS preserved
    expect(
      imgs.some(
        (img) =>
          img.getAttribute("src") === "https://cdn.example.com/pixeltype.png",
      ),
    ).toBe(true);

    // Primary game CTA points to active game detail route
    const playLink = screen.getByRole("link", { name: "Mainkan Game" });
    expect(playLink).toHaveAttribute("href", "/games/save-the-savanna");

    // Advance to next game
    const nextButtons = screen.getAllByRole("button", {
      name: "Game Berikutnya",
    });
    await user.click(nextButtons[nextButtons.length - 1]);
    expect(screen.getByRole("link", { name: "Mainkan Game" })).toHaveAttribute(
      "href",
      "/games/pixeltype",
    );
  });

  it("renders honest empty state preserving #games anchor when no games exist", () => {
    const { container } = render(<GameShowcase games={[]} />);

    expect(container.querySelector("#games")).toBeInTheDocument();
    expect(screen.getByTestId("game-showcase-empty-state")).toBeInTheDocument();
    expect(screen.getByText(/Belum Ada Game Tersedia/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cyber Runner 2099/i)).not.toBeInTheDocument();
  });
});
