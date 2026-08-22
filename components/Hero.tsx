"use client";

import ExploreButton from "@/components/ExploreButton";
import { HERO_CONTENT } from "@/lib/content";

type HeroProps = {
  onExplore?: () => void;
};

export default function Hero({ onExplore }: HeroProps) {
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
          <ExploreButton onExplore={onExplore} />
        </div>
      </div>
    </section>
  );
}
