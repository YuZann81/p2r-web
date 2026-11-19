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
  const prevIndex = (currentIndex - 1 + games.length) % games.length;
  const nextIndex = (currentIndex + 1) % games.length;
  const prevGame = games[prevIndex];
  const nextGame = games[nextIndex];

  const handlePrev = () => {
    setCurrentIndex(prevIndex);
  };

  const handleNext = () => {
    setCurrentIndex(nextIndex);
  };

  return (
    <section id="games" className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#1F1834]">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading - Pixel "GAME" with Stars (Authentic to Mockup) */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative inline-flex items-center justify-center">
            <span className="font-display text-4xl sm:text-5xl md:text-6xl tracking-widest text-[#FFD447] select-none"
              style={{
                textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
              }}
            >
              GAME
            </span>
            {/* Retro Sparkles */}
            <span className="absolute -top-3 -right-6 text-lg sm:text-xl text-[#FFD447]">✦</span>
            <span className="absolute -bottom-2 -left-5 text-sm sm:text-base text-[#68D5E8]">✦</span>
          </div>
          <p className="mt-3 max-w-md font-body text-sm sm:text-base text-[#FFF5E9]/80">
            Koleksi game arcade interaktif buatan siswa RPL. Mainkan langsung dan raih skor tertinggi!
          </p>
        </div>

        {/* Carousel Showcase (Desain Kartu Sesuai Mockup) */}
        <div className="relative flex flex-col items-center">
          <div className="relative flex w-full max-w-5xl items-center justify-center gap-3 sm:gap-6 py-4">
            {/* Kartu Kiri (Game Sebelumnya) */}
            <div
              onClick={handlePrev}
              className="group relative hidden sm:flex flex-col items-center w-48 md:w-56 rounded-3xl border-2 border-[#39265E] bg-[#5E1386]/60 p-4 opacity-50 transition-all duration-200 hover:opacity-85 hover:scale-[1.02] cursor-pointer select-none"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0E0A1A]/60">
                <img
                  src={prevGame.image || "/images/game-1.png"}
                  alt={prevGame.name}
                  className="h-full w-full object-cover"
                />
                {/* Chevron Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A] text-base">
                    ◀
                  </span>
                </div>
              </div>
              <span className="mt-3 truncate max-w-full font-display text-xs text-[#FFF5E9]/75 text-center">
                {prevGame.name}
              </span>
            </div>

            {/* Tombol Panah Kiri Mobile */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Game Sebelumnya"
              className="sm:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#FFD447] bg-[#5E1386] text-[#FFD447] shadow-[3px_3px_0_#0E0A1A] active:translate-y-0.5 cursor-pointer"
            >
              ◀
            </button>

            {/* Kartu Utama (Game Terpilih - Rounded Purple Card Sesuai Mockup) */}
            <div className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md rounded-[2.5rem] border-4 border-[#39265E] bg-[#5E1386] p-5 sm:p-7 shadow-[8px_8px_0_#0E0A1A] z-10 transition-all">
              {/* Artwork Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#171224]">
                <img
                  src={activeGame.image || "/images/game-1.png"}
                  alt={activeGame.imageAlt || activeGame.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Game Name */}
              <h3 className="mt-4 font-display text-2xl sm:text-3xl tracking-wide text-white text-center drop-shadow-[2px_2px_0_#0E0A1A]">
                {activeGame.name}
              </h3>

              {/* Deskripsi Singkat */}
              <p className="mt-2 line-clamp-2 text-center font-body text-sm text-[#FFF5E9]/85">
                {activeGame.description}
              </p>

              {/* Single Action Button (Lihat / Mainkan Game - Sesuai Button "See Game" di Mockup) */}
              <div className="mt-5">
                <Link
                  href={`/games/${activeGame.id}`}
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#FFD447] bg-[#211B35] px-8 py-2.5 font-display text-sm tracking-wider font-bold text-[#FFD447] shadow-[3px_3px_0_#0E0A1A] transition-all hover:bg-[#FFD447] hover:text-[#0E0A1A] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  Mainkan Game
                </Link>
              </div>
            </div>

            {/* Tombol Panah Kanan Mobile */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Game Berikutnya"
              className="sm:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#FFD447] bg-[#5E1386] text-[#FFD447] shadow-[3px_3px_0_#0E0A1A] active:translate-y-0.5 cursor-pointer"
            >
              ▶
            </button>

            {/* Kartu Kanan (Game Berikutnya) */}
            <div
              onClick={handleNext}
              className="group relative hidden sm:flex flex-col items-center w-48 md:w-56 rounded-3xl border-2 border-[#39265E] bg-[#5E1386]/60 p-4 opacity-50 transition-all duration-200 hover:opacity-85 hover:scale-[1.02] cursor-pointer select-none"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0E0A1A]/60">
                <img
                  src={nextGame.image || "/images/game-1.png"}
                  alt={nextGame.name}
                  className="h-full w-full object-cover"
                />
                {/* Chevron Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A] text-base">
                    ▶
                  </span>
                </div>
              </div>
              <span className="mt-3 truncate max-w-full font-display text-xs text-[#FFF5E9]/75 text-center">
                {nextGame.name}
              </span>
            </div>
          </div>

          {/* Tombol Standar Bahasa Indonesia: Lihat Semua Game */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-xl border border-[#68D5E8]/40 bg-[#171224] px-6 py-2.5 font-display text-sm tracking-wider text-[#68D5E8] shadow-[2px_2px_0_#0E0A1A] transition-all hover:border-[#FFD447] hover:text-[#FFD447] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Lihat Semua Game</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
