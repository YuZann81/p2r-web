import React from "react";
import Link from "next/link";
import type { KaryaDetail } from "@/lib/api/types/karya";

type KaryaCardProps = {
  karya: KaryaDetail;
};

const CATEGORY_LABELS: Record<string, string> = {
  game: "Game Arcade",
  website: "Web Innovation",
  software: "Software Engineering",
  hardware_robotics: "IoT & Hardware",
  digital_art: "Digital Art",
};

function resolveMediaUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "url" in value &&
    typeof value.url === "string" &&
    value.url.trim().length > 0
  ) {
    return value.url;
  }

  return null;
}

export default function KaryaCard({ karya }: KaryaCardProps) {
  const mediaUrls = Array.isArray(karya.media_urls)
    ? karya.media_urls
        .map(resolveMediaUrl)
        .filter((url): url is string => url !== null)
    : [];

  const mainImage = mediaUrls[0] || "/images/game-1.png";
  const categoryLabel =
    CATEGORY_LABELS[karya.category] || karya.category.toUpperCase();

  const techStackList = Array.isArray(karya.tech_stack)
    ? karya.tech_stack
        .map((item) =>
          typeof item === "string" ? item : (item as { name?: string })?.name,
        )
        .filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
        .slice(0, 3)
    : [];

  return (
    <article
      aria-label={karya.title}
      className="group flex h-full flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-5 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)]"
    >
      <div>
        {/* Thumbnail Visual */}
        <Link
          href={`/karya/${karya.slug}`}
          aria-label={`Lihat detail ${karya.title}`}
          className="relative mb-4 block aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/60 outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow"
        >
          <img
            src={mainImage}
            alt={`${karya.title} thumbnail`}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
          />
          {/* Category Chip */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-block rounded-md border border-arcade-yellow/50 bg-[#1e1040]/90 px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow">
              {categoryLabel}
            </span>
          </div>

          {/* Vote count badge (No emoji) */}
          {karya.votes_count > 0 && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 rounded-md border border-white/30 bg-black/80 px-2 py-0.5 font-mono text-xs font-bold text-white">
                <span>VOTES:</span>
                <span className="text-arcade-yellow">{karya.votes_count}</span>
              </span>
            </div>
          )}
        </Link>

        {/* Title & Creator */}
        <Link
          href={`/karya/${karya.slug}`}
          className="outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
        >
          <h3 className="font-display text-xl text-arcade-yellow transition-colors group-hover:underline [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-2xl">
            {karya.title}
          </h3>
        </Link>

        {karya.creators && (
          <p className="mt-1 text-xs font-semibold text-white/70">
            Kreator: <span className="text-white">{karya.creators}</span>
          </p>
        )}

        {/* Description */}
        <p className="mt-2.5 line-clamp-2 text-sm font-medium leading-relaxed text-white/80">
          {karya.description || "Deskripsi karya pameran Pixel To Reality."}
        </p>

        {/* Tech Stack Chips */}
        {techStackList.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {techStackList.map((tech) => (
              <span
                key={tech}
                className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-display text-xs font-semibold text-arcade-yellow/90"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <Link
          href={`/karya/${karya.slug}`}
          className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-arcade-yellow px-4 py-2 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span>Lihat Detail Karya</span>
          <span aria-hidden="true" className="ml-1.5 transition-transform duration-150 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
