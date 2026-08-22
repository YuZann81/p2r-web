"use client";

import React, { useMemo, useState } from "react";
import GameGridCard from "@/components/GameGridCard";
import type { Game } from "@/lib/content";

type GameDirectoryClientProps = {
  initialGames: Game[];
};

export default function GameDirectoryClient({
  initialGames,
}: GameDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return initialGames;

    return initialGames.filter(
      (game) =>
        game.name.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query),
    );
  }, [initialGames, searchQuery]);

  if (initialGames.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-10 md:p-16 border-2 border-dashed border-arcade-yellow/40 bg-[#1e1040] text-center rounded-2xl">
        <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-sm tracking-wide text-arcade-yellow mb-3">
          Koleksi Game
        </span>
        <h2 className="font-display text-2xl md:text-3xl text-arcade-yellow font-bold drop-shadow-sm mb-3">
          Belum ada game yang tersedia.
        </h2>
        <p className="text-white/80 font-medium text-base max-w-md leading-relaxed">
          Game arcade interaktif buatan siswa RPL sedang dipersiapkan untuk pameran.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Control Bar: Search & Counter */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/50">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari game berdasarkan judul atau kata kunci..."
            aria-label="Cari game arcade"
            className="w-full rounded-xl border border-white/20 bg-black/40 py-2.5 pl-10 pr-10 text-sm font-medium text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Hapus pencarian"
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/50 hover:text-white"
            >
              <span className="font-display text-sm">✕</span>
            </button>
          )}
        </div>

        {/* Dynamic Counter */}
        <div className="font-display text-sm tracking-wider uppercase text-arcade-yellow">
          Menampilkan {filteredGames.length} dari {initialGames.length} Game
        </div>
      </div>

      {/* Grid of Games or Empty Search Result */}
      {filteredGames.length > 0 ? (
        <section
          aria-label="Daftar Game Arcade"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8"
        >
          {filteredGames.map((game) => (
            <GameGridCard key={game.id} game={game} />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-10 text-center sm:p-14">
          <h3 className="font-display text-xl text-arcade-yellow sm:text-2xl">
            Tidak ada game yang cocok
          </h3>
          <p className="mt-2 text-sm text-white/80">
            Tidak ditemukan game dengan kata kunci &quot;{searchQuery}&quot;. Silakan coba kata kunci lain.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
