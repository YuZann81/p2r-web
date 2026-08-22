import { apiGet } from "@/lib/api/client";
import type {
  LeaderboardEntry,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

export type {
  LeaderboardEntry,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

export async function fetchGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const payload = await apiGet<LeaderboardEntry[]>("/leaderboards/global");
    return payload.data ?? [];
  } catch (error) {
    console.error("[p2r-api] Failed to fetch global leaderboard:", error);
    return [];
  }
}

export async function fetchKaryaLeaderboard(): Promise<KaryaLeaderboardEntry[]> {
  try {
    const payload = await apiGet<KaryaLeaderboardEntry[]>("/leaderboards/karyas");
    return payload.data ?? [];
  } catch (error) {
    console.error("[p2r-api] Failed to fetch karya leaderboard:", error);
    return [];
  }
}
