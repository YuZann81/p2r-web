import React from "react";
import Link from "next/link";
import Pixel404Illustration from "@/components/Pixel404Illustration";
import AnimatedArcadeHeading from "@/components/AnimatedArcadeHeading";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#211B35] px-4 py-8 text-center text-[#FFF5E9] sm:px-6 sm:py-14">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center text-center">
        {/* 1. Ilustrasi Pixel Art Retro Arcade (Elemen Visual Utama) */}
        <Pixel404Illustration className="mb-2 sm:mb-3" />

        {/* 2. Heading Utama: Animated Arcade Typography (Glitch & Scramble) */}
        <AnimatedArcadeHeading />

        {/* 3. Deskripsi Singkat yang Terbaca & Proporsional */}
        <p className="mt-2.5 max-w-[580px] font-body text-sm leading-relaxed text-[#FFF5E9]/90 sm:mt-3.5 sm:text-base md:text-lg">
          Oops! Halaman yang kamu cari tidak ditemukan atau mungkin telah berpindah dimensi.
        </p>

        {/* 4. Dua Tombol Navigasi Seimbang (Satu Baris pada Desktop, Vertikal pada Smartphone) */}
        <div className="mt-7 flex w-full flex-col items-center justify-center gap-3.5 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="inline-flex h-12 w-full sm:w-auto min-w-[180px] items-center justify-center rounded-xl bg-[#FFD43B] px-6 font-display text-base font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A] sm:text-lg"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/games"
            className="inline-flex h-12 w-full sm:w-auto min-w-[180px] items-center justify-center rounded-xl border-2 border-[#503080] bg-transparent px-6 font-display text-base font-bold text-[#FFF5E9] shadow-[4px_4px_0_#0E0A1A] transition-all hover:-translate-y-0.5 hover:border-[#9470E8] hover:bg-[#503080]/30 hover:text-[#FFD43B] active:translate-y-0.5 active:shadow-[2px_2px_0_#0E0A1A] sm:text-lg"
          >
            Jelajahi Game
          </Link>
        </div>
      </div>
    </main>
  );
}
