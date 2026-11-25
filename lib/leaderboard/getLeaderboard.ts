import { fetchGameKaryas } from "@/lib/api/karya";
import { fetchGameLeaderboard } from "@/lib/api/leaderboard";
import type {
  KaryaLeaderboardEntry,
  LeaderboardEntry,
} from "@/lib/api/types/leaderboard";

export type LeaderboardData = {
  mode: "live" | "empty";
  entries: LeaderboardEntry[];
  karyaRankings?: KaryaLeaderboardEntry[];
};

export async function getLeaderboardData(): Promise<LeaderboardData> {
  try {
    const games = await fetchGameKaryas();
    const slugs = games
      .map((game) => game.slug)
      .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

    if (slugs.length === 0) {
      return { mode: "empty", entries: [] };
    }

    // Query game leaderboards concurrently instead of serial N+1 awaits
    const results = await Promise.all(
      slugs.map((slug) => fetchGameLeaderboard(slug)),
    );
    const liveEntries = results.find((list) => list.length > 0);

    if (liveEntries && liveEntries.length > 0) {
      return {
        mode: "live",
        entries: liveEntries,
      };
    }
  } catch (error) {
    console.error("[leaderboard] Failed to load leaderboard from API:", error);
  }

  return {
    mode: "empty",
    entries: [],
  };
}
