import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFeeds } from "@/lib/feeds/getFeeds";
import FeedsStream from "@/components/FeedsStream";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Info Terkini & Feeds — Pixels to Reality",
  description:
    "Berita terbaru, linimasa aktivitas, pengumuman, dan dokumentasi terkini dari pameran Pixel To Reality: The Cyber Arcade.",
};

export default async function FeedsPage() {
  const feeds = await getFeeds({ limit: 30 });

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
          {/* Header */}
          <header className="mb-10 text-center md:mb-12">
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
              INFO TERKINI &amp; FEEDS
            </h1>
            <p className="mx-auto mt-3 max-w-2xl font-body text-base text-[#FFF5E9]/85 sm:text-lg">
              Linimasa postingan, dokumentasi pameran, dan pengumuman resmi seputar Pixel To Reality: The Cyber Arcade.
            </p>
          </header>

          {/* Interactive Stream Component */}
          <FeedsStream initialFeeds={feeds} />

          {/* Footer Navigation */}
          <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#FFD447] px-8 py-3.5 font-display text-lg font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A]"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/merchandise"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#39265E] bg-[#211B35] px-8 py-3.5 font-display text-lg font-bold text-[#FFF5E9] transition-all hover:bg-[#39265E]"
            >
              Lihat Merchandise
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
