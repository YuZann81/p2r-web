import React from "react";
import Link from "next/link";
import GameArtwork from "@/components/GameArtwork";
import type { KaryaDetail } from "@/lib/api/types/karya";

type KaryaDetailViewProps = {
  karya: KaryaDetail;
  backHref: string;
  backLabel: string;
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

const CATEGORY_LABELS: Record<string, string> = {
  game: "Game Arcade",
  website: "Web Innovation",
  software: "Software Engineering",
  hardware_robotics: "IoT & Hardware",
  digital_art: "Digital Art",
};

export default function KaryaDetailView({
  karya,
  backHref,
  backLabel,
}: KaryaDetailViewProps) {
  const mediaUrls = Array.isArray(karya.media_urls)
    ? karya.media_urls
        .map(resolveMediaUrl)
        .filter((url): url is string => url !== null)
    : [];

  const mainImage = mediaUrls[0] || "/images/game-1.png";
  const mainLogo = mediaUrls[1] || mediaUrls[0] || "/images/game-1-logo.png";
  const categoryLabel = CATEGORY_LABELS[karya.category] || karya.category.toUpperCase();

  const techStackList = Array.isArray(karya.tech_stack)
    ? karya.tech_stack
        .map((item) => (typeof item === "string" ? item : (item as { name?: string })?.name))
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return (
    <main
      className="flex min-h-screen flex-col justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Navigation / Header */}
        <header className="mb-10 text-center md:mb-14">
          <Link
            href={backHref}
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            {backLabel}
          </Link>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow sm:text-sm">
              {categoryLabel}
            </span>
            {karya.votes_count > 0 && (
              <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 font-display text-xs tracking-wider text-white sm:text-sm">
                ⭐ {karya.votes_count} Votes
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            {karya.title}
          </h1>

          {karya.creators && (
            <p className="mx-auto mt-2 text-sm font-semibold tracking-wide text-white/80 sm:text-base">
              Karya oleh: <span className="text-arcade-yellow">{karya.creators}</span>
            </p>
          )}
        </header>

        {/* Content Showcase Grid */}
        <section aria-label={`Detail Karya ${karya.title}`} className="w-full">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14">
            
            {/* Sisi Kiri: Artwork */}
            <div className="flex flex-col items-center justify-center">
              <GameArtwork
                image={mainImage}
                imageAlt={`${karya.title} artwork`}
                logo={mainLogo}
                logoAlt={`${karya.title} logo`}
                tilt="left"
              />
            </div>

            {/* Sisi Kanan: Deskripsi, Tech Stack, & Aksi */}
            <div className="flex flex-col gap-6 rounded-2xl border border-white/15 bg-black/30 p-6 backdrop-blur-xs sm:p-8">
              <div>
                <h2 className="font-display text-xl uppercase tracking-wider text-arcade-yellow sm:text-2xl">
                  Tentang Karya
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/90 sm:text-lg">
                  {karya.description || "Deskripsi karya belum tersedia."}
                </p>
              </div>

              {techStackList.length > 0 && (
                <div>
                  <h3 className="font-display text-sm uppercase tracking-wider text-arcade-yellow/90 sm:text-base">
                    Tech Stack &amp; Tools
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {techStackList.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-arcade-yellow/40 bg-arcade-yellow/10 px-3 py-1 font-display text-xs font-semibold text-arcade-yellow sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                {karya.live_url && (
                  <a
                    href={karya.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-arcade-yellow px-6 py-3 text-center font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
                  >
                    Mainkan / Buka Live Demo →
                  </a>
                )}

                {karya.repo_url && (
                  <a
                    href={karya.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border-2 border-white/40 bg-black/40 px-6 py-3 text-center font-display text-base font-bold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow"
                  >
                    Source Code Repo
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Nav Links */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 md:mt-20">
          <Link
            href={backHref}
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            {backLabel.replace("← ", "")}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-white/30 bg-black/30 px-8 py-3 font-display text-lg font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
