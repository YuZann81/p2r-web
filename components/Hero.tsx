"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/content";

type HeroProps = {
  games?: readonly Game[];
};

const LOGO_SRC = "/brand/pixel2reality-logo.png";

function isUsableGameImage(src?: string): boolean {
  if (!src) return false;
  // Exclude broken legacy placeholder paths; allow real remote URLs or verified SVGs
  if (src === "/images/game-1.png" || src === "/images/game-2.png") {
    return false;
  }
  return src.startsWith("http://") || src.startsWith("https://") || src.endsWith(".svg");
}

function CorridorExhibitFrame({
  game,
  side,
}: {
  game?: Game;
  side: "left" | "right";
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const title = game?.name || (side === "left" ? "Cyber Arcade" : "RPL Showcase");
  const slug = game?.id;
  const hasRealImage = Boolean(game && isUsableGameImage(game.image) && !imgFailed);

  const frameContent = (
    <div
      className="group relative flex h-44 w-36 flex-col justify-between overflow-hidden rounded-xl border border-[#5b2be6]/40 bg-[#171224]/90 p-2.5 shadow-[0_18px_36px_rgba(14,10,26,0.75)] backdrop-blur-xs transition-colors hover:border-[#ffe500]/60 xl:h-52 xl:w-44"
      style={{
        transform:
          side === "left"
            ? "perspective(760px) rotateY(24deg) translateZ(-18px)"
            : "perspective(760px) rotateY(-24deg) translateZ(-18px)",
      }}
    >
      {/* Thumbnail or clean cyber-arcade architectural fallback */}
      <div className="relative flex-1 overflow-hidden rounded-lg border border-[#39265E] bg-[#2a1147]/80">
        {hasRealImage && game ? (
          <img
            src={game.image}
            alt={game.imageAlt || title}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center p-2 text-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(91,43,230,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(122,31,176,0.45) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <span
              aria-hidden="true"
              className={`relative mb-1.5 h-2 w-2 ${
                side === "left" ? "bg-[#7ac70c]" : "bg-[#ffe500]"
              }`}
            />
            <span className="relative font-display text-[11px] tracking-widest text-[#B7ABCE] uppercase">
              {side === "left" ? "EXHIBIT 01" : "EXHIBIT 02"}
            </span>
          </div>
        )}
      </div>

      {/* Exhibit caption bar */}
      <div className="mt-2 flex items-center justify-between gap-1.5 px-0.5">
        <span className="truncate font-display text-xs tracking-wide text-[#FFF5E9]/90">
          {title}
        </span>
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 ${
            side === "left" ? "bg-[#7ac70c]" : "bg-[#ffe500]"
          }`}
        />
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link
        href={`/games/${slug}`}
        aria-label={`Lihat karya game ${title}`}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500]"
      >
        {frameContent}
      </Link>
    );
  }

  return frameContent;
}

export default function Hero({ games = [] }: HeroProps) {
  // Prefer games with real thumbnails first so corridor frames showcase actual P2R works
  const [leftExhibit, rightExhibit] = useMemo(() => {
    if (!games || games.length === 0) return [undefined, undefined];
    const withMedia = games.filter((g) => isUsableGameImage(g.image));
    const ordered = [
      ...withMedia,
      ...games.filter((g) => !isUsableGameImage(g.image)),
    ];
    return [ordered[0], ordered[1]];
  }, [games]);

  return (
    <section
      aria-label="Hero Pixel To Reality"
      className="relative flex min-h-[calc(100svh-4.25rem)] w-full items-center overflow-hidden bg-[#211B35] px-4 py-12 sm:px-6 md:py-16 lg:px-10"
    >
      {/* Environmental Atmosphere: Cyber Arcade Amphitheater Lighting & Perspective Floor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Deep purple atmospheric base wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 72% 46%, rgba(42, 17, 71, 0.92) 0%, rgba(33, 27, 53, 0.4) 65%, transparent 100%)",
          }}
        />

        {/* Volumetric purple/violet stage dome behind right exhibition hall */}
        <div
          className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full blur-3xl sm:h-[620px] sm:w-[620px]"
          style={{
            background:
              "radial-gradient(circle, rgba(91, 43, 230, 0.34) 0%, rgba(122, 31, 176, 0.2) 45%, transparent 74%)",
          }}
        />

        {/* Subtle secondary violet rim on far left edge */}
        <div
          className="absolute -left-24 bottom-8 h-[320px] w-[320px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(122, 31, 176, 0.22) 0%, transparent 72%)",
          }}
        />

        {/* Subtle tactile film grain */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,245,233,0.9) 0.75px, transparent 0.75px)",
            backgroundSize: "6px 6px",
          }}
        />

        {/* Perspective exhibition floor grid (receding cleanly into the lower half) */}
        <div
          className="absolute inset-x-0 bottom-0 h-[42%] overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 45%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 45%, black 100%)",
          }}
        >
          <div
            className="mx-auto h-[220%] w-[160%] -translate-x-[18.75%]"
            style={{
              transform: "perspective(580px) rotateX(68deg)",
              transformOrigin: "50% 0%",
              backgroundImage:
                "linear-gradient(to right, rgba(91, 43, 230, 0.24) 1px, transparent 1px), linear-gradient(to bottom, rgba(122, 31, 176, 0.24) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
        </div>
      </div>

      {/* Main Asymmetric 12-Column Exhibition Composition */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* LEFT COLUMN (5 cols): Asymmetric Exhibition Poster Typography & CTA Hierarchy */}
        <div className="order-2 flex flex-col items-start text-left lg:order-1 lg:col-span-5">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2.5 font-body text-[11px] font-semibold tracking-[0.16em] text-[#B7ABCE] uppercase sm:text-xs">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 bg-[#7ac70c]"
            />
            <span>
              SMKN 1 KATAPANG &middot; REKAYASA PERANGKAT LUNAK &middot; EXHIBITION VOL. 01
            </span>
          </p>

          {/* Main Headline */}
          <h1
            className="mt-5 font-display text-6xl leading-[0.94] tracking-wide text-[#FFF5E9] sm:text-7xl xl:text-[5.25rem]"
            style={{
              textShadow: "3px 3px 0px #2a1147, 6px 6px 0px #0E0A1A",
            }}
          >
            <span className="block">FROM PIXEL</span>
            <span className="block">
              TO <span className="text-[#ffe500]">REALITY.</span>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[44ch] font-body text-base leading-relaxed text-[#FFF5E9]/82 sm:text-lg">
            Pameran karya siswa Rekayasa Perangkat Lunak yang menghadirkan game,
            aplikasi, dan inovasi digital interaktif.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#karya-arcade"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#ffe500] px-7 py-3 font-display text-xl font-bold tracking-wide text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
            >
              Jelajahi Karya
            </a>

            <a
              href="#games"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#5b2be6] bg-[#2a1147]/85 px-7 py-3 font-display text-xl tracking-wide text-[#FFF5E9] shadow-[4px_4px_0_#0E0A1A] transition-colors duration-150 hover:border-[#ffe500] hover:text-[#ffe500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500] motion-reduce:transition-none"
            >
              Mainkan Game
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): Cyber Arcade Amphitheater + Exhibition Corridor + Intact 3D P2R Logo */}
        <div className="order-1 relative flex items-center justify-center lg:order-2 lg:col-span-7">
          <div className="relative flex w-full max-w-[660px] flex-col items-center justify-center py-6 sm:py-10">
            {/* Architectural Stepped Pixel Amphitheater Archway (background frame) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 inset-y-2 rounded-3xl border border-[#5b2be6]/30 bg-gradient-to-b from-[#2a1147]/65 via-[#171224]/45 to-transparent sm:inset-x-8"
            >
              {/* Stepped pixel corner brackets (architectural cyber-arcade detail) */}
              <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-[#5b2be6]" />
              <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-[#7a1fb0]" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-[#7ac70c]/75" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#ffe500]/75" />

              {/* Inner amphitheater terraced ledges */}
              <div className="absolute inset-x-8 top-6 bottom-10 rounded-2xl border border-[#7a1fb0]/25" />

              {/* Focused core glow behind the intact 3D logo */}
              <div
                className="absolute left-1/2 top-[44%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-80 sm:w-80"
                style={{
                  background:
                    "radial-gradient(circle, rgba(91, 43, 230, 0.42) 0%, rgba(122, 31, 176, 0.24) 48%, rgba(255, 229, 0, 0.08) 72%, transparent 82%)",
                }}
              />
            </div>

            {/* Exhibition Corridor Stage: Left Perspective Wing + Intact 3D P2R Logo + Right Perspective Wing */}
            <div className="relative z-10 flex w-full items-center justify-center gap-3 sm:gap-5">
              {/* Left Corridor Wing (hidden on narrow mobile for clean focal hierarchy) */}
              <div className="hidden sm:block">
                <CorridorExhibitFrame game={leftExhibit} side="left" />
              </div>

              {/* Center Stage: Intact Official 3D P2R Logo + Stepped Exhibition Plinth */}
              <div className="relative flex flex-col items-center">
                <Image
                  src={LOGO_SRC}
                  alt="Pixel To Reality 3D Logo"
                  width={420}
                  height={420}
                  priority
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 272px, 310px"
                  className="relative z-10 h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72 object-contain select-none drop-shadow-[0_22px_38px_rgba(14,10,26,0.92)]"
                />

                {/* Grounded contact shadow */}
                <div
                  aria-hidden="true"
                  className="-mt-3 h-5 w-44 rounded-full blur-lg sm:w-56"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(14, 10, 26, 0.95) 0%, rgba(91, 43, 230, 0.3) 60%, transparent 82%)",
                  }}
                />

                {/* Stepped Cyber Arcade Exhibition Plinth */}
                <div
                  aria-hidden="true"
                  className="mt-1 flex flex-col items-center"
                >
                  <div className="h-2 w-44 border-t-2 border-[#5b2be6] bg-[#2a1147] sm:w-56" />
                  <div className="flex h-3 w-56 items-center justify-between border-x border-b border-[#39265E] bg-[#171224] px-2 sm:w-68">
                    <span className="h-1 w-4 bg-[#7ac70c]/80" />
                    <span className="h-1 w-10 bg-[#5b2be6]/70" />
                    <span className="h-1 w-4 bg-[#ffe500]/80" />
                  </div>
                </div>
              </div>

              {/* Right Corridor Wing (hidden on narrow mobile for clean focal hierarchy) */}
              <div className="hidden sm:block">
                <CorridorExhibitFrame game={rightExhibit} side="right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
