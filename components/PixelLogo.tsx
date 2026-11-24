"use client";

import { cn } from "@/lib/utils";

/**
 * Pixel cluster brand mark copied from P2R Panel
 * (`worktrees/p2r-panel-dev-leaderboard-monitor/src/components/layout/PixelLogo.tsx`)
 * with its exact Panel palette values so dark Web tokens do not wash out violet/purple cells.
 */
export function PixelLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 -rotate-3 grid-cols-5 grid-rows-5 gap-[2px]",
        className,
      )}
      aria-hidden="true"
    >
      <span className="col-start-2 col-span-2 row-start-1 bg-[#ffe500]" />
      <span className="col-start-4 row-start-1 bg-[#5b2be6]" />
      <span className="col-start-1 col-span-2 row-start-2 bg-[#7ac70c]" />
      <span className="col-start-3 row-start-2 bg-[#ffe500]" />
      <span className="col-start-5 row-start-2 bg-[#5b2be6]" />
      <span className="col-start-1 row-start-3 bg-[#7ac70c]" />
      <span className="col-start-2 col-span-2 row-start-3 bg-[#ffe500]" />
      <span className="col-start-4 row-start-3 bg-[#7a1fb0]" />
      <span className="col-start-2 row-start-4 bg-[#5b2be6]" />
      <span className="col-start-3 col-span-2 row-start-4 bg-[#ffe500]" />
      <span className="col-start-3 row-start-5 bg-[#ffe500]" />
    </span>
  );
}
