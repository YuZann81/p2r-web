import React from "react";
import Marquee from "@/components/Marquee";
import PixelDivider from "@/components/PixelDivider";
import RplEmblem from "@/components/RplEmblem";
import { ABOUT_CONTENT, ABOUT_MARQUEE_TEXT } from "@/lib/content";

export default function About() {
  return (
    <section id="about" aria-label="About Software Engineering" className="w-full">
      <Marquee text={ABOUT_MARQUEE_TEXT} />
      <PixelDivider />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <span className="inline-block rounded-md border border-arcade-yellow/40 bg-arcade-yellow/10 px-3 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow mb-3">
            Pameran Digital &amp; Kompetensi RPL
          </span>

          <h2
            id="about-heading"
            className="font-display text-2xl leading-relaxed text-balance text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-3xl md:text-4xl"
          >
            {ABOUT_CONTENT.headingLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-4 max-w-md text-sm font-semibold leading-relaxed text-pretty text-white/90 sm:mt-5 sm:text-base md:text-lg">
            {ABOUT_CONTENT.body}
          </p>

          {/* 3 Exhibition Core Pillars */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="rounded-lg border border-white/20 bg-black/40 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-white">
              Inovasi Software &amp; IoT
            </span>
            <span className="rounded-lg border border-white/20 bg-black/40 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow">
              Game Retro Arcade
            </span>
            <span className="rounded-lg border border-white/20 bg-black/40 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-arcade-green">
              Kompetisi Leaderboard
            </span>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <RplEmblem />
        </div>
      </div>
    </section>
  );
}
