import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import { getGames } from "@/lib/games/getGames";

export const metadata: Metadata = {
  title: "Direktori Game Arcade — Pixels to Reality",
  description:
    "Direktori seluruh game arcade interaktif buatan siswa RPL di Pixel To Reality. Mainkan dan raih skor tertinggi!",
};

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
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
              DIREKTORI GAME
            </h1>
          </header>

          {/* Game List */}
          <section aria-label="Daftar Game Arcade" className="w-full">
            {games.length > 0 ? (
              <div className="flex flex-col gap-10 md:gap-14">
                {games.map((game, index) => (
                  <GameCard key={game.id} game={game} reversed={index % 2 === 1} />
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-[#FFD447]/40 bg-[#39265E]/30 text-center rounded-3xl">
                <span className="inline-block rounded-full bg-[#FFD447]/20 px-3.5 py-1 font-display text-xs tracking-wider text-[#FFD447] mb-3">
                  Koleksi Game
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-[#FFD447] font-bold mb-2">
                  Game Segera Hadir
                </h2>
                <p className="text-[#FFF5E9]/80 font-body text-sm max-w-md leading-relaxed">
                  Daftar game arcade sedang dipersiapkan oleh tim siswa RPL. Pantau terus update pameran!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
