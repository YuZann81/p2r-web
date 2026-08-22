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
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-black/30 p-6 shadow-lg backdrop-blur-xs transition-transform duration-200 hover:-translate-y-1 hover:border-arcade-yellow/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      <div>
        {/* Thumbnail Visual */}
        <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-xl bg-black/40">
          <img
            src={mainImage}
            alt={`${karya.title} thumbnail`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block rounded-full bg-arcade-violet/90 px-3 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow backdrop-blur-sm">
              {categoryLabel}
            </span>
          </div>
          {karya.votes_count > 0 && (
            <div className="absolute top-3 right-3">
              <span className="inline-block rounded-full bg-black/70 px-2.5 py-1 font-display text-xs tracking-wider text-white backdrop-blur-sm">
                ⭐ {karya.votes_count}
              </span>
            </div>
          )}
        </div>

        {/* Title & Creator */}
        <h3 className="font-display text-2xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)]">
          {karya.title}
        </h3>

        {karya.creators && (
          <p className="mt-1 text-xs font-semibold text-white/70">
            Oleh: <span className="text-arcade-yellow/90">{karya.creators}</span>
          </p>
        )}

        {/* Description */}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">
          {karya.description || "Deskripsi karya pameran Pixel To Reality."}
        </p>

        {/* Tech stack pills */}
        {techStackList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techStackList.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/20 bg-white/5 px-2 py-0.5 font-display text-xs text-arcade-yellow/90"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <Link
          href={`/karya/${karya.slug}`}
          className="inline-flex w-full items-center justify-center bg-arcade-yellow py-2.5 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
        >
          Lihat Detail Karya →
        </Link>
      </div>
    </div>
  );
}
