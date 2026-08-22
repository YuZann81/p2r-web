"use client";

import Link from "next/link";
import GameArtwork from "@/components/GameArtwork";
import type { Game } from "@/lib/content";

type GameCardProps = {
  game: Game;
  reversed?: boolean;
  onSelect?: (game: Game) => void;
  href?: string;
};

export default function GameCard({
  game,
  reversed,
  onSelect,
  href = `/games/${game.id}`,
}: GameCardProps) {
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

        <div className="mt-6">
          <Link
            href={href}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className="inline-flex items-center justify-center bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Lihat Detail Game →
          </Link>
        </div>
      </div>
    </div>
  );
}
