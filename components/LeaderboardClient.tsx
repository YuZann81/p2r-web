"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type {
  LeaderboardEntry,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

type LeaderboardClientProps = {
  mode: "live" | "preview";
  initialEntries: LeaderboardEntry[];
  initialKaryaRankings?: KaryaLeaderboardEntry[];
};

export default function LeaderboardClient({
  mode,
  initialEntries,
  initialKaryaRankings = [],
}: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<"games" | "karyas">("games");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique games from entry list
  const availableGames = useMemo(() => {
    const gamesSet = new Set<string>();
    initialEntries.forEach((entry) => {
      if (entry.gameName) {
        gamesSet.add(entry.gameName);
      }
    });
    return Array.from(gamesSet);
  }, [initialEntries]);

  // Filtered game entries based on selected game & search
  const filteredGameEntries = useMemo(() => {
    let list = initialEntries;
    if (selectedGame !== "all") {
      list = list.filter((e) => e.gameName === selectedGame);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q && activeTab === "games") {
      list = list.filter(
        (e) =>
          e.playerName.toLowerCase().includes(q) ||
          e.gameName.toLowerCase().includes(q),
      );
    }
    return list;
  }, [initialEntries, selectedGame, searchQuery, activeTab]);

  // Filtered karya rankings based on search
  const filteredKaryaRankings = useMemo(() => {
    let list = initialKaryaRankings;
    const q = searchQuery.trim().toLowerCase();
    if (q && activeTab === "karyas") {
      list = list.filter(
        (k) =>
          k.karyaTitle.toLowerCase().includes(q) ||
          k.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [initialKaryaRankings, searchQuery, activeTab]);

  // Top 3 Podium Calculation (Compact)
  const topThreeGames = useMemo(() => {
    return filteredGameEntries.slice(0, 3);
  }, [filteredGameEntries]);

  const podiumOrder = useMemo(() => {
    if (topThreeGames.length >= 3) {
      return [topThreeGames[1], topThreeGames[0], topThreeGames[2]];
    }
    return topThreeGames;
  }, [topThreeGames]);

  return (
    <div className="w-full">
      {/* Mode Status Banner (No emojis) */}
      <div
        role="status"
        aria-label="Status Mode Leaderboard"
        className="mb-8 rounded-xl border-2 border-arcade-yellow/40 bg-[#1e1040] p-4 text-center sm:p-5"
      >
        {mode === "preview" ? (
          <>
            <span className="inline-block rounded-md border border-arcade-yellow/50 bg-arcade-yellow/15 px-3 py-0.5 font-display text-xs font-bold tracking-wider uppercase text-arcade-yellow sm:text-sm">
              SIMULASI / PREVIEW MODE
            </span>
            <p className="mt-2 text-xs font-medium text-white/80 sm:text-sm">
              Data klasemen di bawah ini merupakan data simulasi untuk keperluan preview. Leaderboard live real-time akan menggunakan data event resmi pameran.
            </p>
          </>
        ) : (
          <>
            <span className="inline-block rounded-md border border-arcade-green/50 bg-arcade-green/15 px-3 py-0.5 font-display text-xs font-bold tracking-wider uppercase text-arcade-green sm:text-sm">
              LIVE EVENT LEADERBOARD
            </span>
            <p className="mt-2 text-xs font-medium text-white/80 sm:text-sm">
              Papan klasemen skor resmi turnamen arcade pameran Pixel To Reality: The Cyber Arcade.
            </p>
          </>
        )}
      </div>

      {/* Main Scope Switcher: Game Scores vs Karya Votes */}
      <div
        role="tablist"
        aria-label="Kategori Leaderboard Utama"
        className="mb-6 flex flex-wrap items-center justify-center gap-3 border-b border-white/10 pb-6"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "games"}
          onClick={() => {
            setActiveTab("games");
            setSearchQuery("");
          }}
          className={`min-h-[44px] rounded-xl px-6 py-2.5 font-display text-base font-bold tracking-wider transition-all duration-150 outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-white ${
            activeTab === "games"
              ? "bg-arcade-yellow text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] -translate-y-0.5"
              : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
          }`}
        >
          Klasemen Game Arcade
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "karyas"}
          onClick={() => {
            setActiveTab("karyas");
            setSearchQuery("");
          }}
          className={`min-h-[44px] rounded-xl px-6 py-2.5 font-display text-base font-bold tracking-wider transition-all duration-150 outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-white ${
            activeTab === "karyas"
              ? "bg-arcade-yellow text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] -translate-y-0.5"
              : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
          }`}
        >
          Ranking Voting Karya ({initialKaryaRankings.length})
        </button>
      </div>

      {/* Tab 1: Game Scores View */}
      {activeTab === "games" && (
        <div>
          {/* Game Filter Chips (Global vs Individual Games) */}
          {availableGames.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="font-display text-xs tracking-wider uppercase text-white/60 mr-1">
                Filter Game:
              </span>
              <button
                type="button"
                onClick={() => setSelectedGame("all")}
                className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-bold tracking-wider uppercase transition-all duration-150 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-arcade-yellow ${
                  selectedGame === "all"
                    ? "bg-arcade-yellow text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)]"
                    : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
                }`}
              >
                Semua Game (Global)
              </button>

              {availableGames.map((game) => (
                <button
                  key={game}
                  type="button"
                  onClick={() => setSelectedGame(game)}
                  className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-bold tracking-wider uppercase transition-all duration-150 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-arcade-yellow ${
                    selectedGame === game
                      ? "bg-arcade-yellow text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)]"
                      : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>
          )}

          {/* Search Bar & Counter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                placeholder="Cari nama pemain arcade..."
                aria-label="Cari pemain arcade"
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

            <div className="font-display text-sm tracking-wider uppercase text-arcade-yellow">
              Menampilkan {filteredGameEntries.length} dari {initialEntries.length} Skor
            </div>
          </div>

          {/* Compact Top 3 Podium (Only when not searching or when top results available) */}
          {!searchQuery && podiumOrder.length > 0 && (
            <section aria-label="Top 3 Juara Klasemen" className="mb-8">
              <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
                {podiumOrder.map((entry) => {
                  const isFirst = entry.rank === 1;
                  const isSecond = entry.rank === 2;

                  return (
                    <div
                      key={`${entry.rank}-${entry.playerName}-${entry.gameName}`}
                      className={`flex flex-col items-center rounded-xl p-4 text-center shadow-md transition-transform ${
                        isFirst
                          ? "order-1 border-2 border-arcade-yellow bg-[#2a1354] sm:order-2 sm:-translate-y-2 sm:p-5"
                          : isSecond
                            ? "order-2 border border-white/40 bg-[#1e1040] sm:order-1 sm:p-4"
                            : "order-3 border border-arcade-green/40 bg-[#1e1040] sm:order-3 sm:p-4"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-xl font-bold ${
                          isFirst
                            ? "bg-arcade-yellow text-arcade-ink"
                            : isSecond
                              ? "bg-white text-arcade-ink"
                              : "bg-arcade-green text-white"
                        }`}
                      >
                        #{entry.rank}
                      </div>
                      <h3 className="mt-2.5 font-display text-lg text-white truncate max-w-[180px] sm:text-xl">
                        {entry.playerName}
                      </h3>
                      <span className="mt-0.5 font-display text-xs uppercase tracking-wider text-arcade-yellow/90 truncate max-w-[180px]">
                        {entry.gameName}
                      </span>
                      <div className="mt-2.5 rounded bg-black/50 px-3 py-1 font-mono text-sm font-bold text-arcade-yellow">
                        {entry.score.toLocaleString("id-ID")} PTS
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Full Leaderboard Table */}
          <section
            aria-label="Tabel Klasemen Lengkap"
            className="overflow-hidden rounded-xl border-2 border-white/20 bg-[#1e1040]"
          >
            {filteredGameEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white sm:text-base">
                  <thead className="border-b border-white/20 bg-black/40 font-display text-base uppercase tracking-wider text-arcade-yellow sm:text-lg">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 text-center sm:px-6">
                        Rank
                      </th>
                      <th scope="col" className="px-4 py-3.5 sm:px-6">
                        Player
                      </th>
                      <th scope="col" className="px-4 py-3.5 sm:px-6">
                        Game
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-right sm:px-6">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredGameEntries.map((entry) => (
                      <tr
                        key={`${entry.rank}-${entry.playerName}-${entry.gameName}`}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="px-4 py-3 text-center font-display font-bold sm:px-6">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs sm:text-sm font-mono ${
                              entry.rank === 1
                                ? "bg-arcade-yellow text-arcade-ink font-bold"
                                : entry.rank === 2
                                  ? "bg-white/90 text-arcade-ink font-bold"
                                  : entry.rank === 3
                                    ? "bg-arcade-green text-white font-bold"
                                    : "text-white/70"
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-white sm:px-6">
                          {entry.playerName}
                        </td>
                        <td className="px-4 py-3 text-white/80 sm:px-6">
                          {entry.gameName}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-base font-bold text-arcade-yellow sm:px-6">
                          {entry.score.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center sm:p-14">
                <p className="font-display text-lg text-white/80">
                  {searchQuery
                    ? `Tidak ada pemain dengan kata kunci "${searchQuery}".`
                    : "Belum ada skor tercatat untuk game ini."}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 rounded-lg bg-arcade-yellow px-5 py-2 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] hover:-translate-y-0.5"
                  >
                    Reset Pencarian
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Tab 2: Karya Votes View */}
      {activeTab === "karyas" && (
        <div>
          {/* Search Bar & Counter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                placeholder="Cari judul karya atau kategori..."
                aria-label="Cari karya pada leaderboard"
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

            <div className="font-display text-sm tracking-wider uppercase text-arcade-yellow">
              Menampilkan {filteredKaryaRankings.length} dari {initialKaryaRankings.length} Karya
            </div>
          </div>

          {/* Karya Rankings Table */}
          <section
            aria-label="Tabel Ranking Voting Karya"
            className="overflow-hidden rounded-xl border-2 border-white/20 bg-[#1e1040]"
          >
            {filteredKaryaRankings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white sm:text-base">
                  <thead className="border-b border-white/20 bg-black/40 font-display text-base uppercase tracking-wider text-arcade-yellow sm:text-lg">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 text-center sm:px-6">
                        Rank
                      </th>
                      <th scope="col" className="px-4 py-3.5 sm:px-6">
                        Karya Inovasi
                      </th>
                      <th scope="col" className="px-4 py-3.5 sm:px-6">
                        Kategori
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-right sm:px-6">
                        Perolehan Vote
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredKaryaRankings.map((karya) => (
                      <tr
                        key={karya.slug || karya.karyaTitle}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="px-4 py-3 text-center font-display font-bold sm:px-6">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs sm:text-sm font-mono ${
                              karya.rank === 1
                                ? "bg-arcade-yellow text-arcade-ink font-bold"
                                : karya.rank === 2
                                  ? "bg-white/90 text-arcade-ink font-bold"
                                  : karya.rank === 3
                                    ? "bg-arcade-green text-white font-bold"
                                    : "text-white/70"
                            }`}
                          >
                            {karya.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-white sm:px-6">
                          <Link
                            href={`/karya/${karya.slug}`}
                            className="text-arcade-yellow hover:underline transition-colors font-display text-lg"
                          >
                            {karya.karyaTitle}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-white/80 sm:px-6">
                          <span className="inline-block rounded border border-white/20 bg-white/5 px-2.5 py-0.5 font-display text-xs uppercase tracking-wider text-white">
                            {karya.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-base font-bold text-arcade-yellow sm:px-6">
                          {karya.votesCount.toLocaleString("id-ID")} VOTES
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center sm:p-14">
                <p className="font-display text-lg text-white/80">
                  {searchQuery
                    ? `Tidak ada karya dengan kata kunci "${searchQuery}".`
                    : "Belum ada data perolehan suara karya tercatat."}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 rounded-lg bg-arcade-yellow px-5 py-2 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] hover:-translate-y-0.5"
                  >
                    Reset Pencarian
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
