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
          <header className="mb-12 text-center md:mb-16">
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
            <p className="mx-auto mt-3 max-w-2xl font-body text-base text-[#FFF5E9]/85 sm:text-lg">
              Koleksi lengkap seluruh game arcade interaktif buatan siswa jurusan Rekayasa Perangkat Lunak. Pilih game favoritmu, mainkan, dan catatkan skormu di leaderboard!
            </p>
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

          {/* Bottom Back Button */}
          <div className="mt-16 flex justify-center md:mt-24">
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
