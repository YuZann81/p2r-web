import { fireEvent, render, screen } from "@testing-library/react";
import GameCard from "@/components/GameCard";
import { GAMES } from "@/lib/content";

const game = GAMES[0];

describe("GameCard", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders the game name", () => {
      render(<GameCard game={game} />);
      expect(
        screen.getByRole("heading", { name: game.name }),
      ).toBeInTheDocument();
    });

    it("renders the game description", () => {
      render(<GameCard game={game} />);
      expect(screen.getByText(game.description)).toBeInTheDocument();
    });

    it("renders the game image with accessible alt text", () => {
      render(<GameCard game={game} />);
      expect(screen.getByAltText(game.imageAlt)).toBeInTheDocument();
    });

    it("renders the game logo with accessible alt text", () => {
      render(<GameCard game={game} />);
      expect(screen.getByAltText(game.logoAlt)).toBeInTheDocument();
    });

    it("exposes the card as a button labelled with the game name", () => {
      render(<GameCard game={game} />);
      expect(
        screen.getByRole("button", { name: new RegExp(game.name, "i") }),
      ).toBeInTheDocument();
    });

    it("renders a detail link pointing to /games/[id]", () => {
      render(<GameCard game={game} />);
      const link = screen.getByRole("link", { name: /lihat detail game/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/games/${game.id}`);
    });
  });

  describe("interaction", () => {
    it("calls onSelect with the game when clicked", () => {
      const onSelect = jest.fn();
      render(<GameCard game={game} onSelect={onSelect} />);

      fireEvent.click(screen.getByRole("button"));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(game);
    });

    it("logs an interaction event when the card is selected", () => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      render(<GameCard game={game} />);

      fireEvent.click(screen.getByRole("button"));

      expect(logSpy).toHaveBeenCalledWith("Game card selected:", game.name);
    });

    it("selects the game via keyboard (Enter)", () => {
      const onSelect = jest.fn();
      render(<GameCard game={game} onSelect={onSelect} />);

      fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });

      expect(onSelect).toHaveBeenCalledWith(game);
    });

    it("does not throw when clicked without an onSelect handler", () => {
      jest.spyOn(console, "log").mockImplementation(() => {});
      render(<GameCard game={game} />);

      expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
    });
  });
});
