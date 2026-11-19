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

  useEffect(() => {
    setHasError(false);
  }, [image]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#171224] flex items-center justify-center select-none shadow-inner">
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
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#FFD447]/20 border border-[#FFD447]/40 text-2xl sm:text-3xl shadow-inner">
            🕹️
          </div>
          <span className="mt-2 font-display text-xs sm:text-sm text-[#FFD447] tracking-wider uppercase drop-shadow-[1px_1px_0_#0E0A1A] truncate max-w-full">
            {title}
          </span>
          <span className="font-body text-[9px] sm:text-[10px] text-[#68D5E8] tracking-widest uppercase">
            Cyber Arcade Game
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default function GameShowcase({ games }: GameShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepX, setStepX] = useState(350);
  const [isReady, setIsReady] = useState(false);
  const isAnimatingRef = useRef(false);

  // Responsive stepX calculation - generous spacing to prevent overlap
  useEffect(() => {
    const updateStep = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setStepX(210);
      } else if (w < 1024) {
        setStepX(280);
      } else {
        setStepX(350);
      }
    };

    updateStep();
    window.addEventListener("resize", updateStep);
    const timer = setTimeout(() => setIsReady(true), 60);

    return () => {
      window.removeEventListener("resize", updateStep);
      clearTimeout(timer);
    };
  }, []);

  // Touch gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!games || games.length === 0) {
    return null;
  }

  const N = games.length;

  const handleNext = () => {
    if (isAnimatingRef.current || N <= 1) return;
    isAnimatingRef.current = true;
    setActiveIndex((prev) => prev + 1);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 450);
  };

  const handlePrev = () => {
    if (isAnimatingRef.current || N <= 1) return;
    isAnimatingRef.current = true;
    setActiveIndex((prev) => prev - 1);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 450);
  };

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
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  // Virtual window of 5 cards around activeIndex: [-2, -1, 0, 1, 2]
  const offsets = [-2, -1, 0, 1, 2];
  const visibleIndices = offsets.map((off) => activeIndex + off);

  return (
    <section
      id="games"
      aria-label="Game Showcase"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#1F1834] overflow-hidden focus-visible:outline-none select-none"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading - Pixel "GAME" with Stars */}
        <div className="mb-6 sm:mb-10 flex flex-col items-center text-center">
          <div className="relative inline-flex items-center justify-center">
            <span
              className="font-display text-4xl sm:text-5xl md:text-6xl tracking-widest text-[#FFD447] select-none"
              style={{
                textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
              }}
            >
              GAME
            </span>
            <span
              className="absolute -top-3 -right-6 text-lg sm:text-xl text-[#FFD447]"
              aria-hidden="true"
            >
              ✦
            </span>
            <span
              className="absolute -bottom-2 -left-5 text-sm sm:text-base text-[#68D5E8]"
              aria-hidden="true"
            >
              ✦
            </span>
          </div>
        </div>

        {/* Carousel Showcase Stage */}
        <div
          className="relative flex flex-col items-center w-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Stage Container */}
          <div
            className="relative w-full max-w-5xl flex items-center justify-center overflow-hidden select-none"
            style={{
              height: "540px",
              minHeight: "540px",
            }}
          >
            {visibleIndices.map((v) => {
              const offset = v - activeIndex;
              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;

              const gameIndex = ((v % N) + N) % N;
              const game = games[gameIndex];

              // Smooth scale and positioning
              let x = offset * stepX;
              let scale = 1.0;
              let opacity = 1.0;
              let zIndex = 10;

              if (offset === 0) {
                // Center card: full size, front, fully visible
                x = 0;
                scale = 1.0;
                opacity = 1.0;
                zIndex = 50;
              } else if (Math.abs(offset) === 1) {
                // Side cards: scaled down, behind center, semi-opaque
                x = offset * stepX;
                scale = 0.8;
                opacity = 0.65;
                zIndex = 10;
              } else {
                // Offscreen cards
                x = offset * stepX;
                scale = 0.65;
                opacity = 0;
                zIndex = 1;
              }

              return (
                <div
                  key={v}
                  className="absolute top-1/2 left-1/2 will-change-transform"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), -50%) scale(${scale})`,
                    opacity,
                    zIndex,
                    pointerEvents:
                      isCenter || isLeft || isRight ? "auto" : "none",
                    transition: isReady
                      ? "transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 500ms ease"
                      : "none",
                  }}
                >
                  <div
                    onClick={
                      isLeft ? handlePrev : isRight ? handleNext : undefined
                    }
                    role={!isCenter ? "button" : undefined}
                    aria-label={
                      isLeft
                        ? "Game Sebelumnya"
                        : isRight
                          ? "Game Berikutnya"
                          : undefined
                    }
                    className={`relative flex flex-col justify-between w-[290px] sm:w-[340px] md:w-[380px] h-[430px] sm:h-[460px] md:h-[480px] rounded-[2.5rem] border-4 p-4 sm:p-6 transition-all duration-300 ${
                      isCenter
                        ? "border-[#FFD447] shadow-[8px_8px_0_#0E0A1A]"
                        : "border-[#39265E] shadow-[4px_4px_0_#0E0A1A] cursor-pointer hover:opacity-90"
                    }`}
                    style={{
                      backgroundColor: isCenter ? "#2D124D" : "#230E3D",
                    }}
                  >
                    {/* Top: Artwork Container */}
                    <div className="relative w-full">
                      <GameArtwork
                        image={game.image}
                        alt={game.imageAlt}
                        title={game.name}
                      />

                      {/* Side Arrow Indicator / Button Overlay (only on side cards) */}
                      {!isCenter && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 hover:bg-black/10 transition-colors">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isLeft) handlePrev();
                              else handleNext();
                            }}
                            aria-label={
                              isLeft ? "Game Sebelumnya" : "Game Berikutnya"
                            }
                            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A] text-base sm:text-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            {isLeft ? "◀" : "▶"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Middle: Game Name */}
                    <div className="my-2 sm:my-3 text-center">
                      <h3
                        className={`truncate max-w-full font-display tracking-wide text-white drop-shadow-[2px_2px_0_#0E0A1A] transition-all duration-300 ${
                          isCenter
                            ? "text-2xl sm:text-3xl text-[#FFD447]"
                            : "text-base sm:text-lg text-[#FFF5E9]/80"
                        }`}
                      >
                        {game.name}
                      </h3>
                    </div>

                    {/* Bottom: Description & Action Button (Only visible on Center Card) */}
                    <div
                      className={`w-full flex flex-col items-center transition-all duration-300 ${
                        isCenter
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none select-none"
                      }`}
                    >
                      <p className="line-clamp-2 text-center font-body text-xs sm:text-sm text-[#FFF5E9]/85 px-1 min-h-[36px]">
                        {isCenter ? game.description : ""}
                      </p>

                      <div className="mt-3 sm:mt-4 min-h-[44px] flex items-center">
                        {isCenter && (
                          <Link
                            href={`/games/${game.id}`}
                            className="inline-flex items-center justify-center rounded-full border-2 border-[#FFD447] bg-[#211B35] px-6 sm:px-8 py-2 sm:py-2.5 font-display text-xs sm:text-sm tracking-wider font-bold text-[#FFD447] shadow-[3px_3px_0_#0E0A1A] transition-all hover:bg-[#FFD447] hover:text-[#0E0A1A] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                          >
                            Mainkan Game
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Mobile Touch Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Game Sebelumnya"
              className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#FFD447] bg-[#211B35] text-[#FFD447] shadow-[2px_2px_0_#0E0A1A] active:translate-y-0.5 cursor-pointer"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Game Berikutnya"
              className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#FFD447] bg-[#211B35] text-[#FFD447] shadow-[2px_2px_0_#0E0A1A] active:translate-y-0.5 cursor-pointer"
            >
              ▶
            </button>
          </div>

          {/* Lihat Semua Game Link */}
          <div className="mt-4 sm:mt-6 flex justify-center">
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
