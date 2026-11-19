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
              KATALOG MERCHANDISE
            </h1>
          </header>

          <MerchandiseCatalog products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
