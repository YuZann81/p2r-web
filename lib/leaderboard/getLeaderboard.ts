import {
  fetchGlobalLeaderboard,
  fetchKaryaLeaderboard,
} from "@/lib/api/leaderboard";
import { GAME_SCORE_ENTRIES, type LeaderboardEntry } from "@/lib/content";
import type {
  CoreLeaderboardEntry,
  GameLeaderboardGroup,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";
import {
  buildCoreAccumulatedLeaderboard,
  buildPerGameLeaderboards,
} from "@/lib/leaderboard/aggregateLeaderboard";

export type LeaderboardData = {
  mode: "live" | "preview";
  entries: LeaderboardEntry[];
  coreEntries?: CoreLeaderboardEntry[];
  perGameGroups?: GameLeaderboardGroup[];
  karyaRankings?: KaryaLeaderboardEntry[];
};

export async function getLeaderboardData(): Promise<LeaderboardData> {
  try {
    const liveEntries = await fetchGlobalLeaderboard();
    if (liveEntries.length > 0) {
      const karyaRankings = await fetchKaryaLeaderboard();
      const coreEntries = buildCoreAccumulatedLeaderboard(liveEntries);
      const perGameGroups = buildPerGameLeaderboards(liveEntries);
      return {
        mode: "live",
        entries: coreEntries,
        coreEntries,
        perGameGroups,
        karyaRankings,
      };
    }
  } catch (error) {
    console.error(
      "[leaderboard] API fetch failed, using fallback preview:",
      error,
    );
  }

  const coreEntries = buildCoreAccumulatedLeaderboard(GAME_SCORE_ENTRIES);
  const perGameGroups = buildPerGameLeaderboards(GAME_SCORE_ENTRIES);

  return {
    mode: "preview",
    entries: coreEntries,
    coreEntries,
    perGameGroups,
  };
}
