import {
  fetchGlobalLeaderboard,
  fetchKaryaLeaderboard,
} from "@/lib/api/leaderboard";
import type {
  LeaderboardEntry,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

export type LeaderboardData = {
  mode: "live" | "preview";
  entries: LeaderboardEntry[];
  karyaRankings?: KaryaLeaderboardEntry[];
};

export async function getLeaderboardData(): Promise<LeaderboardData> {
  try {
    const liveEntries = await fetchGlobalLeaderboard();
    const karyaRankings = await fetchKaryaLeaderboard();

    return {
      mode: "live",
      entries: Array.isArray(liveEntries) ? liveEntries : [],
      karyaRankings: Array.isArray(karyaRankings) ? karyaRankings : [],
    };
  } catch (error) {
    console.error("[p2r-api] Failed to load leaderboard data from API:", error);
    return {
      mode: "live",
      entries: [],
      karyaRankings: [],
    };
  }
}
