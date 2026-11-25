import React from "react";
import Link from "next/link";
import DualLeaderboardView from "@/components/leaderboard/DualLeaderboardView";
import { getDualLeaderboardBootstrap } from "@/lib/leaderboard/getLeaderboard";
import type { LeaderboardGameOption } from "@/lib/api/types/leaderboard";

type LeaderboardSectionProps = {
  games?: LeaderboardGameOption[];
};

export default async function LeaderboardSection({
  games: preloadedGames,
}: LeaderboardSectionProps = {}) {
  const { overall, games } = await getDualLeaderboardBootstrap(
    preloadedGames ? { games: preloadedGames } : undefined,
  );

  const topCount = Math.min(overall.data.entries.length, 9);

  return (
    <section
      id="leaderboard"
      aria-labelledby="leaderboard-heading"
      className="relative w-full overflow-hidden border-t border-[#5b2be6]/25 bg-[#1C172D] px-4 py-16 sm:px-6 md:py-24"
    >
      {/* Subtle dark-purple stage atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[18%] h-[420px] w-[680px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(91, 43, 230, 0.34) 0%, rgba(122, 31, 176, 0.18) 52%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Exhibition Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2.5 font-body text-[11px] font-semibold tracking-[0.2em] text-[#B7ABCE] uppercase sm:text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-[#7ac70c]" />
              <span>ARCADE TOURNAMENT &middot; LIVE RANKINGS</span>
            </p>
            <h2
              id="leaderboard-heading"
              className="mt-3 font-display text-4xl leading-[0.98] tracking-wide text-[#FFF5E9] sm:text-5xl md:text-6xl"
              style={{
                textShadow: "3px 3px 0px #2a1147, 5px 5px 0px #0E0A1A",
              }}
            >
              LEADERBOARD <span className="text-[#ffe500]">ARCADE</span>
            </h2>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-3 md:w-auto md:justify-end">
            {topCount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#5b2be6]/40 bg-[#171224]/90 px-3.5 py-2 font-display text-sm tracking-widest text-[#FFF5E9] tabular-nums">
                <span className="h-1.5 w-1.5 bg-[#ffe500]" aria-hidden="true" />
                <span>TOP {String(topCount).padStart(2, "0")}</span>
              </div>
            )}

            <Link
              href="/leaderboard"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#5b2be6]/50 bg-[#2a1147]/70 px-5 py-2 font-display text-base tracking-wide text-[#FFF5E9] shadow-[3px_3px_0_#0E0A1A] transition-colors hover:border-[#ffe500] hover:text-[#ffe500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500]"
            >
              <span>Lihat Klasemen Lengkap</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <DualLeaderboardView initialOverall={overall} games={games} compact />
      </div>
    </section>
  );
}
