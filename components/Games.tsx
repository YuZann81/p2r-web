import React from "react";
import Link from "next/link";
import GameCard from "@/components/GameCard";
import PixelDivider from "@/components/PixelDivider";
import GameScrollReveal from "@/components/games/GameScrollReveal";
import { getGames } from "@/lib/games/getGames";

export default async function Games() {
  const games = await getGames();
  const featuredGames = games.slice(0, 2);

  return (
    <section
      id="games"
      aria-label="Game Arcade Siswa RPL"
      className="relative w-full overflow-hidden bg-[#24135e]"
      style={{
        // Subtle pixel grid overlay on top of deep violet base
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Top Pixel Transition Divider */}
      <PixelDivider base="var(--arcade-yellow)" pixel="var(--arcade-ink)" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        {/* Section Header */}
        <GameScrollReveal variant="heading" delayMs={60}>
          <div className="mb-14 text-center sm:mb-16 md:mb-20">
            <span className="inline-block rounded-full border border-arcade-yellow/40 bg-arcade-yellow/10 px-4 py-1 font-display text-xs font-bold tracking-wider uppercase text-arcade-yellow sm:text-sm">
              Wahana Interaktif
            </span>
            <h2 className="mt-3 font-display text-2xl text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-4xl md:text-5xl">
              GAME ARCADE SISWA RPL
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-pretty text-white/90 sm:text-base md:text-lg">
              Coba dan mainkan ragam game arcade retro interaktif buatan siswa Rekayasa Perangkat Lunak langsung di browser atau di booth pameran.
            </p>
          </div>
        </GameScrollReveal>

        {/* Featured Showcase: Zig-Zag Alternating Rows */}
        {featuredGames.length > 0 ? (
          <div className="flex flex-col gap-16 md:gap-24">
            {featuredGames.map((game, index) => (
              <GameScrollReveal
                key={game.id}
                variant="row"
                delayMs={index * 120}
              >
                <GameCard
                  game={game}
                  reversed={index % 2 === 1}
                />
              </GameScrollReveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/30 bg-[#1e1040] p-10 text-center">
            <span className="font-display text-lg text-arcade-yellow">
              Belum ada game yang tersedia.
            </span>
            <p className="mt-2 text-sm text-white/80">
              Game arcade interaktif siswa RPL sedang dipersiapkan untuk pameran.
            </p>
          </div>
        )}

        {/* Section Exploration CTA */}
        <GameScrollReveal variant="fade" delayMs={260}>
          <div className="mt-14 flex justify-center sm:mt-16 md:mt-20">
            <Link
              href="/games"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
            >
              Eksplorasi Semua Game →
            </Link>
          </div>
        </GameScrollReveal>
      </div>

      {/* Bottom Pixel Transition Divider */}
      <PixelDivider base="var(--arcade-ink)" pixel="var(--arcade-yellow)" />
    </section>
  );
}
