"use client";

import React, { useMemo, useState } from "react";
import type { FeedItem } from "@/lib/api/types/feed";
import FeedCard from "@/components/FeedCard";
import { InstagramEmbed, TikTokEmbed } from "@/components/SocialEmbed";

type FeedsStreamProps = {
  initialFeeds: FeedItem[];
};

const FILTER_OPTIONS = [
  { key: "all", label: "Semua Feeds" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "announcement", label: "Pengumuman" },
  { key: "activity", label: "Aktivitas" },
];

export default function FeedsStream({ initialFeeds }: FeedsStreamProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);

  // Filtered feeds by source & search keyword
  const filteredFeeds = useMemo(() => {
    let list = initialFeeds;

    if (selectedFilter !== "all") {
      list = list.filter((feed) => {
        const plat = (feed.platform || feed.source || "custom").toLowerCase().trim();
        if (selectedFilter === "announcement" && (plat === "announcement" || plat === "custom")) {
          return true;
        }
        if (selectedFilter === "activity" && (plat === "activity" || plat === "web")) {
          return true;
        }
        return plat === selectedFilter.toLowerCase();
      });
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (feed) =>
          (feed.title || "").toLowerCase().includes(q) ||
          (feed.caption || "").toLowerCase().includes(q) ||
          (feed.content || "").toLowerCase().includes(q) ||
          (feed.author_name || "").toLowerCase().includes(q),
      );
    }

    return list;
  }, [initialFeeds, selectedFilter, searchQuery]);

  // Featured Social Posts (Top Instagram & Top TikTok)
  const featuredSocial = useMemo(() => {
    const ig = initialFeeds.find(
      (f) => (f.platform || f.source || "").toLowerCase().trim() === "instagram",
    );
    const tt = initialFeeds.find(
      (f) => (f.platform || f.source || "").toLowerCase().trim() === "tiktok",
    );
    return { ig, tt };
  }, [initialFeeds]);

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full">
      {/* Featured Social Spotlight (Visible on 'all' view when not searching) */}
      {selectedFilter === "all" && !searchQuery && (featuredSocial.ig || featuredSocial.tt) && (
        <section aria-label="Sorotan Media Sosial P2R" className="mb-12">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="font-display text-sm font-bold uppercase tracking-wider text-arcade-yellow sm:text-base">
              Sorotan Media Sosial Pameran
            </span>
            <span className="font-mono text-xs text-white/60">
              Instagram &amp; TikTok Resmi
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredSocial.ig && (
              <InstagramEmbed
                feed={featuredSocial.ig}
                onSelect={(item) => setSelectedFeed(item)}
              />
            )}
            {featuredSocial.tt && (
              <TikTokEmbed
                feed={featuredSocial.tt}
                onSelect={(item) => setSelectedFeed(item)}
              />
            )}
          </div>
        </section>
      )}

      {/* Discovery Category Filter Buttons */}
      <div
        aria-label="Filter Kategori Feeds"
        className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        {FILTER_OPTIONS.map((filter) => {
          const isActive = selectedFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedFilter(filter.key)}
              className={`rounded-xl px-4 py-2 font-display text-sm font-bold tracking-wider transition-all duration-150 sm:text-base outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-white ${
                isActive
                  ? "bg-arcade-yellow text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] -translate-y-0.5"
                  : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search Input & Result Counter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/50">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari postingan, topik, atau penulis..."
            aria-label="Cari feeds dan pengumuman"
            className="w-full rounded-xl border border-white/20 bg-black/40 py-2.5 pl-10 pr-10 text-sm font-medium text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleResetSearch}
              aria-label="Hapus pencarian"
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/50 hover:text-white"
            >
              <span className="font-display text-sm">✕</span>
            </button>
          )}
        </div>

        <div className="font-display text-sm tracking-wider uppercase text-arcade-yellow">
          Menampilkan {filteredFeeds.length} dari {initialFeeds.length} Feeds
        </div>
      </div>

      {/* Activity Feed Grid or Empty State */}
      {filteredFeeds.length > 0 ? (
        <section
          aria-label="Linimasa Feeds dan Publikasi"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8"
        >
          {filteredFeeds.map((feed) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              onSelect={(item) => setSelectedFeed(item)}
            />
          ))}
        </section>
      ) : (
        <div
          role="status"
          aria-label="Tidak ada feeds"
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-10 text-center sm:p-14"
        >
          <h2 className="font-display text-xl text-arcade-yellow sm:text-2xl">
            Belum ada aktivitas terbaru.
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            {searchQuery
              ? `Tidak ditemukan postingan dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.`
              : selectedFilter === "all"
                ? "Linimasa dokumentasi dan informasi resmi pameran Pixel To Reality sedang dipersiapkan oleh panitia."
                : `Belum ada postingan untuk kategori "${FILTER_OPTIONS.find((f) => f.key === selectedFilter)?.label}". Silakan pilih kategori lain.`}
          </p>
          {(selectedFilter !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5"
            >
              Lihat Semua Feeds
            </button>
          )}
        </div>
      )}

      {/* Clean Detail Reading Modal */}
      {selectedFeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-white/20 bg-[#1e1040] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedFeed(null)}
              aria-label="Tutup detail feed"
              className="absolute right-6 top-6 cursor-pointer font-mono text-xl font-bold text-white hover:text-arcade-yellow"
            >
              ✕
            </button>

            {(selectedFeed.thumbnail_url || selectedFeed.image_url) && (
              <div className="mb-5 aspect-video w-full overflow-hidden rounded-xl bg-black/60">
                <img
                  src={selectedFeed.thumbnail_url || selectedFeed.image_url || undefined}
                  alt={selectedFeed.title || "Detail feed"}
                  className="h-full w-full object-cover [image-rendering:pixelated]"
                />
              </div>
            )}

            <h3 className="font-display text-2xl font-bold text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-3xl">
              {selectedFeed.title || "Info Pameran P2R"}
            </h3>

            {selectedFeed.created_at && (
              <p className="mt-1 font-mono text-xs text-white/70">
                Diposting pada{" "}
                {new Date(selectedFeed.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {selectedFeed.author_name ? ` oleh ${selectedFeed.author_name}` : ""}
              </p>
            )}

            <div className="mt-4 max-h-[40vh] overflow-y-auto pr-2 text-sm leading-relaxed text-white/90 sm:text-base">
              {selectedFeed.content || selectedFeed.caption || selectedFeed.title}
            </div>

            {(selectedFeed.original_url || selectedFeed.external_url) && (
              <div className="mt-6 border-t border-white/15 pt-4">
                <a
                  href={selectedFeed.original_url || selectedFeed.external_url || undefined}
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
