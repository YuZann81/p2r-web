import React from "react";
import Link from "next/link";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

export default async function LeaderboardSection() {
  const { entries } = await getLeaderboardData();

  const rank1 = entries.find((e) => e.rank === 1) || {
    rank: 1,
    playerName: "CyberRider",
    gameName: "Cyber Runner 2099",
    score: 99420,
  };
  const rank2 = entries.find((e) => e.rank === 2) || {
    rank: 2,
    playerName: "PixelMage",
    gameName: "Byte Defender",
    score: 87150,
  };
  const rank3 = entries.find((e) => e.rank === 3) || {
    rank: 3,
    playerName: "NeonNinja",
    gameName: "Quantum Shift",
    score: 76300,
  };

  const otherEntries = entries.slice(3, 9);

  return (
    <section id="leaderboard" className="relative w-full py-16 md:py-24 border-t border-[#39265E]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-14 text-center">
          <h2
            className="font-display text-4xl tracking-widest text-[#FFD447] sm:text-5xl md:text-6xl select-none"
            style={{
              textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
            }}
          >
            LEADERBOARD
          </h2>
        </div>

        {/* Cyber Tournament Podium */}
        <div className="relative mb-12 flex flex-col items-center">
          {/* Top 3 Podium Arrangement */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 md:gap-8 w-full max-w-3xl items-end pt-2">
            {/* Rank 2 (Left) */}
            <div className="relative flex flex-col items-center order-2 sm:order-1">
              <div className="w-full rounded-2xl border-2 border-[#68D5E8] bg-gradient-to-b from-[#68D5E8]/15 via-[#211B35] to-[#171224] p-5 text-center shadow-[6px_6px_0_#0E0A1A]">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#68D5E8]/20 border border-[#68D5E8] font-display text-lg font-bold text-[#68D5E8] shadow-md mb-2">
                  #2
                </div>
                <h3 className="font-display text-xl text-[#FFF5E9] truncate">
                  {rank2.playerName}
                </h3>
                <p className="font-display text-sm text-[#68D5E8] tracking-wider mt-1">
                  {rank2.score.toLocaleString("id-ID")} PTS
                </p>
                <span className="text-[11px] text-[#FFF5E9]/70 truncate block mt-0.5">
                  {rank2.gameName}
                </span>
              </div>
            </div>

            {/* Rank 1 (Center with Champion Badge) */}
            <div className="relative flex flex-col items-center order-1 sm:order-2 sm:-translate-y-4">
              <span className="mb-2 rounded-md bg-[#0E0A1A] px-3 py-1 font-display text-xs font-bold tracking-wider text-[#FFD447] border border-[#FFD447]/60 uppercase shadow-[2px_2px_0_#0E0A1A]">
                JUARA 1
              </span>
              <div className="w-full rounded-2xl border-2 border-[#FFD447] bg-gradient-to-b from-[#FFD447]/20 via-[#211B35] to-[#171224] p-6 text-center shadow-[8px_8px_0_#0E0A1A]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD447] font-display text-2xl font-bold text-[#0E0A1A] shadow-[2px_2px_0_#B8960A] mb-2">
                  #1
                </div>
                <h3 className="font-display text-2xl text-[#FFD447] font-bold truncate">
                  {rank1.playerName}
                </h3>
                <p className="font-display text-lg text-[#FFF5E9] font-extrabold tracking-wider mt-1">
                  {rank1.score.toLocaleString("id-ID")} PTS
                </p>
                <span className="text-xs text-[#FFF5E9]/80 font-semibold truncate block mt-0.5">
                  {rank1.gameName}
                </span>
              </div>
            </div>

            {/* Rank 3 (Right) */}
            <div className="relative flex flex-col items-center order-3">
              <div className="w-full rounded-2xl border-2 border-[#F5A05E] bg-gradient-to-b from-[#F5A05E]/15 via-[#211B35] to-[#171224] p-5 text-center shadow-[6px_6px_0_#0E0A1A]">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F5A05E]/20 border border-[#F5A05E] font-display text-lg font-bold text-[#F5A05E] shadow-md mb-2">
                  #3
                </div>
                <h3 className="font-display text-xl text-[#FFF5E9] truncate">
                  {rank3.playerName}
                </h3>
                <p className="font-display text-sm text-[#F5A05E] tracking-wider mt-1">
                  {rank3.score.toLocaleString("id-ID")} PTS
                </p>
                <span className="text-[11px] text-[#FFF5E9]/70 truncate block mt-0.5">
                  {rank3.gameName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Cyber Cards Grid for ranks 4-9 */}
        {otherEntries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-3xl mx-auto mb-10">
            {otherEntries.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between rounded-xl border border-[#39265E] bg-[#171224] px-5 py-3 shadow-[3px_3px_0_#0E0A1A] transition-colors hover:border-[#68D5E8]/50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#211B35] font-display text-xs font-bold text-[#FFD447] border border-white/10">
                    #{item.rank}
                  </span>
                  <span className="font-display text-base text-[#FFF5E9] font-medium truncate max-w-[140px] sm:max-w-[180px]">
                    {item.playerName}
                  </span>
                </div>
                <span className="font-display text-sm font-bold text-[#68D5E8]">
                  {item.score.toLocaleString("id-ID")} PTS
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tombol Klasemen Lengkap */}
        <div className="flex justify-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD447] px-8 py-3.5 font-display text-lg font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A] cursor-pointer"
          >
            <span>Lihat Klasemen Lengkap</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
