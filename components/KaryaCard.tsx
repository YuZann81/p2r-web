import React from "react";
import Link from "next/link";
import type { KaryaDetail } from "@/lib/api/types/karya";

type KaryaCardProps = {
  karya: KaryaDetail;
};

const CATEGORY_STYLES: Record<string, { label: string; badge: string }> = {
  game: {
    label: "Game Arcade",
    badge: "border-[#FFD447]/50 bg-[#FFD447]/20 text-[#FFD447]",
  },
  website: {
    label: "Web Innovation",
    badge: "border-[#68D5E8]/50 bg-[#68D5E8]/20 text-[#68D5E8]",
  },
  software: {
    label: "Software",
    badge: "border-[#F276A5]/50 bg-[#F276A5]/20 text-[#F276A5]",
  },
  hardware_robotics: {
    label: "IoT & Hardware",
    badge: "border-[#02FD0C]/50 bg-[#02FD0C]/20 text-[#02FD0C]",
  },
  digital_art: {
    label: "Digital Art",
    badge: "border-[#9470E8]/50 bg-[#9470E8]/20 text-[#9470E8]",
  },
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
  const catStyle = CATEGORY_STYLES[karya.category] || {
    label: karya.category.toUpperCase(),
    badge: "border-white/30 bg-white/10 text-white",
  };

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
    <div className="flex h-full flex-col justify-between rounded-2xl border-2 border-[#39265E] bg-[#211B35] p-5 shadow-[4px_4px_0_#0E0A1A] transition-all duration-200 hover:-translate-y-1 hover:border-[#FFD447]/60 hover:shadow-[6px_6px_0_#0E0A1A]">
      <div>
        {/* Thumbnail Visual */}
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[#171224]">
          <img
            src={mainImage}
            alt={`${karya.title} thumbnail`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`inline-block rounded-lg border px-2.5 py-1 font-display text-xs tracking-wider backdrop-blur-xs ${catStyle.badge}`}
            >
              {catStyle.label}
            </span>
          </div>
          {karya.votes_count > 0 && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#0E0A1A]/85 px-2.5 py-1 font-display text-xs text-[#FFD447] backdrop-blur-xs">
                <svg className="h-3 w-3 fill-[#FFD447]" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{karya.votes_count}</span>
              </span>
            </div>
          )}
        </div>

        {/* Title & Creator */}
        <h3 className="font-display text-2xl text-[#FFD447] drop-shadow-[1px_1px_0_#0E0A1A]">
          {karya.title}
        </h3>

        {karya.creators && (
          <p className="mt-1 font-body text-xs text-[#FFF5E9]/75">
            Oleh: <span className="text-[#68D5E8] font-medium">{karya.creators}</span>
          </p>
        )}

        {/* Description */}
        <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-[#FFF5E9]/85">
          {karya.description || "Inovasi karya pameran Pixel To Reality."}
        </p>

        {/* Tech stack pills */}
        {techStackList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techStackList.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[#39265E] bg-[#171224] px-2 py-0.5 font-display text-xs text-[#68D5E8]"
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
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#FFD447] py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[2px_2px_0_#B8960A] transition-all hover:bg-[#FFE500] hover:shadow-[3px_3px_0_#B8960A] active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Lihat Detail Karya
        </Link>
      </div>
    </div>
  );
}
