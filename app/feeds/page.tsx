import type { Metadata } from "next";
import Link from "next/link";
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
    <main
      className="flex min-h-screen flex-col items-center justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        {/* Navigation & Header */}
        <header className="mb-10 text-center md:mb-12">
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-4xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            INFO TERKINI &amp; FEEDS
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-pretty text-white/90 sm:text-lg">
            Linimasa postingan, dokumentasi pameran, dan pengumuman resmi seputar Pixel To Reality: The Cyber Arcade.
          </p>
        </header>

        {/* Interactive Stream Component */}
        <FeedsStream initialFeeds={feeds} />

        {/* Footer Navigation */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/merchandise"
            className="inline-flex items-center justify-center border border-white/30 bg-black/30 px-8 py-3 font-display text-lg font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow"
          >
            Lihat Merchandise
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
