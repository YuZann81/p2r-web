import { apiGet } from "@/lib/api/client";
import { fetchGameKaryas } from "@/lib/api/karya";
import type { LeaderboardEntry } from "@/lib/api/types/leaderboard";

export type LeaderboardData = {
  mode: "live" | "empty" | "error";
  gameTitle?: string;
  entries: LeaderboardEntry[];
  errorMessage?: string;
};

export type RawGameLeaderboardEntry = {
  rank: number;
  player: { id: number; name: string };
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

async function fetchGameLeaderboard(slug: string): Promise<LeaderboardData> {
  try {
    const payload = await apiGet<RawGameLeaderboard>(`/games/${encodeURIComponent(slug)}/leaderboard`);
    const raw = payload.data;

    if (!raw || !Array.isArray(raw.leaderboard) || raw.leaderboard.length === 0) {
      return {
        mode: "empty",
        gameTitle: raw?.game?.title,
        entries: [],
      };
    }

    const entries: LeaderboardEntry[] = raw.leaderboard.map((entry) => ({
      rank: entry.rank,
      playerName: entry.player?.name ?? `Player #${entry.rank}`,
      gameName: raw.game?.title ?? slug,
      score: entry.score,
    }));

    return {
      mode: "live",
      gameTitle: raw.game?.title,
      entries,
    };
  } catch (error) {
    console.error(`[leaderboard] API fetch failed for ${slug}:`, error);
    return {
      mode: "error",
      entries: [],
      errorMessage: error instanceof Error ? error.message : "Gagal memuat leaderboard.",
    };
  }
}

export async function getLeaderboardData(): Promise<LeaderboardData> {
  // Game slugs come from the karyas API so no specific game is hardcoded.
  const games = await fetchGameKaryas();
  const slugs = games
    .map((game) => game.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

  if (slugs.length === 0) {
    return { mode: "empty", entries: [] };
  }

  let sawError = false;

  for (const slug of slugs) {
    const result = await fetchGameLeaderboard(slug);
    if (result.mode === "live") {
      return result;
    }
    if (result.mode === "error") {
      sawError = true;
    }
  }

  if (sawError) {
    return {
      mode: "error",
      entries: [],
      errorMessage: "Gagal memuat leaderboard game.",
    };
  }

  return { mode: "empty", entries: [] };
}
