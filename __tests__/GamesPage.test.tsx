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

  it("renders the directory heading, description, and list of games", async () => {
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
    expect(screen.getByText("An arcade runner in a cyberpunk universe.")).toBeInTheDocument();
    expect(screen.getByText("Cyber Defender")).toBeInTheDocument();
    expect(screen.getByText("Defend your terminal from byte invaders.")).toBeInTheDocument();

    // Back to home links
    const backLinks = screen.getAllByRole("link", { name: /kembali ke beranda/i });
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks[0]).toHaveAttribute("href", "/");

    // Section landmark
    const section = screen.getByRole("region", { name: /daftar game arcade/i });
    expect(section).toBeInTheDocument();
    expect(within(section).getByText("Pixel Runner")).toBeInTheDocument();
  });

  it("handles empty games list gracefully without crashing", async () => {
    (getGames as jest.Mock).mockResolvedValue([]);

    const Component = await GamesPage();
    render(Component);

    expect(
      screen.getByRole("heading", { level: 1, name: /direktori game/i }),
    ).toBeInTheDocument();
  });
});
