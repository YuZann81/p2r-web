"use client";

import Link from "next/link";
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
    <Link
      href="/karya"
      role="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-xl bg-[#FFD447] px-8 py-3.5 font-display text-xl font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#68D5E8] cursor-pointer"
    >
      {HERO_CONTENT.ctaLabel}
    </Link>
  );
}
