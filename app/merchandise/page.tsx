import type { Metadata } from "next";
import Link from "next/link";
import MerchandiseCatalog from "@/components/MerchandiseCatalog";
import { fetchProducts } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "Katalog Merchandise — Pixels to Reality",
  description:
    "Katalog merchandise resmi dan produk dana usaha Pixel To Reality. Dapatkan merchandise eksklusif pameran!",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MerchandisePage() {
  const products = await fetchProducts();

  return (
    <main
      className="flex min-h-screen flex-col justify-between px-4 py-10 sm:px-6 sm:py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Navigation & Header */}
        <header className="mb-8 text-center sm:mb-12">
          <Link
            href="/"
            className="inline-block rounded-lg px-2 py-1 font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-3xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            KATALOG MERCHANDISE
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-pretty text-white/90 sm:text-base md:text-lg">
            Koleksi merchandise resmi dan produk dana usaha pameran Pixel To Reality. Pesan merchandise favoritmu dan dukung karya siswa RPL!
          </p>

          {/* Fundraising Intro Banner (No emojis) */}
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-arcade-yellow/30 bg-[#1e1040] p-4 text-center sm:p-5">
            <span className="inline-block rounded-md border border-arcade-yellow/40 bg-arcade-yellow/10 px-3 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow">
              Dukungan Dana Usaha P2R
            </span>
            <p className="mt-2 text-xs font-medium text-white/85 sm:text-sm">
              Setiap pembelian merchandise resmi edisi Cyber Arcade dikelola oleh tim dana usaha siswa RPL untuk mendukung penyelenggaraan pameran, perangkat interaktif, dan apresiasi karya siswa.
            </p>
          </div>
        </header>

        {/* Product Discovery & Catalog */}
        <MerchandiseCatalog products={products} />

        {/* Fundraising Context & Transparency Section */}
        <section
          aria-label="Informasi Dana Usaha Pameran"
          className="mt-14 rounded-2xl border-2 border-white/20 bg-[#1e1040] p-6 sm:mt-16 sm:p-8"
        >
          <div className="mb-6 border-b border-white/10 pb-4 text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)] sm:text-3xl">
              Tentang Dana Usaha &amp; Merchandise
            </h2>
            <p className="mt-1 text-sm text-white/80">
              Informasi tujuan dan mekanisme pemesanan merchandise resmi pameran.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-arcade-yellow">
                Cinderamata Resmi
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-white/80 sm:text-sm">
                Produk merchandise dirancang khusus bertema Cyber Arcade sebagai cinderamata resmi pameran Pixel To Reality.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-arcade-yellow">
                Dukungan Karya Siswa
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-white/80 sm:text-sm">
                Penjualan merchandise membantu operasional dan keberlangsungan showcase karya perangkat lunak, game, dan IoT siswa RPL.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-arcade-yellow">
                Pemesanan Langsung
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-white/80 sm:text-sm">
                Pesanan dapat dilakukan secara online melalui website ini dan diambil langsung di booth pameran atau konfirmasi via kasir.
              </p>
            </div>
          </div>
        </section>

        {/* Exploration CTA / Navigation */}
        <section aria-label="Eksplorasi Area Pameran Lainnya" className="mt-12 text-center sm:mt-16">
          <h2 className="font-display text-xl uppercase tracking-wider text-arcade-yellow sm:text-2xl">
            Lanjut Eksplorasi Pameran
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/karya"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
            >
              Jelajahi Galeri Karya →
            </Link>
            <Link
              href="/games"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-white/30 bg-black/40 px-6 py-2.5 font-display text-base font-bold text-white transition-colors hover:bg-white/10 hover:border-arcade-yellow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow"
            >
              Mainkan Game Arcade →
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/20 bg-black/20 px-6 py-2.5 font-display text-base font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </section>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
