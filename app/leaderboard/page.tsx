import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

export const metadata: Metadata = {
  title: "Leaderboard — Pixels to Reality",
  description:
    "Papan klasemen skor tertinggi game arcade pameran Pixel To Reality: The Cyber Arcade.",
};

// Scores change continuously during the exhibition, so the page is
// regenerated periodically instead of being frozen at build time.
export const revalidate = 30;

export default async function LeaderboardPage() {
  const { mode, entries, gameTitle } = await getLeaderboardData();

  const topThree = entries.slice(0, 3);
  const podiumOrder =
    topThree.length >= 3
      ? [topThree[1], topThree[0], topThree[2]]
      : topThree;

  return (
    <main
      className="flex min-h-screen flex-col justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="mb-10 text-center md:mb-14">
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-4xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            LEADERBOARD
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-pretty text-white/90 sm:text-lg">
            Papan klasemen skor game arcade resmi pameran Pixel To Reality: The Cyber Arcade.
          </p>
        </header>

        {/* Status Banner */}
        <div
          role="status"
          aria-label="Status Mode Leaderboard"
          className="mb-10 rounded-xl border-2 border-arcade-yellow/40 bg-black/30 p-4 text-center backdrop-blur-xs sm:p-5"
        >
          {mode === "live" ? (
            <>
              <span className="inline-block rounded-full bg-arcade-green/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-arcade-green sm:text-sm">
                🏆 LIVE LEADERBOARD ⚡
              </span>
              <p className="mt-2 text-xs font-medium text-white/80 sm:text-sm">
                {gameTitle ? `Papan klasemen skor resmi: ${gameTitle}.` : "Papan klasemen skor resmi pameran Pixel To Reality."}
              </p>
            </>
          ) : mode === "error" ? (
            <>
              <span className="inline-block rounded-full bg-red-500/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-red-400 sm:text-sm">
                ⚠ Gagal Memuat Data
              </span>
              <p className="mt-2 text-xs font-medium text-white/80 sm:text-sm">
                Papan klasemen tidak dapat dimuat saat ini. Silakan coba beberapa saat lagi.
              </p>
            </>
          ) : (
            <>
              <span className="inline-block rounded-full bg-arcade-yellow/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow sm:text-sm">
                ⏳ BELUM ADA DATA SKOR
              </span>
              <p className="mt-2 text-xs font-medium text-white/80 sm:text-sm">
                Mainkan game arcade di pameran dan jadilah pemain pertama yang tercatat di papan klasemen resmi!
              </p>
            </>
          )}
        </div>

        {/* No data: show empty state */}
        {entries.length === 0 ? (
          <div className="rounded-xl border border-white/15 bg-black/30 backdrop-blur-xs p-10 text-center sm:p-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow text-4xl">
              🏆
            </div>
            <h2 className="font-display text-2xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-3xl">
              Belum Ada Catatan Skor
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-white/80 sm:text-base">
              Belum ada pemain yang terdaftar di papan klasemen turnamen. Mainkan game arcade di area pameran dan raih skor tertinggi!
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {podiumOrder.length > 0 && (
              <section aria-label="Top 3 Juara Klasemen" className="mb-12">
                <h2 className="mb-6 text-center font-display text-2xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-3xl">
                  TOP 3 PLAYERS
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-end">
                  {podiumOrder.map((entry) => {
                    const isFirst = entry.rank === 1;
                    const isSecond = entry.rank === 2;

                    return (
                      <div
                        key={entry.rank}
                        className={`flex flex-col items-center rounded-xl p-6 text-center shadow-lg transition-transform ${
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
              </section>
            )}

            {/* Full Table */}
            <section
              aria-label="Tabel Klasemen Lengkap"
              className="overflow-hidden rounded-xl border border-white/15 bg-black/30 backdrop-blur-xs"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white sm:text-base">
                  <thead className="border-b border-white/20 bg-black/40 font-display text-base uppercase tracking-wider text-arcade-yellow sm:text-lg">
                    <tr>
                      <th scope="col" className="px-4 py-4 text-center sm:px-6">
                        Rank
                      </th>
                      <th scope="col" className="px-4 py-4 sm:px-6">
                        Player
                      </th>
                      <th scope="col" className="px-4 py-4 sm:px-6">
                        Game
                      </th>
                      <th scope="col" className="px-4 py-4 text-right sm:px-6">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {entries.map((entry) => (
                      <tr
                        key={entry.rank}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="px-4 py-4 text-center font-display font-bold sm:px-6">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                              entry.rank === 1
                                ? "bg-arcade-yellow text-arcade-ink font-bold"
                                : entry.rank === 2
                                  ? "bg-white/90 text-arcade-ink font-bold"
                                  : entry.rank === 3
                                    ? "bg-arcade-green text-white font-bold"
                                    : "text-white/80"
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-white sm:px-6">
                          {entry.playerName}
                        </td>
                        <td className="px-4 py-4 text-white/80 sm:px-6">
                          {entry.gameName}
                        </td>
                        <td className="px-4 py-4 text-right font-display text-base font-bold text-arcade-yellow sm:px-6 sm:text-lg">
                          {entry.score.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center md:mt-20">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
