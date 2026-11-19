import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#211B35] px-6 py-16 text-center text-[#FFF5E9]">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border-2 border-[#39265E] bg-[#171224] p-8 shadow-[8px_8px_0_#0E0A1A] sm:p-12">
        <span className="inline-block rounded-lg bg-[#FFD447]/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-[#FFD447]">
          404 Error &bull; Stage Not Found
        </span>
        <h1
          className="mt-4 font-display text-5xl font-bold text-[#FFD447] sm:text-7xl select-none"
          style={{
            textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
          }}
        >
          GAME OVER
        </h1>
        <p className="mt-3 font-body text-base text-[#FFF5E9]/85 sm:text-lg">
          Halaman yang Anda tuju tidak ditemukan atau telah berpindah dimensi pameran.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#FFD447] px-6 py-3 font-display text-base font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#B8960A] active:translate-y-0.5 active:shadow-none"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/games"
            className="inline-flex items-center justify-center rounded-xl border-2 border-[#39265E] bg-[#211B35] px-6 py-3 font-display text-base font-bold text-[#FFF5E9] transition-all hover:bg-[#39265E]"
          >
            Lihat Game Arcade
          </Link>
        </div>
      </div>
    </main>
  );
}
