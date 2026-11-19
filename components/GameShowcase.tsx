"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Game } from "@/lib/content";

type GameShowcaseProps = {
  games: Game[];
};

function GameArtwork({
  image,
  alt,
  title,
}: {
  image?: string;
  alt?: string;
  title: string;
}) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if image URL changes
  useEffect(() => {
    setHasError(false);
  }, [image]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#171224] flex items-center justify-center">
      {!hasError && image ? (
        <img
          src={image}
          alt={alt || title}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : null}

      {hasError || !image ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#211B35] to-[#0E0A1A] p-4 text-center select-none">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#FFD447]/20 border border-[#FFD447]/40 text-2xl sm:text-3xl shadow-inner">
            🕹️
          </div>
          <span className="mt-2.5 font-display text-sm sm:text-base text-[#FFD447] tracking-wider uppercase drop-shadow-[1px_1px_0_#0E0A1A]">
            {title}
          </span>
          <span className="font-body text-[10px] sm:text-xs text-[#68D5E8] tracking-widest uppercase">
            Cyber Arcade Game
          </span>
        </div>
      ) : null}
    </div>
  );
}

function PreviewArtwork({
  image,
  title,
  arrow,
}: {
  image?: string;
  title: string;
  arrow: "◀" | "▶";
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [image]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0E0A1A]/60 flex items-center justify-center">
      {!hasError && image ? (
        <img
          src={image}
          alt={title}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#211B35]/90 to-[#0E0A1A]">
          <span className="text-2xl opacity-40">🕹️</span>
        </div>
      )}

      {/* Chevron Overlay Button */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A] text-base transition-transform group-hover:scale-110">
          {arrow}
        </span>
      </div>
    </div>
  );
}

export default function GameShowcase({ games }: GameShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [animPhase, setAnimPhase] = useState<"idle" | "exiting" | "entering">("idle");
  const isBusyRef = useRef(false);

  // Touch gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!games || games.length === 0) {
    return null;
  }

  const N = games.length;
  const activeGame = games[currentIndex] || games[0];
  const prevIndex = (currentIndex - 1 + N) % N;
  const nextIndex = (currentIndex + 1) % N;
  const prevGame = games[prevIndex];
  const nextGame = games[nextIndex];

  const handleNext = () => {
    if (isBusyRef.current || N <= 1) return;
    isBusyRef.current = true;
    setSlideDirection("next");
    setAnimPhase("exiting");

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setAnimPhase("entering");

      requestAnimationFrame(() => {
        setTimeout(() => {
          setAnimPhase("idle");
          isBusyRef.current = false;
        }, 30);
      });
    }, 220);
  };

  const handlePrev = () => {
    if (isBusyRef.current || N <= 1) return;
    isBusyRef.current = true;
    setSlideDirection("prev");
    setAnimPhase("exiting");

    setTimeout(() => {
      setCurrentIndex(prevIndex);
      setAnimPhase("entering");

      requestAnimationFrame(() => {
        setTimeout(() => {
          setAnimPhase("idle");
          isBusyRef.current = false;
        }, 30);
      });
    }, 220);
  };

  // Touch swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
  };

  // Keyboard arrow keys
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  // Animation transform styles for the Center Card
  const getCenterAnimClass = () => {
    if (animPhase === "exiting") {
      return slideDirection === "next"
        ? "-translate-x-12 opacity-0 scale-95 transition-all duration-200 ease-out"
        : "translate-x-12 opacity-0 scale-95 transition-all duration-200 ease-out";
    }
    if (animPhase === "entering") {
      return slideDirection === "next"
        ? "translate-x-12 opacity-0 scale-95 transition-none"
        : "-translate-x-12 opacity-0 scale-95 transition-none";
    }
    return "translate-x-0 opacity-100 scale-100 transition-all duration-250 ease-out";
  };

  // Animation transform styles for Side Cards
  const getSideAnimClass = (side: "left" | "right") => {
    if (animPhase === "exiting") {
      if (slideDirection === "next") {
        return side === "left"
          ? "-translate-x-6 opacity-0 transition-all duration-200 ease-out"
          : "-translate-x-8 opacity-85 scale-105 transition-all duration-200 ease-out";
      } else {
        return side === "right"
          ? "translate-x-6 opacity-0 transition-all duration-200 ease-out"
          : "translate-x-8 opacity-85 scale-105 transition-all duration-200 ease-out";
      }
    }
    if (animPhase === "entering") {
      return slideDirection === "next"
        ? "translate-x-6 opacity-20 transition-none"
        : "-translate-x-6 opacity-20 transition-none";
    }
    return "translate-x-0 opacity-50 scale-100 transition-all duration-250 ease-out";
  };

  return (
    <section
      id="games"
      aria-label="Game Showcase"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#1F1834] overflow-hidden focus-visible:outline-none"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading - Pixel "GAME" with Stars */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative inline-flex items-center justify-center">
            <span
              className="font-display text-4xl sm:text-5xl md:text-6xl tracking-widest text-[#FFD447] select-none"
              style={{
                textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
              }}
            >
              GAME
            </span>
            {/* Retro Sparkles */}
            <span className="absolute -top-3 -right-6 text-lg sm:text-xl text-[#FFD447]" aria-hidden="true">
              ✦
            </span>
            <span className="absolute -bottom-2 -left-5 text-sm sm:text-base text-[#68D5E8]" aria-hidden="true">
              ✦
            </span>
          </div>
        </div>

        {/* Carousel Showcase Container */}
        <div
          className="relative flex flex-col items-center select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative flex w-full max-w-5xl items-center justify-center gap-3 sm:gap-6 py-4">
            {/* Kartu Kiri (Game Sebelumnya) */}
            <div
              onClick={handlePrev}
              role="button"
              aria-label="Game Sebelumnya"
              className={`group relative hidden sm:flex flex-col items-center w-48 md:w-56 rounded-3xl border-2 border-[#39265E] bg-[#5E1386]/60 p-4 hover:opacity-85 hover:scale-[1.02] cursor-pointer select-none ${getSideAnimClass(
                "left",
              )}`}
            >
              <PreviewArtwork image={prevGame.image} title={prevGame.name} arrow="◀" />
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
            <div
              className={`relative flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md rounded-[2.5rem] border-4 border-[#39265E] bg-[#5E1386] p-5 sm:p-7 shadow-[8px_8px_0_#0E0A1A] z-10 ${getCenterAnimClass()}`}
            >
              {/* Artwork Container */}
              <GameArtwork
                image={activeGame.image}
                alt={activeGame.imageAlt}
                title={activeGame.name}
              />

              {/* Game Name */}
              <h3 className="mt-4 truncate max-w-full font-display text-2xl sm:text-3xl tracking-wide text-white text-center drop-shadow-[2px_2px_0_#0E0A1A]">
                {activeGame.name}
              </h3>

              {/* Deskripsi Singkat */}
              <p className="mt-2 line-clamp-2 text-center font-body text-sm text-[#FFF5E9]/85">
                {activeGame.description}
              </p>

              {/* Single Action Button (Mainkan Game) */}
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
              role="button"
              aria-label="Game Berikutnya"
              className={`group relative hidden sm:flex flex-col items-center w-48 md:w-56 rounded-3xl border-2 border-[#39265E] bg-[#5E1386]/60 p-4 hover:opacity-85 hover:scale-[1.02] cursor-pointer select-none ${getSideAnimClass(
                "right",
              )}`}
            >
              <PreviewArtwork image={nextGame.image} title={nextGame.name} arrow="▶" />
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
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
