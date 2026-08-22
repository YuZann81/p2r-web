import React from "react";
import Link from "next/link";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

export default async function LeaderboardPreview() {
  const { entries, mode } = await getLeaderboardData();
  const topThree = entries.slice(0, 3);
  const podiumOrder =
    topThree.length >= 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;

  return (
    <section
      aria-label="Papan Klasemen Leaderboard"
      className="w-full bg-[#24135e] py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-arcade-green/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-green sm:text-sm">
            {mode === "live" ? "🏆 Turnamen Live" : "⚡ Klasemen Arcade"}
          </span>
          <h2 className="mt-3 font-display text-3xl text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-4xl md:text-5xl">
            TOP PLAYERS LEADERBOARD
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-pretty text-white/90 sm:text-lg">
            Papan klasemen skor tertinggi game arcade pameran Pixel To Reality: The Cyber Arcade.
          </p>
        </div>

        {/* Podium Highlights */}
        {podiumOrder.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-end max-w-4xl mx-auto">
            {podiumOrder.map((entry) => {
              const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;

              return (
                <div
                  key={entry.rank}
                  className={`flex flex-col items-center rounded-2xl p-6 text-center shadow-lg transition-transform ${
                    isFirst
                      ? "order-1 border-2 border-arcade-yellow bg-arcade-yellow/15 sm:order-2 sm:-translate-y-4 sm:p-8"
                      : isSecond
                        ? "order-2 border border-white/40 bg-white/10 sm:order-1 sm:p-6"
                        : "order-3 border border-arcade-green/40 bg-arcade-green/10 sm:order-3 sm:p-6"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-display text-2xl font-bold shadow-md ${
                      isFirst
                        ? "bg-arcade-yellow text-arcade-ink shadow-[0_0_12px_rgba(255,229,0,0.6)]"
                        : isSecond
                          ? "bg-white text-arcade-ink"
                          : "bg-arcade-green text-white"
                    }`}
                  >
                    #{entry.rank}
                  </div>
                  <h3 className="mt-4 font-display text-xl text-white sm:text-2xl">
                    {entry.playerName}
                  </h3>
                  <span className="mt-1 font-display text-xs uppercase tracking-wider text-arcade-yellow/90 sm:text-sm">
                    {entry.gameName}
                  </span>
                  <div className="mt-4 rounded-lg bg-black/40 px-4 py-1.5 font-display text-lg font-bold text-arcade-yellow sm:text-xl">
                    {entry.score.toLocaleString("id-ID")} PTS
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/30 bg-black/20 p-10 text-center backdrop-blur-xs">
            <p className="font-display text-base text-white/80">
              Belum ada data skor turnamen tercatat.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Lihat Leaderboard Lengkap →
          </Link>
        </div>
      </div>
    </section>
  );
}
