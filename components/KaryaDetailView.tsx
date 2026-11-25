import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameArtwork from "@/components/GameArtwork";
import VoteButton from "@/components/VoteButton";
import type { KaryaDetail } from "@/lib/api/types/karya";
import { resolveKaryaMediaUrls } from "@/lib/api/media";

type KaryaDetailViewProps = {
  karya: KaryaDetail;
  backHref: string;
  backLabel: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  game: "Game Arcade",
  website: "Web Innovation",
  software: "Software",
  hardware_robotics: "IoT & Hardware",
  digital_art: "Digital Art",
};

export default function KaryaDetailView({
  karya,
  backHref,
  backLabel,
}: KaryaDetailViewProps) {
  const mediaUrls = resolveKaryaMediaUrls(karya.media_urls);

  const mainImage = mediaUrls[0] ?? "";
  const mainLogo = mediaUrls[1] ?? mediaUrls[0] ?? "";
  const categoryLabel = CATEGORY_LABELS[karya.category] || karya.category.toUpperCase();

  const techStackList = Array.isArray(karya.tech_stack)
    ? karya.tech_stack
        .map((item) => (typeof item === "string" ? item : (item as { name?: string })?.name))
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto w-full max-w-5xl">
          {/* Navigation / Header */}
          <header className="mb-10 text-center md:mb-14">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 font-display text-sm tracking-wider text-[#68D5E8] transition-colors hover:text-[#FFD447] md:text-base"
            >
              {backLabel}
            </Link>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="inline-block rounded-lg border border-[#FFD447]/40 bg-[#FFD447]/15 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-[#FFD447] sm:text-sm">
                {categoryLabel}
              </span>
              {karya.votes_count > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#39265E] px-3.5 py-1 font-display text-xs tracking-wider text-white sm:text-sm">
                  <svg className="h-3.5 w-3.5 fill-[#FFD447]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{karya.votes_count} Votes</span>
                </span>
              )}
            </div>

            <h1
              className="mt-4 font-display text-4xl text-[#FFD447] sm:text-5xl md:text-6xl select-none"
              style={{
                textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
              }}
            >
              {karya.title}
            </h1>

            {karya.creators && (
              <p className="mx-auto mt-2 font-body text-sm text-[#FFF5E9]/80 sm:text-base">
                Karya oleh: <span className="font-semibold text-[#68D5E8]">{karya.creators}</span>
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
              <div className="flex flex-col gap-6 rounded-3xl border-2 border-[#39265E] bg-[#171224] p-6 shadow-[6px_6px_0_#0E0A1A] sm:p-8">
                <div>
                  <h2 className="font-display text-xl tracking-wider text-[#FFD447] sm:text-2xl">
                    Tentang Karya
                  </h2>
                  <p className="mt-3 font-body text-base leading-relaxed text-[#FFF5E9]/90 sm:text-lg">
                    {karya.description || "Deskripsi karya belum tersedia."}
                  </p>
                </div>

                {techStackList.length > 0 && (
                  <div>
                    <h3 className="font-display text-sm tracking-wider uppercase text-[#68D5E8] sm:text-base">
                      Tech Stack &amp; Tools
                    </h3>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {techStackList.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-[#39265E] bg-[#211B35] px-3 py-1 font-display text-xs text-[#FFD447] sm:text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voting Button */}
                <div className="border-t border-white/10 pt-4">
                  <VoteButton
                    slug={karya.slug}
                    initialVotesCount={karya.votes_count || 0}
                    initialIsVoted={karya.is_voted_by_me}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {karya.live_url && (
                    <a
                      href={karya.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-[#FFD447] px-6 py-3 font-display text-base font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A]"
                    >
                      Mainkan / Buka Live Demo
                    </a>
                  )}

                  {karya.repo_url && (
                    <a
                      href={karya.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border-2 border-[#39265E] bg-[#211B35] px-6 py-3 font-display text-base font-bold text-[#FFF5E9] transition-all hover:bg-[#39265E]"
                    >
                      Source Code Repo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
