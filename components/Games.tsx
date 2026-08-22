import React from "react";
import Link from "next/link";
import { getGames } from "@/lib/games/getGames";

export default async function Games() {
  const games = await getGames();
  const featuredGames = games.slice(0, 2);

  return (
    <section
      id="games"
      aria-label="Game Arcade Siswa RPL"
      className="w-full bg-[#24135e] py-14 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-12">
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

        {/* Featured Compact Games Grid */}
        {featuredGames.length > 0 ? (
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            {featuredGames.map((game) => (
              <article
                key={game.id}
                aria-label={`Game: ${game.name}`}
                className="group flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-5 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)]"
              >
                <div>
                  {/* Artwork Preview */}
                  <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/60">
                    <img
                      src={game.image}
                      alt={game.imageAlt || `${game.name} artwork`}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-md border border-white/20 bg-black/70 px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow">
                      Arcade Game
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold leading-snug text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)] sm:text-2xl">
                    {game.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-white/80">
                    {game.description}
                  </p>
                </div>

                {/* Card Action */}
                <div className="mt-5 border-t border-white/10 pt-4">
                  <Link
                    href={`/games/${game.id}`}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-arcade-yellow px-5 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
                  >
                    Mainkan Game →
                  </Link>
                </div>
              </article>
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
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/games"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Eksplorasi Semua Game →
          </Link>
        </div>
      </div>
    </section>
  );
}
