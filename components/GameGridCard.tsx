"use client";

import React from "react";
import Link from "next/link";
import type { Game } from "@/lib/content";

type GameGridCardProps = {
  game: Game;
  onSelect?: (game: Game) => void;
  href?: string;
};

export default function GameGridCard({
  game,
  onSelect,
  href = `/games/${game.id}`,
}: GameGridCardProps) {
  const handleSelect = () => {
    console.log("Game grid card selected:", game.name);
    onSelect?.(game);
  };

  return (
    <article
      aria-label={game.name}
      className="group flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-4 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)]"
    >
      <div>
        {/* Artwork Container */}
        <Link
          href={href}
          onClick={handleSelect}
          aria-label={`Lihat detail ${game.name}`}
          className="relative block aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/60 outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow"
        >
          <img
            src={game.image || "/placeholder.svg"}
            alt={game.imageAlt}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
          />
          {game.logo && (
            <div className="absolute bottom-2 left-2 h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-black/80 shadow sm:h-12 sm:w-12">
              <img
                src={game.logo}
                alt={game.logoAlt}
                className="h-full w-full object-cover [image-rendering:pixelated]"
              />
            </div>
          )}
        </Link>

        {/* Title & Description */}
        <div className="mt-4">
          <Link
            href={href}
            onClick={handleSelect}
            className="outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
          >
            <h3 className="font-display text-xl text-arcade-yellow transition-colors group-hover:underline [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-2xl">
              {game.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm font-medium leading-relaxed text-white/80 line-clamp-2">
            {game.description}
          </p>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <Link
          href={href}
          onClick={handleSelect}
          className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-arcade-yellow px-5 py-2 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span>Lihat Detail Game</span>
          <span aria-hidden="true" className="ml-1.5 transition-transform duration-150 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
