import React from "react";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";
import {
  buildCoreAccumulatedLeaderboard,
  buildPerGameLeaderboards,
} from "@/lib/leaderboard/aggregateLeaderboard";
import DualLeaderboardView from "@/components/leaderboard/DualLeaderboardView";

export default async function LeaderboardSection() {
  const { entries, coreEntries, perGameGroups } = await getLeaderboardData();

  const resolvedCoreEntries =
    coreEntries && coreEntries.length > 0
      ? coreEntries
      : buildCoreAccumulatedLeaderboard(entries);
  const resolvedPerGameGroups =
    perGameGroups && perGameGroups.length > 0
      ? perGameGroups
      : buildPerGameLeaderboards(entries);

  return (
    <section
      id="leaderboard"
      className="relative w-full border-t border-[#39265E] py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-10 text-center">
          <h2
            className="font-display text-4xl tracking-widest text-[#FFD447] sm:text-5xl md:text-6xl select-none"
            style={{
              textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
            }}
          >
            LEADERBOARD
          </h2>
        </div>

        <DualLeaderboardView
          compact
          coreEntries={resolvedCoreEntries}
          perGameGroups={resolvedPerGameGroups}
        />
      </div>
    </section>
  );
}
