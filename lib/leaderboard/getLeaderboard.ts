import {
  fetchGlobalLeaderboard,
  fetchKaryaLeaderboard,
} from "@/lib/api/leaderboard";
import { LEADERBOARD_ENTRIES, type LeaderboardEntry } from "@/lib/content";
import type { KaryaLeaderboardEntry } from "@/lib/api/types/leaderboard";

export type LeaderboardData = {
  mode: "live" | "preview";
  entries: LeaderboardEntry[];
  karyaRankings?: KaryaLeaderboardEntry[];
};

export async function getLeaderboardData(): Promise<LeaderboardData> {
  try {
    const liveEntries = await fetchGlobalLeaderboard();
    if (liveEntries.length > 0) {
      const karyaRankings = await fetchKaryaLeaderboard();
      return {
        mode: "live",
        entries: liveEntries,
        karyaRankings,
      };
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
