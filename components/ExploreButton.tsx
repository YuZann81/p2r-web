"use client";

import React from "react";
import { HERO_CONTENT } from "@/lib/content";

type ExploreButtonProps = {
  onExplore?: () => void;
};

export default function ExploreButton({ onExplore }: ExploreButtonProps) {
  const handleClick = () => {
    console.log("Hero CTA clicked:", HERO_CONTENT.ctaLabel);
    if (onExplore) {
      onExplore();
    } else {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-arcade-yellow px-8 py-3.5 font-display text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 cursor-pointer"
    >
      <span>{HERO_CONTENT.ctaLabel}</span>
      <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
    </button>
  );
}
