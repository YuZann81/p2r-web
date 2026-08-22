"use client";

import React from "react";
import type { FeedItem } from "@/lib/api/types/feed";

type UpdateCardProps = {
  feed: FeedItem;
  onSelect?: (feed: FeedItem) => void;
};

function getSourceBadge(source?: string | null): {
  label: string;
  badgeClass: string;
} {
  const normalized = (source || "").toLowerCase().trim();
  switch (normalized) {
    case "announcement":
      return {
        label: "PENGUMUMAN",
        badgeClass: "bg-arcade-yellow/20 text-arcade-yellow border-arcade-yellow/50",
      };
    case "activity":
      return {
        label: "AKTIVITAS",
        badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      };
    case "news":
      return {
        label: "BERITA",
        badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
      };
    default:
      return {
        label: "INFO P2R",
        badgeClass: "bg-arcade-violet/30 text-arcade-yellow border-arcade-violet",
      };
  }
}

export default function UpdateCard({ feed, onSelect }: UpdateCardProps) {
  const sourceInfo = getSourceBadge(feed.source);
  const imageUrl = feed.image_url || feed.media_url || null;
  const displayTitle = feed.title || feed.caption || "Info Resmi Pameran P2R";
  const displayContent =
    feed.content ||
    feed.caption ||
    "Dokumentasi dan informasi resmi pameran Pixel To Reality: The Cyber Arcade.";

  const formattedDate = feed.created_at
    ? new Date(feed.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article
      aria-label={`P2R Update: ${displayTitle}`}
      className="group flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-5 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)]"
    >
      <div>
        {/* Header: Source Badge & Date */}
        <div className="mb-3.5 flex items-center justify-between border-b border-white/10 pb-3">
          <span
            className={`inline-block rounded-md border px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider ${sourceInfo.badgeClass}`}
          >
            {sourceInfo.label}
          </span>
          {formattedDate && (
            <time
              dateTime={feed.created_at || undefined}
              className="font-mono text-xs text-white/60"
            >
              {formattedDate}
            </time>
          )}
        </div>

        {/* Thumbnail Visual (if available) */}
        {imageUrl && (
          <div className="relative mb-3.5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/60">
            <img
              src={imageUrl}
              alt={displayTitle}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-xl font-bold leading-snug text-arcade-yellow transition-colors group-hover:underline [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-2xl">
          {displayTitle}
        </h3>

        {/* Content Excerpt */}
        <p className="mt-2.5 line-clamp-3 text-sm font-medium leading-relaxed text-white/80">
          {displayContent}
        </p>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs font-semibold text-white/60">
          Oleh: <strong className="text-white/90">{feed.author_name || "Panitia P2R"}</strong>
        </span>

        {feed.external_url ? (
          <a
            href={feed.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-display text-xs font-bold text-arcade-yellow underline transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
          >
            <span>Buka Tautan</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(feed)}
            className="font-display text-xs font-bold text-arcade-yellow underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
          >
            Baca Selengkapnya →
          </button>
        ) : null}
      </div>
    </article>
  );
}
