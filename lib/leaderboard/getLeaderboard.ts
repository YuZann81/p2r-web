import { fetchGameKaryas } from "@/lib/api/karya";
import { fetchGameLeaderboard } from "@/lib/api/leaderboard";
import { LEADERBOARD_ENTRIES, type LeaderboardEntry } from "@/lib/content";
import type { KaryaLeaderboardEntry } from "@/lib/api/types/leaderboard";

export type LeaderboardData = {
  mode: "live" | "preview";
  entries: LeaderboardEntry[];
  karyaRankings?: KaryaLeaderboardEntry[];
};

export async function getLeaderboardData(): Promise<LeaderboardData> {
  try {
    const games = await fetchGameKaryas();
    const slugs = games
      .map((game) => game.slug)
      .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

    for (const slug of slugs) {
      const liveEntries = await fetchGameLeaderboard(slug);
      if (liveEntries.length > 0) {
        return {
          mode: "live",
          entries: liveEntries,
        };
      }
    }
  } catch (error) {
    console.error(
      "[leaderboard] API fetch failed, using fallback preview:",
      error,
    );
  }

  return {
    mode: "preview",
    entries: [...LEADERBOARD_ENTRIES],
  };
}
