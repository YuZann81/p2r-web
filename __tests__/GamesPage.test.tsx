import { render, screen, within } from "@testing-library/react";
import GamesPage from "@/app/games/page";
import { getGames } from "@/lib/games/getGames";

jest.mock("@/lib/games/getGames", () => ({
  getGames: jest.fn(),
}));

const mockGames = [
  {
    id: "game-1",
    name: "Pixel Runner",
    description: "An arcade runner in a cyberpunk universe.",
    image: "/images/game-1.png",
    imageAlt: "Pixel Runner artwork",
    logo: "/images/game-1-logo.png",
    logoAlt: "Pixel Runner logo",
  },
  {
    id: "game-2",
    name: "Cyber Defender",
    description: "Defend your terminal from byte invaders.",
    image: "/images/game-2.png",
    imageAlt: "Cyber Defender artwork",
    logo: "/images/game-2-logo.png",
    logoAlt: "Cyber Defender logo",
  },
];

describe("GamesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the directory heading, description, and list of games with detail links", async () => {
    (getGames as jest.Mock).mockResolvedValue(mockGames);

    const Component = await GamesPage();
    render(Component);

    // Heading & Intro
    expect(
      screen.getByRole("heading", { level: 1, name: /direktori game/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/koleksi lengkap seluruh game arcade interaktif/i),
    ).toBeInTheDocument();

    // Game items
    expect(screen.getByText("Pixel Runner")).toBeInTheDocument();
    expect(
      screen.getByText("An arcade runner in a cyberpunk universe."),
    ).toBeInTheDocument();
    expect(screen.getByText("Cyber Defender")).toBeInTheDocument();
    expect(
      screen.getByText("Defend your terminal from byte invaders."),
    ).toBeInTheDocument();

    // Detail links
    const detailLinks = screen.getAllByRole("link", {
      name: /lihat detail game/i,
    });
    expect(detailLinks).toHaveLength(2);
    expect(detailLinks[0]).toHaveAttribute("href", "/games/game-1");
    expect(detailLinks[1]).toHaveAttribute("href", "/games/game-2");

    // Back to home links
    const backLinks = screen.getAllByRole("link", {
      name: /kembali ke beranda/i,
    });
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks[0]).toHaveAttribute("href", "/");

    // Section landmark
    const section = screen.getByRole("region", { name: /daftar game arcade/i });
    expect(section).toBeInTheDocument();
    expect(within(section).getByText("Pixel Runner")).toBeInTheDocument();
  });

  it("handles empty games list gracefully and renders empty state", async () => {
    (getGames as jest.Mock).mockResolvedValue([]);

    const Component = await GamesPage();
    render(Component);

    expect(
      screen.getByRole("heading", { level: 1, name: /direktori game/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /game segera hadir/i }),
    ).toBeInTheDocument();
  });
});
