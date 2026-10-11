"use client";

import Link from "next/link";
import { HERO_CONTENT } from "@/lib/content";

export default function Hero() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="font-display text-2xl leading-relaxed text-balance text-white [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-3xl md:text-4xl md:leading-relaxed">
          {HERO_CONTENT.heading}
        </h1>

        <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-pretty text-white/90 sm:text-lg">
          {HERO_CONTENT.subheading}
        </p>

        <div className="mt-10">
          <Link
            href="/karya"
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            {HERO_CONTENT.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
