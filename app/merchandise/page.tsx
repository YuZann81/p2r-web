import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MerchandiseCatalog from "@/components/MerchandiseCatalog";
import { fetchProducts } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "Katalog Merchandise Resmi — Pixels to Reality",
  description:
    "Katalog merchandise resmi dan produk dana usaha Pixel To Reality. Dapatkan merchandise eksklusif pameran!",
};

export default async function MerchandisePage() {
  const products = await fetchProducts();

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <main className="flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
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
              KATALOG MERCHANDISE
            </h1>
            <p className="mx-auto mt-3 max-w-2xl font-body text-base text-[#FFF5E9]/85 sm:text-lg">
              Koleksi merchandise resmi dan produk dana usaha pameran Pixel To Reality. Dapatkan item favoritmu dan dukung talenta muda RPL!
            </p>
          </header>

          <MerchandiseCatalog products={products} />

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
