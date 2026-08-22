import type { Metadata } from "next";
import Link from "next/link";
import LeaderboardClient from "@/components/LeaderboardClient";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";

export const metadata: Metadata = {
  title: "Leaderboard — Pixels to Reality",
  description:
    "Papan klasemen skor tertinggi game arcade dan perolehan suara voting karya pameran Pixel To Reality.",
};

export default async function LeaderboardPage() {
  const { mode, entries, karyaRankings } = await getLeaderboardData();

  return (
    <main
      className="flex min-h-screen flex-col justify-between px-4 py-10 sm:px-6 sm:py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Navigation & Header */}
        <header className="mb-8 text-center sm:mb-12">
          <Link
            href="/"
            className="inline-block rounded-lg px-2 py-1 font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-3xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            LEADERBOARD
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-pretty text-white/90 sm:text-base md:text-lg">
            Papan klasemen skor arcade dan ranking voting karya pameran Pixel To Reality.
          </p>
        </header>

        {/* Interactive Leaderboard Client */}
        <LeaderboardClient
          mode={mode}
          initialEntries={entries}
          initialKaryaRankings={karyaRankings}
        />

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center md:mt-20">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
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
