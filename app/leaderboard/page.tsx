import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DualLeaderboardView from "@/components/leaderboard/DualLeaderboardView";
import { getDualLeaderboardBootstrap } from "@/lib/leaderboard/getLeaderboard";

export const metadata: Metadata = {
  title: "Leaderboard & Klasemen — Pixels to Reality",
  description:
    "Papan klasemen keseluruhan dan skor tertinggi per game pameran Pixel To Reality.",
};

export default async function LeaderboardPage() {
  const { overall, games } = await getDualLeaderboardBootstrap();

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          <header className="mb-10 text-center md:mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-display text-sm tracking-wider text-[#68D5E8] transition-colors hover:text-[#FFD447]"
            >
              ← Kembali ke Beranda
            </Link>
            <h1
              className="mt-3 font-display text-4xl text-[#FFD447] select-none sm:text-5xl md:text-6xl"
              style={{
                textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
              }}
            >
              LEADERBOARD
            </h1>
          </header>

          <DualLeaderboardView initialOverall={overall} games={games} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
