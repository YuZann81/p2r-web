"use client";

import GameArtwork from "@/components/GameArtwork";
import type { Game } from "@/lib/content";

type GameCardProps = {
  game: Game;
  reversed?: boolean;
  onSelect?: (game: Game) => void;
};

export default function GameCard({ game, reversed, onSelect }: GameCardProps) {
  const handleSelect = () => {
    console.log("Game card selected:", game.name);
    onSelect?.(game);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Select game: ${game.name}`}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className="group grid cursor-pointer grid-cols-1 items-center gap-10 rounded-lg p-4 outline-none transition-colors focus-visible:ring-4 focus-visible:ring-arcade-yellow/70 md:grid-cols-2 md:gap-16"
    >
      <div className={`flex justify-center ${reversed ? "md:order-2" : ""}`}>
        <GameArtwork
          image={game.image}
          imageAlt={game.imageAlt}
          logo={game.logo}
          logoAlt={game.logoAlt}
          tilt={reversed ? "right" : "left"}
        />
      </div>

      <div className={reversed ? "md:order-1" : ""}>
        <h3 className="font-display text-2xl text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-3xl">
          {game.name}
        </h3>
        <p className="mt-5 max-w-md text-base font-semibold leading-relaxed text-pretty text-white sm:text-lg">
          {game.description}
        </p>
      </div>
    </div>
  );
}
