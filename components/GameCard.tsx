"use client";

import React from "react";
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

  return (
    <article
      aria-label={game.name}
      className="group grid grid-cols-1 items-center gap-8 rounded-2xl p-2 transition-colors sm:p-4 md:grid-cols-2 md:gap-16"
    >
      <div className={`flex justify-center w-full px-2 sm:px-0 ${reversed ? "md:order-2" : ""}`}>
        <Link
          href={href}
          onClick={handleSelect}
          aria-label={`Lihat detail ${game.name}`}
          className="block w-full max-w-sm rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow transition-transform duration-200 hover:scale-[1.02]"
        >
          <GameArtwork
            image={game.image}
            imageAlt={game.imageAlt}
            logo={game.logo}
            logoAlt={game.logoAlt}
            tilt={reversed ? "right" : "left"}
          />
        </Link>
      </div>

      <div className={reversed ? "md:order-1" : ""}>
        <h3 className="font-display text-xl text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-2xl md:text-3xl">
          {game.name}
        </h3>
        <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-pretty text-white sm:mt-5 sm:text-base md:text-lg">
          {game.description}
        </p>

        <div className="mt-5 sm:mt-6">
          <Link
            href={href}
            onClick={handleSelect}
            className="inline-flex min-h-[44px] items-center justify-center bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Lihat Detail Game →
          </Link>
        </div>
      </div>
    </article>
  );
}
