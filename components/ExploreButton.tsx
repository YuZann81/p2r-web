"use client";

import { HERO_CONTENT } from "@/lib/content";

type ExploreButtonProps = {
  onExplore?: () => void;
};

export default function ExploreButton({ onExplore }: ExploreButtonProps) {
  const handleClick = () => {
    console.log("Hero CTA clicked:", HERO_CONTENT.ctaLabel);
    onExplore?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
    >
      {HERO_CONTENT.ctaLabel}
    </button>
  );
}
