"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ExploreButton from "@/components/ExploreButton";
import { HERO_CONTENT } from "@/lib/content";

type HeroProps = {
  onExplore?: () => void;
};

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative flex min-h-[calc(100dvh-4.25rem)] w-full flex-col justify-between overflow-hidden px-4 py-8 sm:px-6 md:py-12">
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #9470E8 0%, #39265E 70%, transparent 100%)",
        }}
      />

      {/* Top spacer / Decorative accent row */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-2 sm:px-6">
        <div className="animate-[float-slow_4s_ease-in-out_infinite] flex items-center">
          <Image
            src="/images/retro/coin-pixel.png"
            alt="Pixel Coin"
            width={72}
            height={72}
            className="drop-shadow-[0_4px_8px_rgba(255,212,71,0.3)] w-10 h-10 sm:w-14 sm:h-14 object-contain"
            priority
          />
        </div>

        <div className="animate-[sparkle_2.5s_ease-in-out_infinite] flex items-center">
          <Image
            src="/images/retro/sparkle-star.png"
            alt="Sparkle Star"
            width={64}
            height={64}
            className="drop-shadow-[0_0_12px_rgba(255,212,71,0.5)] w-9 h-9 sm:w-12 sm:h-12 object-contain"
            priority
          />
        </div>
      </div>

      {/* Center: Main Hero Content (Perfect Vertical Centering) */}
      <div className="relative mx-auto my-auto flex max-w-5xl flex-col items-center text-center">
        {/* 3D Pixel Display Title */}
        <div>
          <h1
            className="font-display text-5xl tracking-wider text-[#FFD447] sm:text-7xl md:text-8xl select-none"
            style={{
              textShadow:
                "3px 3px 0px #C37D29, 6px 6px 0px #39265E, 9px 9px 0px #0E0A1A",
            }}
          >
            PIXEL TO REALITY
            <span className="sr-only"> — {HERO_CONTENT.heading}</span>
          </h1>
        </div>

        {/* Subtitle badge - Concise & informative */}
        <div className="mt-5 inline-flex items-center rounded-full border border-[#68D5E8]/30 bg-[#68D5E8]/10 px-4 py-1.5 font-display text-xs tracking-widest text-[#68D5E8] uppercase sm:text-sm">
          The Cyber Arcade &bull; Pameran Karya Siswa RPL
        </div>

        {/* Subheading text */}
        <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-[#FFF5E9]/90 sm:text-lg">
          {HERO_CONTENT.subheading}
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <ExploreButton onExplore={onExplore} />

          <Link
            href="/games"
            className="inline-flex items-center justify-center rounded-xl border-2 border-[#68D5E8] bg-[#39265E]/80 px-7 py-3.5 font-display text-xl text-[#68D5E8] shadow-[4px_4px_0_#0E0A1A] transition-all hover:-translate-y-0.5 hover:bg-[#39265E] hover:text-[#FFF5E9] active:translate-y-0.5 cursor-pointer"
          >
            Mainkan Game Arcade
          </Link>
        </div>
      </div>

      {/* Bottom: Smooth Scroll Cue */}
      <div className="mx-auto flex flex-col items-center justify-center pt-4">
        <a
          href="#information"
          className="group flex flex-col items-center gap-1.5 font-display text-xs tracking-widest uppercase text-[#FFF5E9]/60 transition-colors hover:text-[#FFD447]"
        >
          <span>Eksplorasi Pameran</span>
          <svg
            className="h-4 w-4 animate-bounce text-[#68D5E8] group-hover:text-[#FFD447]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
