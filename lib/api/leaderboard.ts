import { apiGet } from "@/lib/api/client";
import type {
  LeaderboardEntry,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

export type {
  LeaderboardEntry,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

type RawLeaderboardEntry = {
  rank: number;
  player_name?: string;
  playerName?: string;
  final_score?: number;
  score?: number;
  game?: {
    slug?: string;
    name?: string;
  };
  gameName?: string;
  game_name?: string;
  played_at?: string | null;
};

type RawKaryaLeaderboardEntry = {
  rank: number;
  karya?: {
    slug?: string;
    title?: string;
    category?: string;
  };
  karyaTitle?: string;
  category?: string;
  votes_count?: number;
  votesCount?: number;
  slug?: string;
};

export async function fetchGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const payload = await apiGet<RawLeaderboardEntry[]>("/leaderboards/global");
    const rawList = Array.isArray(payload.data) ? payload.data : [];
    return rawList.map((entry) => {
      const playerName = entry.player_name || entry.playerName || "Anonymous";
      const gameName = entry.game?.name || entry.gameName || entry.game_name || "Arcade Game";
      const gameSlug = entry.game?.slug || "";
      const score = typeof entry.final_score === "number" ? entry.final_score : (typeof entry.score === "number" ? entry.score : 0);

      return {
        rank: entry.rank,
        playerName,
        player_name: playerName,
        gameName,
        game_name: gameName,
        game_slug: gameSlug,
        game: {
          slug: gameSlug,
          name: gameName,
        },
        score,
        final_score: score,
        played_at: entry.played_at || null,
      };
    });
  } catch (error) {
    console.warn("[p2r-api] Global leaderboard unavailable/empty:", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function fetchKaryaLeaderboard(): Promise<KaryaLeaderboardEntry[]> {
  try {
    const payload = await apiGet<RawKaryaLeaderboardEntry[]>("/leaderboards/karyas");
    const rawList = Array.isArray(payload.data) ? payload.data : [];
    return rawList.map((entry) => {
      const karyaTitle = entry.karya?.title || entry.karyaTitle || "Karya Inovasi";
      const category = entry.karya?.category || entry.category || "Inovasi";
      const slug = entry.karya?.slug || entry.slug || "";
      const votesCount = typeof entry.votes_count === "number" ? entry.votes_count : (typeof entry.votesCount === "number" ? entry.votesCount : 0);

      return {
        rank: entry.rank,
        karyaTitle,
        title: karyaTitle,
        category,
        slug,
        votesCount,
        votes_count: votesCount,
        karya: {
          slug,
          title: karyaTitle,
          category,
        },
      };
    });
  } catch (error) {
    console.warn("[p2r-api] Karya leaderboard unavailable/empty:", error instanceof Error ? error.message : error);
    return [];
  }
}
