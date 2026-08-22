"use client";

import React from "react";
import ExploreButton from "@/components/ExploreButton";
import { HERO_CONTENT } from "@/lib/content";

type HeroProps = {
  onExplore?: () => void;
};

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section
      aria-label="Pameran Pixel To Reality"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-24 md:py-32"
    >
      {/* Subtle Pixel Grid Depth Layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(var(--arcade-yellow) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Subtle Geometric Pixel Accent Layers */}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-arcade-purple/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-arcade-yellow/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Clean Dominant Content Container */}
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        {/* Main Exhibition Heading */}
        <h1 className="font-display text-3xl leading-tight text-white [text-shadow:3px_4px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">
            {HERO_CONTENT.heading}
          </span>
        </h1>

        {/* Subheading Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-pretty text-white/90 sm:mt-8 sm:text-lg md:text-xl">
          {HERO_CONTENT.subheading}
        </p>

        {/* Primary Call-to-Action */}
        <div className="mt-8 sm:mt-10">
          <ExploreButton onExplore={onExplore} />
        </div>
      </div>
    </section>
  );
}
