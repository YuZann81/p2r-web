import React from "react";
import type { FeedItem } from "@/lib/api/types/feed";

type FeedCardProps = {
  feed: FeedItem;
  onSelect?: (feed: FeedItem) => void;
};

function formatSourceLabel(source?: string | null): {
  label: string;
  badgeClass: string;
} {
  const normalized = (source || "").toLowerCase().trim();

  switch (normalized) {
    case "instagram":
      return {
        label: "📸 Instagram",
        badgeClass: "bg-pink-500/20 text-pink-300 border-pink-500/40",
      };
    case "announcement":
      return {
        label: "📢 Pengumuman",
        badgeClass: "bg-arcade-yellow/20 text-arcade-yellow border-arcade-yellow/40",
      };
    case "activity":
      return {
        label: "🕹️ Aktivitas",
        badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      };
    case "news":
      return {
        label: "📰 Berita",
        badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      };
    default:
      return {
        label: "⚡ Info P2R",
        badgeClass: "bg-arcade-yellow/20 text-arcade-yellow border-arcade-yellow/40",
      };
  }
}

function formatDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export default function FeedCard({ feed, onSelect }: FeedCardProps) {
  const imageUrl = feed.image_url || feed.media_url || null;
  const sourceInfo = formatSourceLabel(feed.source);
  const formattedDate = formatDate(feed.created_at);

  const displayTitle =
    feed.title ||
    (feed.caption
      ? feed.caption.slice(0, 60) + (feed.caption.length > 60 ? "..." : "")
      : "Info Pameran Pixel To Reality");

  const displayContent =
    feed.content ||
    feed.caption ||
    "Dokumentasi dan informasi terbaru dari pameran Pixel To Reality: The Cyber Arcade.";

  return (
    <article
      aria-label={`Feed: ${displayTitle}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-5 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-arcade-yellow/60 hover:shadow-[0_8px_24px_rgba(244,234,42,0.15)]"
    >
      <div>
        {/* Top Header: Badge & Date */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span
            className={`inline-block rounded-full border px-3 py-0.5 font-display text-xs font-semibold uppercase tracking-wider ${sourceInfo.badgeClass}`}
          >
            {sourceInfo.label}
          </span>
          {formattedDate && (
            <time
              dateTime={feed.created_at || undefined}
              className="font-display text-xs text-white/60"
            >
              {formattedDate}
            </time>
          )}
        </div>

        {/* Media Thumbnail */}
        {imageUrl && (
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/60">
            <img
              src={imageUrl}
              alt={displayTitle}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-xl font-bold leading-snug text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)]">
          {displayTitle}
        </h3>

        {/* Content Preview */}
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-white/80">
          {displayContent}
        </p>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        {feed.author_name ? (
          <span className="text-xs font-semibold text-white/60">
            Oleh: <strong className="text-white/90">{feed.author_name}</strong>
          </span>
        ) : (
          <span className="text-xs font-semibold text-white/50">
            P2R Official
          </span>
        )}

        {feed.external_url ? (
          <a
            href={feed.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-display text-xs font-bold text-arcade-yellow underline transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
          >
            Lihat Sumber ↗
          </a>
        ) : onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(feed)}
            className="font-display text-xs font-bold text-arcade-yellow underline transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
          >
            Baca Selengkapnya →
          </button>
        ) : null}
      </div>
    </article>
  );
}
