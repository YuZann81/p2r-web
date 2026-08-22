"use client";

import React, { useState, useMemo } from "react";
import type { FeedItem } from "@/lib/api/types/feed";
import FeedCard from "@/components/FeedCard";

type FeedsStreamProps = {
  initialFeeds: FeedItem[];
};

const FILTER_OPTIONS = [
  { key: "all", label: "Semua Feeds" },
  { key: "announcement", label: "Pengumuman" },
  { key: "activity", label: "Aktivitas" },
  { key: "instagram", label: "Instagram" },
  { key: "news", label: "Berita" },
];

export default function FeedsStream({ initialFeeds }: FeedsStreamProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);

  const filteredFeeds = useMemo(() => {
    if (selectedFilter === "all") return initialFeeds;
    return initialFeeds.filter(
      (feed) =>
        (feed.source || "").toLowerCase().trim() === selectedFilter.toLowerCase(),
    );
  }, [initialFeeds, selectedFilter]);

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {FILTER_OPTIONS.map((filter) => {
          const isActive = selectedFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setSelectedFilter(filter.key)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 font-display text-xs sm:text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer ${
                isActive
                  ? "bg-arcade-yellow text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] font-bold scale-105"
                  : "border border-white/25 bg-black/40 text-white/80 hover:border-arcade-yellow/60 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Feed Cards or Empty State */}
      {filteredFeeds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeeds.map((feed) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              onSelect={(item) => setSelectedFeed(item)}
            />
          ))}
        </div>
      ) : (
        <div
          role="status"
          aria-label="Tidak ada feeds"
          className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-arcade-yellow/40 bg-black/30 p-12 text-center backdrop-blur-md md:p-16"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow text-2xl">
            📰
          </div>
          <h2 className="font-display text-2xl font-bold text-arcade-yellow sm:text-3xl">
            Belum Ada Postingan Feeds
          </h2>
          <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-white/80 sm:text-base">
            {selectedFilter === "all"
              ? "Linimasa dokumentasi dan informasi resmi pameran Pixel To Reality sedang dipersiapkan. Pantau terus halaman ini untuk pembaruan!"
              : `Belum ada postingan untuk kategori "${FILTER_OPTIONS.find((f) => f.key === selectedFilter)?.label}". Silakan pilih kategori lain.`}
          </p>
          {selectedFilter !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] hover:-translate-y-0.5"
            >
              Lihat Semua Feeds
            </button>
          )}
        </div>
      )}

      {/* Full Detail Modal */}
      {selectedFeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-[#6712D1]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedFeed(null)}
              aria-label="Tutup detail feed"
              className="absolute right-6 top-6 cursor-pointer font-mono text-xl font-bold text-white hover:text-arcade-yellow"
            >
              ✕
            </button>

            {selectedFeed.image_url && (
              <div className="mb-5 aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60">
                <img
                  src={selectedFeed.image_url}
                  alt={selectedFeed.title || "Detail feed"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <h3 className="font-display text-2xl font-bold text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)] sm:text-3xl">
              {selectedFeed.title || "Info Pameran P2R"}
            </h3>

            {selectedFeed.created_at && (
              <p className="mt-1 font-display text-xs text-white/70">
                Diposting pada {new Date(selectedFeed.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {selectedFeed.author_name ? ` oleh ${selectedFeed.author_name}` : ""}
              </p>
            )}

            <div className="mt-4 max-h-[40vh] overflow-y-auto pr-2 text-sm leading-relaxed text-white/90 sm:text-base">
              {selectedFeed.content || selectedFeed.caption}
            </div>

            {selectedFeed.external_url && (
              <div className="mt-6 border-t border-white/15 pt-4">
                <a
                  href={selectedFeed.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] hover:-translate-y-0.5"
                >
                  Kunjungi Sumber Asli ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
