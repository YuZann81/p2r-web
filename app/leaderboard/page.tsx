import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

export const metadata: Metadata = {
  title: "Leaderboard & Klasemen — Pixels to Reality",
  description:
    "Papan klasemen skor tertinggi game arcade dan perolehan suara voting karya pameran Pixel To Reality.",
};

export default async function LeaderboardPage() {
  const { mode, entries } = await getLeaderboardData();

  const topThree = entries.slice(0, 3);
  const podiumOrder =
    topThree.length >= 3
      ? [topThree[1], topThree[0], topThree[2]]
      : topThree;

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          <header className="mb-10 text-center md:mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-display text-sm tracking-wider text-[#68D5E8] transition-colors hover:text-[#FFD447]"
            >
              ← Kembali ke Beranda
            </Link>
            <h1
              className="mt-3 font-display text-4xl text-[#FFD447] sm:text-5xl md:text-6xl select-none"
              style={{
                textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
              }}
            >
              LEADERBOARD
            </h1>
            <p className="mx-auto mt-3 max-w-2xl font-body text-base text-[#FFF5E9]/85 sm:text-lg">
              Papan klasemen global skor turnamen arcade pameran Pixel To Reality. Raih skor tertinggi dan catat namamu di posisi puncak!
            </p>
          </header>

          {/* Mode Banner */}
          <div className="mb-10 rounded-2xl border-2 border-[#39265E] bg-[#171224] p-4 text-center sm:p-5">
            {mode === "preview" ? (
              <>
                <span className="inline-block rounded-lg bg-[#FFD447]/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-[#FFD447] sm:text-sm">
                  SIMULASI / PREVIEW MODE
                </span>
                <p className="mt-2 text-xs font-body text-[#FFF5E9]/80 sm:text-sm">
                  Data klasemen di bawah ini merupakan data simulasi preview pameran. Leaderboard live real-time diperbarui saat sesi turnamen aktif.
                </p>
              </>
            ) : (
              <>
                <span className="inline-block rounded-lg bg-[#7AC70C]/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-[#7AC70C] sm:text-sm">
                  LIVE EVENT LEADERBOARD
                </span>
                <p className="mt-2 text-xs font-body text-[#FFF5E9]/80 sm:text-sm">
                  Papan klasemen skor resmi turnamen arcade pameran Pixel To Reality: The Cyber Arcade.
                </p>
              </>
            )}
          </div>

          {/* Top 3 Podium Highlights */}
          {podiumOrder.length > 0 && (
            <section aria-label="Top 3 Juara Klasemen" className="mb-14">
              <h2 className="mb-8 text-center font-display text-2xl text-[#FFD447] sm:text-3xl drop-shadow-[2px_2px_0_#0E0A1A]">
                TOP 3 CHAMPIONS
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-end">
                {podiumOrder.map((entry) => {
                  const isFirst = entry.rank === 1;
                  const isSecond = entry.rank === 2;

                  const isThird = entry.rank === 3;

                  return (
                    <div
                      key={entry.rank}
                      className={`flex flex-col items-center rounded-2xl p-6 text-center shadow-[6px_6px_0_#0E0A1A] transition-transform ${
                        isFirst
                          ? "order-1 border-2 border-[#FFD447] bg-gradient-to-b from-[#FFD447]/20 via-[#211B35] to-[#171224] sm:order-2 sm:-translate-y-4 sm:p-8 shadow-[0_0_20px_rgba(255,212,71,0.2)]"
                          : isSecond
                            ? "order-2 border-2 border-[#68D5E8] bg-gradient-to-b from-[#68D5E8]/15 via-[#211B35] to-[#171224] sm:order-1 sm:p-6"
                            : "order-3 border-2 border-[#F5A05E] bg-gradient-to-b from-[#F5A05E]/15 via-[#211B35] to-[#171224] sm:order-3 sm:p-6"
                      }`}
                    >
                      {isFirst && (
                        <div className="mb-2">
                          <span className="rounded-md bg-[#0E0A1A] px-3 py-1 font-display text-xs font-bold tracking-wider text-[#FFD447] border border-[#FFD447]/60 uppercase shadow-xs">
                            JUARA 1
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-xl font-bold shadow-md ${
                          isFirst
                            ? "bg-[#FFD447] text-[#0E0A1A] shadow-[0_0_12px_rgba(255,212,71,0.8)]"
                            : isSecond
                              ? "bg-[#68D5E8]/20 border border-[#68D5E8] text-[#68D5E8]"
                              : "bg-[#F5A05E]/20 border border-[#F5A05E] text-[#F5A05E]"
                        }`}
                      >
                        #{entry.rank}
                      </div>
                      <h3 className={`mt-3 font-display text-2xl truncate w-full ${isFirst ? "text-[#FFD447] font-bold" : "text-[#FFF5E9]"}`}>
                        {entry.playerName}
                      </h3>
                      <span className={`mt-1 font-display text-xs uppercase tracking-wider truncate w-full ${isFirst ? "text-[#FFF5E9]/80 font-semibold" : isSecond ? "text-[#68D5E8]" : "text-[#F5A05E]"}`}>
                        {entry.gameName}
                      </span>
                      <div className="mt-4 rounded-xl bg-[#0E0A1A] px-5 py-2 font-display text-lg font-bold text-[#FFD447] sm:text-xl border border-white/10">
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
            className="overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#171224] shadow-[6px_6px_0_#0E0A1A]"
          >
            {entries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#FFF5E9] sm:text-base">
                  <thead className="border-b border-[#39265E] bg-[#211B35] font-display text-base uppercase tracking-wider text-[#FFD447]">
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
                    {entries.map((entry) => (
                      <tr
                        key={entry.rank}
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
                        <td className="px-5 py-4 font-semibold text-[#FFF5E9] sm:px-6">
                          {entry.playerName}
                        </td>
                        <td className="px-5 py-4 text-right font-display text-base font-bold text-[#FFD447] sm:px-6 sm:text-lg">
                          {entry.score.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center font-body text-sm text-[#FFF5E9]/70">
                Belum ada data skor klasemen yang tercatat.
              </div>
            )}
          </section>

          {/* Bottom Back Button */}
          <div className="mt-14 flex justify-center md:mt-20">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#FFD447] px-8 py-3.5 font-display text-xl text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A]"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
