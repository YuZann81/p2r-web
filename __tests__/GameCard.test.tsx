import { fireEvent, render, screen } from "@testing-library/react";
import GameCard from "@/components/GameCard";
import type { Game } from "@/lib/content";

const game: Game = {
  id: "game-1",
  name: "Cyber Runner 2099",
  description:
    "Game arcade endless runner berkecepatan tinggi dengan nuansa visual cyberpunk neon.",
  image: "/images/game-1.png",
  imageAlt: "Cyber Runner 2099 game artwork",
  logo: "/images/game-1-logo.png",
  logoAlt: "Cyber Runner 2099 logo",
};

describe("GameCard Component", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("rendering & semantics", () => {
    it("renders as an article with game name label", () => {
      render(<GameCard game={game} />);
      expect(
        screen.getByRole("article", { name: game.name }),
      ).toBeInTheDocument();
    });

    it("renders the game name heading", () => {
      render(<GameCard game={game} />);
      expect(
        screen.getByRole("heading", { name: game.name }),
      ).toBeInTheDocument();
    });

    it("renders the game description", () => {
      render(<GameCard game={game} />);
      expect(screen.getByText(game.description)).toBeInTheDocument();
    });

    it("renders the game artwork image with accessible alt text", () => {
      render(<GameCard game={game} />);
      expect(screen.getByAltText(game.imageAlt)).toBeInTheDocument();
    });

    it("renders the game logo with accessible alt text", () => {
      render(<GameCard game={game} />);
      expect(screen.getByAltText(game.logoAlt)).toBeInTheDocument();
    });

    it("renders detail links pointing to /games/[id]", () => {
      render(<GameCard game={game} />);
      const ctaLink = screen.getByRole("link", { name: /lihat detail game/i });
      expect(ctaLink).toBeInTheDocument();
      expect(ctaLink).toHaveAttribute("href", `/games/${game.id}`);

      const artworkLink = screen.getByRole("link", {
        name: `Lihat detail ${game.name}`,
      });
      expect(artworkLink).toBeInTheDocument();
      expect(artworkLink).toHaveAttribute("href", `/games/${game.id}`);
    });

    it("does not render invalid nested button roles on card wrapper", () => {
      render(<GameCard game={game} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("calls onSelect with the game when CTA link is clicked", () => {
      const onSelect = jest.fn();
      render(<GameCard game={game} onSelect={onSelect} />);

      fireEvent.click(
        screen.getByRole("link", { name: /lihat detail game/i }),
      );

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(game);
    });

    it("logs an interaction event when the link is clicked", () => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      render(<GameCard game={game} />);

      fireEvent.click(
        screen.getByRole("link", { name: /lihat detail game/i }),
      );

      expect(logSpy).toHaveBeenCalledWith("Game card selected:", game.name);
    });

    it("does not throw when clicked without an onSelect handler", () => {
      jest.spyOn(console, "log").mockImplementation(() => {});
      render(<GameCard game={game} />);

      expect(() =>
        fireEvent.click(
          screen.getByRole("link", { name: /lihat detail game/i }),
        ),
      ).not.toThrow();
    });
  });
});
