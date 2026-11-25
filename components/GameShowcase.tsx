"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { Game } from "@/lib/content";
import { sanitizeMediaUrl } from "@/lib/api/media";

type GameShowcaseProps = {
  games: Game[];
};

function GameArtwork({
  image,
  alt,
  title,
  indexLabel,
}: {
  image?: string;
  alt?: string;
  title: string;
  indexLabel: string;
}) {
  const safeImage = sanitizeMediaUrl(image);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [safeImage]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#5b2be6]/40 bg-[#0E0A1A] flex items-center justify-center select-none shadow-inner">
      {!hasError && safeImage ? (
        <img
          src={safeImage}
          alt={alt || title}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#2a1147] via-[#1C172D] to-[#0E0A1A] p-4 text-center select-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(91,43,230,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(122,31,176,0.45) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#5b2be6]/60 bg-[#171224]/95 text-[#ffe500] shadow-[0_8px_18px_rgba(14,10,26,0.65)]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-current"
            >
              <path d="M6 7h12a4 4 0 0 1 3.87 5.01l-1.12 4.18A2.5 2.5 0 0 1 18.33 18a2.5 2.5 0 0 1-2.06-1.08l-.94-1.36a1 1 0 0 0-.82-.43h-5.02a1 1 0 0 0-.82.43l-.94 1.36A2.5 2.5 0 0 1 5.67 18a2.5 2.5 0 0 1-2.42-1.81L2.13 12.01A4 4 0 0 1 6 7zm1 3v1H6v2h1v1h2v-1h1v-2H9v-1H7zm8.5 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm2.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </div>
          <span className="relative mt-2.5 font-display text-xs tracking-[0.2em] text-[#B7ABCE] uppercase">
            {indexLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export default function GameShowcase({ games }: GameShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepX, setStepX] = useState(360);
  const [isReady, setIsReady] = useState(false);
  const isAnimatingRef = useRef(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const updateStep = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setStepX(260);
      } else if (w < 1024) {
        setStepX(300);
      } else {
        setStepX(380);
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;

    let mm: gsap.MatchMedia | undefined;
    let observer: IntersectionObserver | undefined;

    try {
      mm = gsap.matchMedia();

      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};
          if (reduceMotion || typeof IntersectionObserver === "undefined") return;

          let revealed = false;
          observer = new IntersectionObserver(
            (entries) => {
              if (revealed) return;
              if (entries.some((entry) => entry.isIntersecting)) {
                revealed = true;
                observer?.disconnect();
                gsap.from("[data-games-reveal]", {
                  y: 16,
                  autoAlpha: 0,
                  duration: 0.52,
                  stagger: 0.08,
                  ease: "power3.out",
                  clearProps: "transform,opacity,visibility",
                });
              }
            },
            { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
          );
          observer.observe(section);

          return () => {
            observer?.disconnect();
          };
        },
        sectionRef,
      );
    } catch {
      // Static visible fallback
    }

    return () => {
      observer?.disconnect();
      mm?.revert();
    };
  }, []);

  const safeGames = Array.isArray(games) ? games : [];
  const total = safeGames.length;
  const normalizedIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;

  const handleNext = () => {
    if (isAnimatingRef.current || total <= 1) return;
    isAnimatingRef.current = true;
    setActiveIndex((prev) => prev + 1);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 400);
  };

  const handlePrev = () => {
    if (isAnimatingRef.current || total <= 1) return;
    isAnimatingRef.current = true;
    setActiveIndex((prev) => prev - 1);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 400);
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

  // Virtual window: 1 card if only 1 game, 3 cards if 2 games, 5 cards if 3+
  const offsets = total === 1 ? [0] : total === 2 ? [-1, 0, 1] : [-2, -1, 0, 1, 2];
  const visibleIndices = offsets.map((off) => activeIndex + off);

  return (
    <section
      ref={sectionRef}
      id="games"
      aria-labelledby="game-showcase-heading"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative w-full overflow-hidden border-t border-[#5b2be6]/25 bg-[#1C172D] px-4 py-16 sm:px-6 md:py-24 focus-visible:outline-none select-none"
    >
      {/* Subtle dark-purple stage atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[18%] h-[420px] w-[680px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(91, 43, 230, 0.36) 0%, rgba(122, 31, 176, 0.18) 52%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Exhibition Section Header */}
        <div
          data-games-reveal
          className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end"
        >
          <div>
            <p className="inline-flex items-center gap-2.5 font-body text-[11px] font-semibold tracking-[0.2em] text-[#B7ABCE] uppercase sm:text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-[#7ac70c]" />
              <span>ARCADE FLOOR &middot; PLAYABLE EXHIBITS</span>
            </p>
            <h2
              id="game-showcase-heading"
              className="mt-3 font-display text-4xl leading-[0.98] tracking-wide text-[#FFF5E9] sm:text-5xl md:text-6xl"
              style={{
                textShadow: "3px 3px 0px #2a1147, 5px 5px 0px #0E0A1A",
              }}
            >
              GAME <span className="text-[#ffe500]">PAMERAN</span>
            </h2>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-3 md:w-auto md:justify-end">
            {total > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#5b2be6]/40 bg-[#171224]/90 px-3.5 py-2 font-display text-sm tracking-widest text-[#FFF5E9] tabular-nums">
                <span className="h-1.5 w-1.5 bg-[#ffe500]" aria-hidden="true" />
                <span>
                  {String(normalizedIndex + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
              </div>
            )}

            <Link
              href="/games"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#5b2be6]/50 bg-[#2a1147]/70 px-5 py-2 font-display text-base tracking-wide text-[#FFF5E9] shadow-[3px_3px_0_#0E0A1A] transition-colors hover:border-[#ffe500] hover:text-[#ffe500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500]"
            >
              <span>Lihat Semua Game</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Empty State (Honest, no fabricated games) */}
        {total === 0 ? (
          <div
            data-games-reveal
            data-testid="game-showcase-empty-state"
            className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#5b2be6]/40 bg-gradient-to-b from-[#2a1147]/60 via-[#171224]/95 to-[#171224] px-6 py-12 text-center shadow-[0_22px_44px_rgba(14,10,26,0.7)] sm:px-10"
          >
            <span
              aria-hidden="true"
              className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-[#5b2be6]"
            />
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-[#7a1fb0]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-3 h-2 w-2 bg-[#7ac70c]/80"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 h-2 w-2 bg-[#ffe500]/80"
            />

            <p className="font-display text-2xl tracking-wide text-[#ffe500] sm:text-3xl">
              Belum Ada Game Tersedia
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#FFF5E9]/78 sm:text-base">
              Daftar game pameran akan tampil otomatis segera setelah karya game dipublikasikan.
            </p>
          </div>
        ) : (
          <div
            data-games-reveal
            className="relative flex w-full flex-col items-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Exhibition Carousel Stage */}
            <div className="relative flex h-[450px] w-full max-w-5xl items-center justify-center overflow-hidden sm:h-[490px]">
              {visibleIndices.map((v) => {
                const offset = v - activeIndex;
                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;

                const gameIndex = ((v % total) + total) % total;
                const game = safeGames[gameIndex];
                const exhibitLabel = `GAME ${String(gameIndex + 1).padStart(2, "0")}`;

                let x = offset * stepX;
                let scale = 1.0;
                let opacity = 1.0;
                let zIndex = 10;

                if (isCenter) {
                  x = 0;
                  scale = 1.0;
                  opacity = 1.0;
                  zIndex = 50;
                } else if (Math.abs(offset) === 1) {
                  x = offset * stepX;
                  scale = 0.84;
                  opacity = 0.55;
                  zIndex = 20;
                } else {
                  x = offset * stepX;
                  scale = 0.7;
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
                        ? "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease"
                        : "none",
                    }}
                  >
                    <div
                      onClick={
                        isLeft ? handlePrev : isRight ? handleNext : undefined
                      }
                      role={!isCenter ? "button" : undefined}
                      tabIndex={!isCenter ? 0 : undefined}
                      onKeyDown={
                        !isCenter
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                if (isLeft) handlePrev();
                                else handleNext();
                              }
                            }
                          : undefined
                      }
                      aria-label={
                        isLeft
                          ? "Game Sebelumnya"
                          : isRight
                            ? "Game Berikutnya"
                            : undefined
                      }
                      className={`relative flex h-[415px] w-[300px] flex-col justify-between overflow-hidden rounded-3xl p-5 sm:h-[450px] sm:w-[370px] sm:p-6 md:w-[410px] ${
                        isCenter
                          ? "border-2 border-[#ffe500]/75 bg-gradient-to-b from-[#2a1147]/85 via-[#171224]/96 to-[#171224] shadow-[0_24px_48px_rgba(14,10,26,0.85)]"
                          : "cursor-pointer border border-[#5b2be6]/40 bg-[#171224]/90 shadow-[0_14px_30px_rgba(14,10,26,0.7)] hover:border-[#7a1fb0]"
                      }`}
                    >
                      {/* Stepped corner brackets on active exhibition card */}
                      {isCenter && (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute top-2.5 left-2.5 h-3 w-3 border-t-2 border-l-2 border-[#5b2be6]"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute top-2.5 right-2.5 h-3 w-3 border-t-2 border-r-2 border-[#7a1fb0]"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute bottom-2.5 left-2.5 h-2 w-2 bg-[#7ac70c]/80"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute bottom-2.5 right-2.5 h-2 w-2 bg-[#ffe500]/80"
                          />
                        </>
                      )}

                      <div>
                        <GameArtwork
                          image={game.image}
                          alt={game.imageAlt}
                          title={game.name}
                          indexLabel={exhibitLabel}
                        />

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#5b2be6]/40 bg-[#2a1147]/70 px-2.5 py-0.5 font-display text-xs tracking-widest text-[#B7ABCE]">
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 bg-[#7ac70c]"
                            />
                            {exhibitLabel}
                          </span>
                        </div>

                        <h3
                          className={`mt-2.5 truncate font-display tracking-wide ${
                            isCenter
                              ? "text-2xl text-[#FFF5E9] sm:text-3xl"
                              : "text-lg text-[#FFF5E9]/75"
                          }`}
                          style={
                            isCenter
                              ? { textShadow: "2px 2px 0px #0E0A1A" }
                              : undefined
                          }
                        >
                          {game.name}
                        </h3>

                        <p
                          className={`mt-1.5 line-clamp-2 min-h-[2.5rem] font-body text-xs leading-relaxed sm:text-sm ${
                            isCenter ? "text-[#FFF5E9]/80" : "text-[#B7ABCE]/60"
                          }`}
                        >
                          {game.description}
                        </p>
                      </div>

                      <div
                        className={`mt-4 border-t border-white/10 pt-4 ${
                          isCenter
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        {isCenter && (
                          <Link
                            href={`/games/${game.id}`}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#ffe500] px-6 py-2.5 font-display text-lg font-bold tracking-wide text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                          >
                            Mainkan Game
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clean Navigation Controls (Desktop & Mobile — never overlapping card text) */}
            {total > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Game Sebelumnya"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#5b2be6]/50 bg-[#171224] font-display text-lg text-[#FFF5E9] shadow-[3px_3px_0_#0E0A1A] transition-colors hover:border-[#ffe500] hover:text-[#ffe500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500] cursor-pointer"
                >
                  &larr;
                </button>
                <span className="min-w-20 text-center font-display text-sm tracking-widest text-[#B7ABCE] tabular-nums">
                  {String(normalizedIndex + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Game Berikutnya"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#5b2be6]/50 bg-[#171224] font-display text-lg text-[#FFF5E9] shadow-[3px_3px_0_#0E0A1A] transition-colors hover:border-[#ffe500] hover:text-[#ffe500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500] cursor-pointer"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
