import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registrasi — Pixels to Reality",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#211B35] px-4 py-12 text-[#FFF5E9] sm:px-6 md:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-display text-sm tracking-wider text-[#68D5E8] transition-colors hover:text-[#FFD447] md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
        </header>

        <div className="w-full max-w-md rounded-3xl border-2 border-[#39265E] bg-[#171224] p-8 shadow-[8px_8px_0_#0E0A1A] sm:p-10">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-lg bg-[#FFD447]/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-[#FFD447]">
              Registrasi Akun
            </span>
            <h1 className="mt-3 font-display text-3xl text-[#FFD447] sm:text-4xl drop-shadow-[2px_2px_0_#0E0A1A]">
              DAFTAR AKUN
            </h1>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#FFD447]/35 bg-[#211B35] p-5">
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#FFD447]">
                Pendaftaran melalui Panitia
              </h2>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#FFF5E9]/85">
                Akun peserta pameran dibuat dan diverifikasi secara langsung oleh panitia Pixel To Reality pada saat registrasi pameran.
              </p>
            </div>

            <div className="border-t border-[#39265E] pt-4">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#FFD447]">
                Datang ke Booth Panitia
              </h2>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#FFF5E9]/85">
                Kunjungi booth CS Panitia di area pameran untuk mendaftarkan diri dan mendapatkan akun resmi beserta P2R Coin sebagai modal bermain.
              </p>
            </div>

            <div className="border-t border-[#39265E] pt-4">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#FFD447]">
                Butuh Bantuan?
              </h2>
              <a
                href="mailto:rpl@smkn4bdg.sch.id"
                className="mt-1 inline-block font-display text-sm text-[#68D5E8] hover:text-[#FFD447] hover:underline"
              >
                rpl@smkn4bdg.sch.id
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#FFD447] px-8 py-3.5 font-display text-base font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:bg-[#FFE500] hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Masuk ke Akun Saya →
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-[#FFF5E9]/50">
        Pixel To Reality: The Cyber Arcade &bull; Rekayasa Perangkat Lunak
      </footer>
    </main>
  );
}
