import React from "react";
import Link from "next/link";
import FeedCard from "@/components/FeedCard";
import { getFeeds } from "@/lib/feeds/getFeeds";

export default async function LatestFeedsPreview() {
  const feeds = await getFeeds({ limit: 3 });
  const previewFeeds = feeds.slice(0, 3);

  return (
    <section
      aria-label="Info Terkini & Feeds Pameran"
      className="w-full bg-[#180e3d] py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow sm:text-sm">
            Linimasa &amp; Dokumentasi
          </span>
          <h2 className="mt-3 font-display text-3xl text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-4xl md:text-5xl">
            FEEDS &amp; INFO TERKINI
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-pretty text-white/90 sm:text-lg">
            Ikuti pengumuman turnamen, keseruan booth pameran, dan dokumentasi aktivitas siswa RPL di Pixel To Reality.
          </p>
        </div>

        {/* Feeds Grid or Empty State */}
        {previewFeeds.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {previewFeeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/30 bg-black/20 p-10 text-center backdrop-blur-xs">
            <span className="font-display text-lg text-arcade-yellow">
              Feeds Segera Hadir
            </span>
            <p className="mt-2 text-sm text-white/80">
              Dokumentasi dan postingan aktivitas pameran sedang dipersiapkan.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/feeds"
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Lihat Semua Feed →
          </Link>
        </div>
      </div>
    </section>
  );
}
