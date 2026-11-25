import { apiGet } from "@/lib/api/client";
import type { LeaderboardEntry } from "@/lib/api/types/leaderboard";

export type { LeaderboardEntry } from "@/lib/api/types/leaderboard";

export type RawGameLeaderboardEntry = {
  rank: number;
  player?: { id?: number | string; name?: string } | null;
  score: number;
  data?: Record<string, unknown>;
  submitted_at?: string;
};

export type RawGameLeaderboard = {
  game?: { id: string; slug: string; title: string };
  event?: { id: string; slug: string; name: string } | null;
  direction?: string;
  total_players?: number;
  leaderboard?: RawGameLeaderboardEntry[];
  my_rank?: unknown;
};

/**
 * Fetches live leaderboard entries for a specific game from the production
 * endpoint `GET /api/v1/games/{slug}/leaderboard`.
 */
export async function fetchGameLeaderboard(
  slug: string,
): Promise<LeaderboardEntry[]> {
  try {
    const payload = await apiGet<RawGameLeaderboard>(
      `/games/${encodeURIComponent(slug)}/leaderboard`,
      { silentStatuses: [422] },
    );
    const raw = payload.data;
    if (!raw || !Array.isArray(raw.leaderboard) || raw.leaderboard.length === 0) {
      return [];
    }

    const gameTitle = raw.game?.title || slug;
    return raw.leaderboard.map((entry) => ({
      rank: entry.rank,
      playerName: entry.player?.name?.trim() || `Player #${entry.rank}`,
      gameName: gameTitle,
      score: entry.score,
    }));
  } catch {
    // Games without active leaderboard capability return 422 CAPABILITY_NOT_ENABLED;
    // treat gracefully as no entries for this game.
    return [];
  }
}
