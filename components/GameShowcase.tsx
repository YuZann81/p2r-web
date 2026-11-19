"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Game } from "@/lib/content";

type GameShowcaseProps = {
  games: Game[];
};

export default function GameShowcase({ games }: GameShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!games || games.length === 0) {
    return null;
  }

  const activeGame = games[currentIndex] || games[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : games.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="games" className="relative w-full py-16 md:py-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading - Clean, no emojis */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2
            className="font-display text-4xl tracking-widest text-[#FFD447] sm:text-5xl md:text-6xl select-none"
            style={{
              textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
            }}
          >
            GAME ARCADE
          </h2>
          <p className="mt-3 max-w-lg font-body text-base text-[#FFF5E9]/80 sm:text-lg">
            Koleksi game arcade interaktif buatan siswa RPL. Mainkan langsung dan raih skor tertinggi!
          </p>
        </div>

        {/* Game Carousel / Card Display */}
        <div className="relative flex flex-col items-center">
          {/* Navigation Controls & Cards Row */}
          <div className="flex w-full items-center justify-center gap-4 sm:gap-8">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Game Sebelumnya"
              className="z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#FFD447] bg-[#39265E] text-[#FFD447] shadow-[4px_4px_0_#0E0A1A] transition-all hover:scale-105 active:translate-y-1 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Main Active Card */}
            <div className="w-full max-w-md rounded-3xl border-4 border-[#FFF5E9] bg-[#171224] p-5 shadow-[8px_8px_0_#0E0A1A] sm:p-7">
              {/* Artwork Box */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#39265E]/50">
                <img
                  src={activeGame.image || "/images/game-1.png"}
                  alt={activeGame.imageAlt || activeGame.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-lg bg-[#0E0A1A]/85 px-2.5 py-1 font-display text-xs text-[#FFD447] backdrop-blur-xs">
                  {currentIndex + 1} / {games.length}
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-5 text-center">
                <h3 className="font-display text-2xl tracking-wide text-[#FFD447] sm:text-3xl drop-shadow-[2px_2px_0_#0E0A1A]">
                  {activeGame.name}
                </h3>
                <p className="mt-2.5 line-clamp-2 font-body text-sm text-[#FFF5E9]/85 sm:text-base">
                  {activeGame.description}
                </p>
              </div>

              {/* CTA Button */}
              <div className="mt-6 flex justify-center">
                <Link
                  href={`/games/${activeGame.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-[#FFD447] px-8 py-3 font-display text-lg font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A]"
                >
                  Lihat Detail Game
                </Link>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Game Berikutnya"
              className="z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#FFD447] bg-[#39265E] text-[#FFD447] shadow-[4px_4px_0_#0E0A1A] transition-all hover:scale-105 active:translate-y-1 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {games.map((g, idx) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-sm transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "border-2 border-[#FFD447] bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A]"
                    : "border border-white/20 bg-[#39265E]/60 text-[#FFF5E9] hover:bg-[#39265E]"
                }`}
              >
                <span>{g.name}</span>
              </button>
            ))}
          </div>

          {/* View All Games Link - Clean pill style */}
          <div className="mt-10">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-xl border border-[#68D5E8]/40 bg-[#171224] px-6 py-2.5 font-display text-sm tracking-wider text-[#68D5E8] shadow-[2px_2px_0_#0E0A1A] transition-all hover:border-[#FFD447] hover:text-[#FFD447] hover:-translate-y-0.5"
            >
              Lihat Seluruh Direktori Game
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
