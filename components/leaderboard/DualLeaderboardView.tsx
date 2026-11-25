"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gamepad2, Trophy } from "lucide-react";
import type {
  CoreLeaderboardEntry,
  GameLeaderboardGroup,
  LeaderboardEntry,
} from "@/lib/api/types/leaderboard";

type LeaderboardTab = "core" | "per_game";

type DualLeaderboardViewProps = {
  coreEntries: readonly (CoreLeaderboardEntry | LeaderboardEntry)[];
  perGameGroups: readonly GameLeaderboardGroup[];
  compact?: boolean;
};

function isCoreEntry(
  entry: CoreLeaderboardEntry | LeaderboardEntry,
): entry is CoreLeaderboardEntry {
  return "gamesCount" in entry && typeof entry.gamesCount === "number";
}

export default function DualLeaderboardView({
  coreEntries,
  perGameGroups,
  compact = false,
}: DualLeaderboardViewProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("core");
  const [selectedGameName, setSelectedGameName] = useState<string>(
    perGameGroups[0]?.gameName || "",
  );

  const activeGameGroup =
    perGameGroups.find((g) => g.gameName === selectedGameName) ||
    perGameGroups[0];

  const activeEntries: readonly (CoreLeaderboardEntry | LeaderboardEntry)[] =
    activeTab === "core" ? coreEntries : (activeGameGroup?.entries ?? []);

  const topThree = activeEntries.slice(0, 3);
  const podiumOrder =
    topThree.length >= 3
      ? [topThree[1], topThree[0], topThree[2]]
      : topThree;

  const compactRank1 =
    activeEntries.find((e) => e.rank === 1) || activeEntries[0];
  const compactRank2 =
    activeEntries.find((e) => e.rank === 2) || activeEntries[1];
  const compactRank3 =
    activeEntries.find((e) => e.rank === 3) || activeEntries[2];
  const compactOtherEntries = activeEntries.slice(3, 9);

  return (
    <div className="w-full">
      {/* Switcher 2 Tipe Leaderboard: Inti (Akumulasi) vs Per Game */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div
          role="tablist"
          aria-label="Pilih tipe leaderboard"
          className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-[#39265E] bg-[#171224] p-1.5 shadow-[4px_4px_0_#0E0A1A]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "core"}
            onClick={() => setActiveTab("core")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-display text-sm sm:text-base tracking-wide transition-all cursor-pointer ${
              activeTab === "core"
                ? "bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A]"
                : "text-[#FFF5E9]/80 hover:bg-white/5 hover:text-[#FFD447]"
            }`}
          >
            <Trophy className="h-4 w-4" aria-hidden="true" />
            <span>Leaderboard Inti (Akumulasi)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "per_game"}
            onClick={() => setActiveTab("per_game")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-display text-sm sm:text-base tracking-wide transition-all cursor-pointer ${
              activeTab === "per_game"
                ? "bg-[#68D5E8] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#0E0A1A]"
                : "text-[#FFF5E9]/80 hover:bg-white/5 hover:text-[#68D5E8]"
            }`}
          >
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            <span>Leaderboard Per Game</span>
          </button>
        </div>

        {/* Deskripsi singkat mode aktif atau pemilih game */}
        {activeTab === "core" ? (
          <p className="max-w-xl text-center font-body text-xs sm:text-sm text-[#FFF5E9]/75">
            Akumulasi total skor setiap pemain dari seluruh game yang dimainkan.
          </p>
        ) : (
          <div
            role="group"
            aria-label="Pilih game untuk klasemen"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {perGameGroups.map((group) => {
              const isSelected = group.gameName === activeGameGroup?.gameName;
              return (
                <button
                  key={group.gameName}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedGameName(group.gameName)}
                  className={`rounded-xl border px-3.5 py-1.5 font-display text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#FFD447] bg-[#FFD447]/15 text-[#FFD447] shadow-[2px_2px_0_#0E0A1A]"
                      : "border-[#39265E] bg-[#171224] text-[#FFF5E9]/75 hover:border-[#68D5E8]/60 hover:text-[#68D5E8]"
                  }`}
                >
                  {group.gameName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mode Ringkas untuk Homepage */}
      {compact ? (
        <>
          {activeEntries.length > 0 && (
            <div className="relative mb-12 flex flex-col items-center">
              <div className="grid w-full max-w-3xl grid-cols-1 items-end gap-6 pt-2 sm:grid-cols-3 sm:gap-4 md:gap-8">
                {compactRank2 && (
                  <div className="relative order-2 flex flex-col items-center sm:order-1">
                    <div className="w-full rounded-2xl border-2 border-[#68D5E8] bg-gradient-to-b from-[#68D5E8]/15 via-[#211B35] to-[#171224] p-5 text-center shadow-[6px_6px_0_#0E0A1A]">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#68D5E8] bg-[#68D5E8]/20 font-display text-lg font-bold text-[#68D5E8] shadow-md">
                        #{compactRank2.rank}
                      </div>
                      <h3 className="truncate font-display text-xl text-[#FFF5E9]">
                        {compactRank2.playerName}
                      </h3>
                      <p className="mt-1 font-display text-sm tracking-wider text-[#68D5E8]">
                        {compactRank2.score.toLocaleString("id-ID")} PTS
                      </p>
                      <span className="mt-0.5 block truncate text-[11px] text-[#FFF5E9]/70">
                        {isCoreEntry(compactRank2)
                          ? `Total ${compactRank2.gamesCount} Game`
                          : compactRank2.gameName}
                      </span>
                    </div>
                  </div>
                )}

                {compactRank1 && (
                  <div className="relative order-1 flex flex-col items-center sm:order-2 sm:-translate-y-4">
                    <span className="mb-2 rounded-md border border-[#FFD447]/60 bg-[#0E0A1A] px-3 py-1 font-display text-xs font-bold tracking-wider text-[#FFD447] uppercase shadow-[2px_2px_0_#0E0A1A]">
                      JUARA 1
                    </span>
                    <div className="w-full rounded-2xl border-2 border-[#FFD447] bg-gradient-to-b from-[#FFD447]/20 via-[#211B35] to-[#171224] p-6 text-center shadow-[8px_8px_0_#0E0A1A]">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD447] font-display text-2xl font-bold text-[#0E0A1A] shadow-[2px_2px_0_#B8960A]">
                        #{compactRank1.rank}
                      </div>
                      <h3 className="truncate font-display text-2xl font-bold text-[#FFD447]">
                        {compactRank1.playerName}
                      </h3>
                      <p className="mt-1 font-display text-lg font-extrabold tracking-wider text-[#FFF5E9]">
                        {compactRank1.score.toLocaleString("id-ID")} PTS
                      </p>
                      <span className="mt-0.5 block truncate text-xs font-semibold text-[#FFF5E9]/80">
                        {isCoreEntry(compactRank1)
                          ? `Total ${compactRank1.gamesCount} Game`
                          : compactRank1.gameName}
                      </span>
                    </div>
                  </div>
                )}

                {compactRank3 && (
                  <div className="relative order-3 flex flex-col items-center">
                    <div className="w-full rounded-2xl border-2 border-[#F5A05E] bg-gradient-to-b from-[#F5A05E]/15 via-[#211B35] to-[#171224] p-5 text-center shadow-[6px_6px_0_#0E0A1A]">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#F5A05E] bg-[#F5A05E]/20 font-display text-lg font-bold text-[#F5A05E] shadow-md">
                        #{compactRank3.rank}
                      </div>
                      <h3 className="truncate font-display text-xl text-[#FFF5E9]">
                        {compactRank3.playerName}
                      </h3>
                      <p className="mt-1 font-display text-sm tracking-wider text-[#F5A05E]">
                        {compactRank3.score.toLocaleString("id-ID")} PTS
                      </p>
                      <span className="mt-0.5 block truncate text-[11px] text-[#FFF5E9]/70">
                        {isCoreEntry(compactRank3)
                          ? `Total ${compactRank3.gamesCount} Game`
                          : compactRank3.gameName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {compactOtherEntries.length > 0 && (
            <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-2">
              {compactOtherEntries.map((item) => (
                <div
                  key={`${activeTab}-${item.playerName}-${item.rank}`}
                  className="flex items-center justify-between rounded-xl border border-[#39265E] bg-[#171224] px-5 py-3 shadow-[3px_3px_0_#0E0A1A] transition-colors hover:border-[#68D5E8]/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#211B35] font-display text-xs font-bold text-[#FFD447]">
                      #{item.rank}
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate font-display text-base font-medium text-[#FFF5E9]">
                        {item.playerName}
                      </span>
                      {isCoreEntry(item) && item.gamesCount > 1 && (
                        <span className="block font-body text-[11px] text-[#FFF5E9]/60">
                          Akumulasi {item.gamesCount} Game
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 font-display text-sm font-bold text-[#68D5E8]">
                    {item.score.toLocaleString("id-ID")} PTS
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD447] px-8 py-3.5 font-display text-lg font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A] cursor-pointer"
            >
              <span>Lihat Klasemen Lengkap</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </>
      ) : (
        /* Mode Lengkap untuk /leaderboard */
        <>
          {podiumOrder.length > 0 && (
            <section aria-label="Top 3 Juara Klasemen" className="mb-14">
              <h2 className="mb-8 text-center font-display text-2xl text-[#FFD447] drop-shadow-[2px_2px_0_#0E0A1A] sm:text-3xl">
                {activeTab === "core"
                  ? "TOP 3 CHAMPIONS"
                  : `TOP 3 • ${activeGameGroup?.gameName ?? ""}`}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-end">
                {podiumOrder.map((entry) => {
                  const isFirst = entry.rank === 1;
                  const isSecond = entry.rank === 2;

                  return (
                    <div
                      key={`${activeTab}-${entry.playerName}-${entry.rank}`}
                      className={`flex flex-col items-center rounded-2xl p-6 text-center shadow-[6px_6px_0_#0E0A1A] transition-transform ${
                        isFirst
                          ? "order-1 border-2 border-[#FFD447] bg-gradient-to-b from-[#FFD447]/20 via-[#211B35] to-[#171224] shadow-[0_0_20px_rgba(255,212,71,0.2)] sm:order-2 sm:-translate-y-4 sm:p-8"
                          : isSecond
                            ? "order-2 border-2 border-[#68D5E8] bg-gradient-to-b from-[#68D5E8]/15 via-[#211B35] to-[#171224] sm:order-1 sm:p-6"
                            : "order-3 border-2 border-[#F5A05E] bg-gradient-to-b from-[#F5A05E]/15 via-[#211B35] to-[#171224] sm:order-3 sm:p-6"
                      }`}
                    >
                      {isFirst && (
                        <div className="mb-2">
                          <span className="rounded-md border border-[#FFD447]/60 bg-[#0E0A1A] px-3 py-1 font-display text-xs font-bold tracking-wider text-[#FFD447] uppercase shadow-xs">
                            JUARA 1
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-xl font-bold shadow-md ${
                          isFirst
                            ? "bg-[#FFD447] text-[#0E0A1A] shadow-[0_0_12px_rgba(255,212,71,0.8)]"
                            : isSecond
                              ? "border border-[#68D5E8] bg-[#68D5E8]/20 text-[#68D5E8]"
                              : "border border-[#F5A05E] bg-[#F5A05E]/20 text-[#F5A05E]"
                        }`}
                      >
                        #{entry.rank}
                      </div>
                      <h3
                        className={`mt-3 w-full truncate font-display text-2xl ${
                          isFirst ? "font-bold text-[#FFD447]" : "text-[#FFF5E9]"
                        }`}
                      >
                        {entry.playerName}
                      </h3>
                      <span
                        className={`mt-1 w-full truncate font-display text-xs tracking-wider uppercase ${
                          isFirst
                            ? "font-semibold text-[#FFF5E9]/80"
                            : isSecond
                              ? "text-[#68D5E8]"
                              : "text-[#F5A05E]"
                        }`}
                      >
                        {isCoreEntry(entry)
                          ? `Total ${entry.gamesCount} Game`
                          : entry.gameName}
                      </span>
                      <div className="mt-4 rounded-xl border border-white/10 bg-[#0E0A1A] px-5 py-2 font-display text-lg font-bold text-[#FFD447] sm:text-xl">
                        {entry.score.toLocaleString("id-ID")} PTS
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tabel Klasemen Lengkap */}
          <section
            aria-label="Tabel Klasemen Lengkap"
            className="overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#171224] shadow-[6px_6px_0_#0E0A1A]"
          >
            {activeEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#FFF5E9] sm:text-base">
                  <thead className="border-b border-[#39265E] bg-[#211B35] font-display text-base tracking-wider text-[#FFD447] uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-4 text-center sm:px-6">
                        Rank
                      </th>
                      <th scope="col" className="px-5 py-4 sm:px-6">
                        Player
                      </th>
                      <th scope="col" className="px-5 py-4 text-right sm:px-6">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-body">
                    {activeEntries.map((entry) => (
                      <tr
                        key={`${activeTab}-${entry.playerName}-${entry.rank}`}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="px-5 py-4 text-center font-display font-bold sm:px-6">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                              entry.rank === 1
                                ? "bg-[#FFD447] text-[#0E0A1A]"
                                : entry.rank === 2
                                  ? "bg-[#FFF5E9] text-[#0E0A1A]"
                                  : entry.rank === 3
                                    ? "bg-[#CD7F32] text-white"
                                    : "text-[#B7ABCE]"
                            }`}
                          >
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <div className="font-semibold text-[#FFF5E9]">
                            {entry.playerName}
                          </div>
                          {activeTab === "core" && isCoreEntry(entry) ? (
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {entry.gamesBreakdown.map((g) => (
                                <span
                                  key={g.gameName}
                                  className="rounded-md border border-[#39265E] bg-[#211B35] px-2 py-0.5 text-[11px] text-[#68D5E8]"
                                >
                                  {g.gameName}: {g.score.toLocaleString("id-ID")}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-[#FFF5E9]/65">
                              {entry.gameName}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right font-display text-base font-bold text-[#FFD447] sm:px-6 sm:text-lg">
                          {entry.score.toLocaleString("id-ID")} PTS
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center font-body text-sm text-[#FFF5E9]/70">
                Belum ada data skor untuk kategori ini.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
