import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registrasi — Pixels to Reality",
};

export default function RegisterPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
        </header>

        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-black/40 p-8 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow">
              Registrasi Akun
            </span>
            <h1 className="mt-3 font-display text-3xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-4xl">
              DAFTAR AKUN
            </h1>
          </div>

          {/* Information about account creation process */}
          <div className="rounded-2xl border border-arcade-yellow/40 bg-arcade-yellow/10 p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">📋</span>
              <div>
                <div className="font-display text-sm font-bold text-arcade-yellow uppercase tracking-wider mb-1">
                  Pendaftaran melalui Panitia
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Akun peserta pameran dibuat dan diverifikasi secara langsung oleh panitia Pixel To Reality pada saat registrasi pameran.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">🎮</span>
              <div>
                <div className="font-display text-sm font-bold text-arcade-yellow uppercase tracking-wider mb-1">
                  Datang ke Booth Panitia
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Kunjungi booth CS Panitia di area pameran untuk mendaftarkan diri dan mendapatkan akun resmi beserta P2R Coin sebagai modal bermain.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">📧</span>
              <div>
                <div className="font-display text-sm font-bold text-arcade-yellow uppercase tracking-wider mb-1">
                  Butuh Bantuan?
                </div>
                <a
                  href="mailto:rpl@smkn4bdg.sch.id"
                  className="text-arcade-yellow font-display text-sm hover:underline"
                >
                  rpl@smkn4bdg.sch.id
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
            >
              Masuk ke Akun Saya →
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
