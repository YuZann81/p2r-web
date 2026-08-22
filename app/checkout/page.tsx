import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout — Pixels to Reality",
  description:
    "Alur pemesanan dan checkout resmi merchandise Pixel To Reality.",
};

export default function CheckoutPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="w-full max-w-5xl">
        <header className="mb-10 text-center">
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-4xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            CHECKOUT PESANAN
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Selesaikan pemesanan merchandise resmi dan verifikasi metode pembayaran.
          </p>
        </header>

        <section
          aria-label="Checkout Flow Skeleton"
          className="rounded-xl border-2 border-dashed border-arcade-yellow/40 bg-black/20 p-8 text-center backdrop-blur-xs md:p-16"
        >
          <div className="mx-auto max-w-md space-y-4">
            <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-sm tracking-wide text-arcade-yellow">
              Phase 1 — Route Skeleton
            </span>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Checkout &amp; Payment Flow
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              Struktur route siap untuk integrasi ringkasan keranjang, form data pembeli, pilihan metode pembayaran (QRIS/Transfer/Tunai), dan upload bukti bayar pada phase berikutnya.
            </p>
          </div>
        </section>
      </div>

      <footer className="mt-12 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
