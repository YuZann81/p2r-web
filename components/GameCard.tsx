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
      className="group grid cursor-pointer grid-cols-1 items-center gap-8 rounded-3xl border-2 border-[#39265E] bg-[#211B35] p-6 shadow-[6px_6px_0_#0E0A1A] transition-all hover:border-[#FFD447]/60 hover:shadow-[8px_8px_0_#0E0A1A] md:grid-cols-2 md:gap-14 md:p-8"
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
        <div className="inline-block rounded-lg bg-[#68D5E8]/20 px-3 py-1 font-display text-xs text-[#68D5E8] mb-3">
          ARCADE GAME
        </div>
        <h3 className="font-display text-3xl text-[#FFD447] sm:text-4xl drop-shadow-[2px_2px_0_#0E0A1A]">
          {game.name}
        </h3>
        <p className="mt-4 max-w-md font-body text-base leading-relaxed text-[#FFF5E9]/85">
          {game.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={href}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-[#FFD447] px-6 py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#B8960A] active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Lihat Detail Game
          </Link>
        </div>
      </div>
    </div>
  );
}
