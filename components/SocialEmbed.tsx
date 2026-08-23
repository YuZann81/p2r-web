"use client";

import React from "react";
import type { FeedItem } from "@/lib/api/types/feed";

type SocialEmbedProps = {
  feed: FeedItem;
  onSelect?: (feed: FeedItem) => void;
};

export function InstagramEmbed({ feed, onSelect }: SocialEmbedProps) {
  const imageUrl = feed.thumbnail_url || feed.image_url || feed.media_url || "/images/game-1.png";
  const displayTitle = feed.title || "Postingan Instagram P2R";
  const displayCaption =
    feed.caption ||
    feed.content ||
    "Dokumentasi dan aktivitas pameran Pixel To Reality di Instagram.";
  const externalLink = feed.original_url || feed.external_url;

  return (
    <article
      aria-label={`Instagram Post: ${displayTitle}`}
      className="group flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-4 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)]"
    >
      <div>
        {/* Instagram Header */}
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            {/* Instagram Pixel/SVG Icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-pink-500/50 bg-pink-500/10 text-pink-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth={2} />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
              </svg>
            </div>
            <div>
              <span className="block font-display text-xs font-bold uppercase tracking-wider text-pink-300">
                INSTAGRAM
              </span>
              <span className="block text-xs font-semibold text-white/80">
                {feed.author_name || "@pixel2reality_smk"}
              </span>
            </div>
          </div>

          {feed.created_at && (
            <time
              dateTime={feed.created_at}
              className="font-mono text-xs text-white/60"
            >
              {new Date(feed.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </time>
          )}
        </div>

        {/* Media Preview */}
        <div className="relative mb-3.5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/60">
          <img
            src={imageUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
          />
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold leading-snug text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)] sm:text-xl">
          {displayTitle}
        </h3>

        {/* Caption */}
        <p className="mt-1.5 line-clamp-3 text-sm font-medium leading-relaxed text-white/85">
          {displayCaption}
        </p>
      </div>

      {/* Footer / Link */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        {feed.likes_count ? (
          <span className="font-mono text-xs font-bold text-white/70">
            {feed.likes_count.toLocaleString("id-ID")} LIKES
          </span>
        ) : (
          <span className="text-xs text-white/50">P2R Media</span>
        )}

        {externalLink ? (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-display text-xs font-bold text-arcade-yellow underline transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
          >
            <span>Lihat di Instagram</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(feed)}
            className="font-display text-xs font-bold text-arcade-yellow underline hover:opacity-80"
          >
            Detail Postingan →
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function TikTokEmbed({ feed, onSelect }: SocialEmbedProps) {
  const imageUrl = feed.thumbnail_url || feed.image_url || feed.media_url || "/images/game-2.png";
  const displayTitle = feed.title || "Cuplikan Video TikTok P2R";
  const displayCaption =
    feed.caption ||
    feed.content ||
    "Video pendek dokumentasi dan gameplay pameran Pixel To Reality.";
  const externalLink = feed.original_url || feed.external_url;

  return (
    <article
      aria-label={`TikTok Video: ${displayTitle}`}
      className="group flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-4 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)]"
    >
      <div>
        {/* TikTok Header */}
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            {/* TikTok Pixel/SVG Icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-400">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.04.87.12V9.4a6.33 6.33 0 0 0-.87-.06A6.34 6.34 0 0 0 3.14 15.7a6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.86-4.48v-6.2a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.93z" />
              </svg>
            </div>
            <div>
              <span className="block font-display text-xs font-bold uppercase tracking-wider text-cyan-300">
                TIKTOK
              </span>
              <span className="block text-xs font-semibold text-white/80">
                {feed.author_name || "@p2r_cyberarcade"}
              </span>
            </div>
          </div>

          {feed.created_at && (
            <time
              dateTime={feed.created_at}
              className="font-mono text-xs text-white/60"
            >
              {new Date(feed.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </time>
          )}
        </div>

        {/* Video Preview Aspect Frame */}
        <div className="relative mb-3.5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/60">
          <img
            src={imageUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
          />
          {/* Subtle Video Preview Tag */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-md border border-white/30 bg-black/70 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow">
              VIDEO PREVIEW
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold leading-snug text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)] sm:text-xl">
          {displayTitle}
        </h3>

        {/* Caption */}
        <p className="mt-1.5 line-clamp-3 text-sm font-medium leading-relaxed text-white/85">
          {displayCaption}
        </p>
      </div>

      {/* Footer / Link */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        {feed.likes_count ? (
          <span className="font-mono text-xs font-bold text-white/70">
            {feed.likes_count.toLocaleString("id-ID")} VIEWS
          </span>
        ) : (
          <span className="text-xs text-white/50">TikTok Video</span>
        )}

        {externalLink ? (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-display text-xs font-bold text-arcade-yellow underline transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
          >
            <span>Buka di TikTok</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(feed)}
            className="font-display text-xs font-bold text-arcade-yellow underline hover:opacity-80"
          >
            Detail Video →
          </button>
        ) : null}
      </div>
    </article>
  );
}
