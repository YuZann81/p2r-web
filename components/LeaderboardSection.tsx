import React from "react";
import Link from "next/link";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

type LeaderboardSectionProps = {
  gameSlugs?: string[];
};

export default async function LeaderboardSection({
  gameSlugs,
}: LeaderboardSectionProps = {}) {
  const { entries } = await getLeaderboardData(
    gameSlugs ? { gameSlugs } : undefined,
  );

  const rank1 = entries.find((e) => e.rank === 1);
  const rank2 = entries.find((e) => e.rank === 2);
  const rank3 = entries.find((e) => e.rank === 3);
  const hasPodium = Boolean(rank1 || rank2 || rank3);
  const otherEntries = entries.slice(3, 9);

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
          className="absolute left-1/2 top-[18%] h-[420px] w-[680px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
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
            {entries.length > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#5b2be6]/40 bg-[#171224]/90 px-3.5 py-2 font-display text-sm tracking-widest text-[#FFF5E9] tabular-nums">
                <span className="h-1.5 w-1.5 bg-[#ffe500]" aria-hidden="true" />
                <span>TOP {String(Math.min(entries.length, 9)).padStart(2, "0")}</span>
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

        {hasPodium ? (
          <>
            {/* Cyber Arcade Podium (only real API entries, never fabricated) */}
            <div className="relative mx-auto mb-10 max-w-4xl pt-2 md:mb-12">
              <div className="grid w-full grid-cols-1 items-end gap-5 sm:grid-cols-3 md:gap-6">
                {/* Rank 2 (Left) */}
                {rank2 ? (
                  <article className="relative order-2 flex flex-col items-center sm:order-1">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-[#5b2be6]/65 bg-gradient-to-b from-[#2a1147]/70 via-[#171224]/95 to-[#171224] p-5 text-center shadow-[0_18px_36px_rgba(14,10,26,0.75)]">
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 left-2.5 h-2.5 w-2.5 border-t-2 border-l-2 border-[#5b2be6]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 right-2.5 h-2.5 w-2.5 border-t-2 border-r-2 border-[#5b2be6]"
                      />
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#5b2be6] bg-[#5b2be6]/20 font-display text-lg font-bold text-[#FFF5E9] tabular-nums shadow-[2px_2px_0_#0E0A1A]">
                        #2
                      </div>
                      <h3 className="truncate font-display text-xl tracking-wide text-[#FFF5E9]">
                        {rank2.playerName}
                      </h3>
                      <p className="mt-1.5 font-display text-base font-bold tracking-wider text-[#7ac70c] tabular-nums">
                        {rank2.score.toLocaleString("id-ID")} PTS
                      </p>
                      <span className="mt-1 block truncate font-body text-xs text-[#B7ABCE]">
                        {rank2.gameName}
                      </span>
                    </div>
                  </article>
                ) : (
                  <div className="hidden sm:order-1 sm:block" aria-hidden="true" />
                )}

                {/* Rank 1 (Center Champion) */}
                {rank1 ? (
                  <article className="relative order-1 flex flex-col items-center sm:order-2 sm:-translate-y-4">
                    <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#ffe500]/65 bg-[#0E0A1A] px-3 py-1 font-display text-xs font-bold tracking-[0.16em] text-[#ffe500] uppercase shadow-[2px_2px_0_#0E0A1A]">
                      <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#ffe500]" />
                      JUARA 1
                    </span>
                    <div className="relative w-full overflow-hidden rounded-3xl border-2 border-[#ffe500]/80 bg-gradient-to-b from-[#2a1147]/90 via-[#171224]/96 to-[#171224] p-6 text-center shadow-[0_24px_48px_rgba(14,10,26,0.88)]">
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
                        className="absolute bottom-2.5 left-2.5 h-2 w-2 bg-[#7ac70c]/85"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-2.5 right-2.5 h-2 w-2 bg-[#ffe500]/85"
                      />
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffe500] font-display text-2xl font-bold text-[#0E0A1A] tabular-nums shadow-[3px_3px_0_#B8960A]">
                        #1
                      </div>
                      <h3
                        className="truncate font-display text-2xl font-bold tracking-wide text-[#FFF5E9]"
                        style={{ textShadow: "2px 2px 0px #0E0A1A" }}
                      >
                        {rank1.playerName}
                      </h3>
                      <p className="mt-1.5 font-display text-lg font-extrabold tracking-wider text-[#ffe500] tabular-nums">
                        {rank1.score.toLocaleString("id-ID")} PTS
                      </p>
                      <span className="mt-1 block truncate font-body text-xs font-medium text-[#B7ABCE]">
                        {rank1.gameName}
                      </span>
                    </div>
                  </article>
                ) : (
                  <div className="hidden sm:order-2 sm:block" aria-hidden="true" />
                )}

                {/* Rank 3 (Right) */}
                {rank3 ? (
                  <article className="relative order-3 flex flex-col items-center">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-[#7a1fb0]/65 bg-gradient-to-b from-[#2a1147]/60 via-[#171224]/95 to-[#171224] p-5 text-center shadow-[0_18px_36px_rgba(14,10,26,0.75)]">
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 left-2.5 h-2.5 w-2.5 border-t-2 border-l-2 border-[#7a1fb0]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 right-2.5 h-2.5 w-2.5 border-t-2 border-r-2 border-[#7a1fb0]"
                      />
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#7a1fb0] bg-[#7a1fb0]/25 font-display text-lg font-bold text-[#FFF5E9] tabular-nums shadow-[2px_2px_0_#0E0A1A]">
                        #3
                      </div>
                      <h3 className="truncate font-display text-xl tracking-wide text-[#FFF5E9]">
                        {rank3.playerName}
                      </h3>
                      <p className="mt-1.5 font-display text-base font-bold tracking-wider text-[#B7ABCE] tabular-nums">
                        {rank3.score.toLocaleString("id-ID")} PTS
                      </p>
                      <span className="mt-1 block truncate font-body text-xs text-[#B7ABCE]/85">
                        {rank3.gameName}
                      </span>
                    </div>
                  </article>
                ) : (
                  <div className="hidden sm:order-3 sm:block" aria-hidden="true" />
                )}
              </div>
            </div>

            {/* Ranks 4-9 List */}
            {otherEntries.length > 0 && (
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                {otherEntries.map((item) => (
                  <div
                    key={`${item.rank}-${item.playerName}-${item.gameName}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#5b2be6]/35 bg-[#171224]/90 px-4 py-3.5 shadow-[0_10px_22px_rgba(14,10,26,0.55)] transition-colors hover:border-[#ffe500]/55"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#5b2be6]/40 bg-[#2a1147]/80 font-display text-xs font-bold text-[#ffe500] tabular-nums">
                        #{item.rank}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-medium text-[#FFF5E9]">
                          {item.playerName}
                        </p>
                        <p className="truncate font-body text-[11px] text-[#B7ABCE]/80">
                          {item.gameName}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-display text-sm font-bold tracking-wide text-[#7ac70c] tabular-nums">
                      {item.score.toLocaleString("id-ID")} PTS
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            data-testid="leaderboard-empty-state"
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
              Belum Ada Skor Tercatat
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#FFF5E9]/78 sm:text-base">
              Klasemen turnamen arcade akan tampil otomatis setelah pemain mulai mencetak skor pada game pameran.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
