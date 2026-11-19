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
          </header>

          {/* Interactive Stream Component */}
          <FeedsStream initialFeeds={feeds} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
