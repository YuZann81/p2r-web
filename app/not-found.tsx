import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center font-body"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border-2 border-dashed border-arcade-yellow/40 bg-black/40 p-8 shadow-2xl backdrop-blur-md sm:p-12">
        <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs font-bold tracking-wider uppercase text-arcade-yellow">
          404 Error — Stage Not Found
        </span>
        <h1 className="mt-4 font-display text-6xl font-bold text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-7xl">
          GAME OVER
        </h1>
        <p className="mt-3 text-base font-semibold text-white/90 sm:text-lg">
          Halaman yang Anda tuju tidak ditemukan atau telah berpindah dimensi.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-arcade-yellow px-6 py-3 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Kembali ke Beranda →
          </Link>
          <Link
            href="/games"
            className="inline-flex items-center justify-center border border-white/30 bg-black/30 px-6 py-3 font-display text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            Lihat Game Arcade
          </Link>
        </div>
      </div>
    </main>
  );
}
