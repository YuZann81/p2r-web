"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Game } from "@/lib/content";

type GameShowcaseProps = {
  games: Game[];
};

export default function GameShowcase({ games }: GameShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Touch swipe refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!games || games.length === 0) {
    return null;
  }

  const N = games.length;

  const handleNext = () => {
    if (isAnimating || N <= 1) return;
    setIsAnimating(true);
    setSlideDirection("next");
  };

  const handlePrev = () => {
    if (isAnimating || N <= 1) return;
    setIsAnimating(true);
    setSlideDirection("prev");
  };

  // Synchronize state after slide animation completes (450ms)
  useEffect(() => {
    if (!slideDirection) return;

    const timer = setTimeout(() => {
      if (slideDirection === "next") {
        setCurrentIndex((prev) => (prev + 1) % N);
      } else if (slideDirection === "prev") {
        setCurrentIndex((prev) => (prev - 1 + N) % N);
      }
      setSlideDirection(null);
      setIsAnimating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [slideDirection, N]);

  // Touch swipe gesture handlers
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
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  // Slots: [-2, -1, 0, 1, 2] centered at currentIndex
  const slots = [-2, -1, 0, 1, 2].map((offset) => {
    const gameIndex = (currentIndex + offset + N * 10) % N;
    return {
      offset,
      game: games[gameIndex],
    };
  });

  return (
    <section
      id="games"
      aria-label="Game Showcase"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#1F1834] overflow-hidden focus-visible:outline-none"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading - Pixel "GAME" with Retro Stars */}
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

        {/* Carousel Viewport Container */}
        <div
          className="relative w-full overflow-hidden py-4 select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Continuous Sliding Track: Exactly 5 items, each 20% of track width */}
          <div
            className="flex items-center justify-center will-change-transform"
            style={{
              transform:
                slideDirection === "next"
                  ? "translateX(-20%)"
                  : slideDirection === "prev"
                    ? "translateX(20%)"
                    : "translateX(0%)",
              transition: isAnimating
                ? "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
            }}
          >
            {slots.map(({ offset, game }) => {
              // Target state calculation during slide:
              // When sliding 'next', item at offset k shifts toward (k - 1)
              // When sliding 'prev', item at offset k shifts toward (k + 1)
              let targetRole: "center" | "left" | "right" | "far";
              if (slideDirection === "next") {
                if (offset === 1) targetRole = "center";
                else if (offset === 0) targetRole = "left";
                else if (offset === 2) targetRole = "right";
                else targetRole = "far";
              } else if (slideDirection === "prev") {
                if (offset === -1) targetRole = "center";
                else if (offset === 0) targetRole = "right";
                else if (offset === -2) targetRole = "left";
                else targetRole = "far";
              } else {
                if (offset === 0) targetRole = "center";
                else if (offset === -1) targetRole = "left";
                else if (offset === 1) targetRole = "right";
                else targetRole = "far";
              }

              const isCenter = targetRole === "center";
              const isLeft = targetRole === "left";
              const isRight = targetRole === "right";
              const isFar = targetRole === "far";

              // Click handler for card
              const handleCardClick = () => {
                if (offset === -1 && !isAnimating) {
                  handlePrev();
                } else if (offset === 1 && !isAnimating) {
                  handleNext();
                }
              };

              return (
                <div
                  key={`${offset}-${game.id}`}
                  className="w-[85vw] max-w-[320px] sm:max-w-[380px] md:max-w-[420px] shrink-0 px-2 sm:px-3 flex justify-center"
                >
                  <div
                    onClick={handleCardClick}
                    className={`group relative flex flex-col items-center w-full rounded-[2.5rem] p-5 sm:p-7 transition-all duration-450 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      isCenter
                        ? "z-20 scale-100 opacity-100 border-4 border-[#39265E] bg-[#5E1386] shadow-[8px_8px_0_#0E0A1A] cursor-default"
                        : isLeft || isRight
                          ? "z-10 scale-[0.84] opacity-55 border-2 sm:border-4 border-[#39265E] bg-[#5E1386]/80 hover:opacity-85 hover:scale-[0.87] cursor-pointer"
                          : "z-0 scale-[0.70] opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* Artwork Container */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#171224]">
                      <img
                        src={game.image || "/images/game-1.png"}
                        alt={game.imageAlt || game.name}
                        className="h-full w-full object-cover"
                      />

                      {/* Direction Chevron Overlay on Preview Cards */}
                      {!isCenter && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-300 ${
                            isLeft || isRight ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <span
                            aria-label={isLeft ? "Game Sebelumnya" : "Game Berikutnya"}
                            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A] text-base sm:text-lg transition-transform group-hover:scale-110"
                          >
                            {isLeft ? "◀" : "▶"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Game Title */}
                    <h3 className="mt-4 truncate max-w-full font-display text-2xl sm:text-3xl tracking-wide text-white text-center drop-shadow-[2px_2px_0_#0E0A1A]">
                      {game.name}
                    </h3>

                    {/* Description - Smooth Fade for Center Card */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isCenter
                          ? "mt-2 max-h-24 opacity-100"
                          : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <p className="line-clamp-2 text-center font-body text-sm text-[#FFF5E9]/85">
                        {game.description}
                      </p>
                    </div>

                    {/* CTA Button: Mainkan Game - Smooth Reveal for Center Card */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isCenter
                          ? "mt-5 max-h-16 opacity-100 pointer-events-auto"
                          : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <Link
                        href={`/games/${game.id}`}
                        className="inline-flex items-center justify-center rounded-full border-2 border-[#FFD447] bg-[#211B35] px-8 py-2.5 font-display text-sm tracking-wider font-bold text-[#FFD447] shadow-[3px_3px_0_#0E0A1A] transition-all hover:bg-[#FFD447] hover:text-[#0E0A1A] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                      >
                        Mainkan Game
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Arrow Buttons (Underneath Carousel) */}
        <div className="mt-4 flex sm:hidden items-center justify-center gap-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isAnimating}
            aria-label="Game Sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#FFD447] bg-[#5E1386] text-[#FFD447] shadow-[2px_2px_0_#0E0A1A] active:translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isAnimating}
            aria-label="Game Berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#FFD447] bg-[#5E1386] text-[#FFD447] shadow-[2px_2px_0_#0E0A1A] active:translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            ▶
          </button>
        </div>

        {/* Bottom Link: Lihat Semua Game */}
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
    </section>
  );
}
