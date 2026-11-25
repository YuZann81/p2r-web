import { ApiError, apiGet } from "@/lib/api/client";
import type {
  GameLeaderboardPayload,
  LeaderboardDirection,
  LeaderboardEntry,
  LeaderboardEventSummary,
  OverallLeaderboardEntry,
  OverallLeaderboardPayload,
} from "@/lib/api/types/leaderboard";

export type {
  GameLeaderboardPayload,
  LeaderboardDirection,
  LeaderboardEntry,
  LeaderboardEventSummary,
  LeaderboardGameOption,
  OverallLeaderboardEntry,
  OverallLeaderboardPayload,
} from "@/lib/api/types/leaderboard";

export type RawLeaderboardPlayer = {
  id?: number | string;
  name?: string;
};

export type RawGameLeaderboardEntry = {
  rank: number;
  player?: RawLeaderboardPlayer | null;
  score: number;
  data?: Record<string, unknown>;
  submitted_at?: string | null;
};

export type RawGameLeaderboard = {
  game?: { id: string; slug: string; title: string } | null;
  event?: LeaderboardEventSummary | null;
  direction?: string;
  total_players?: number;
  leaderboard?: RawGameLeaderboardEntry[];
  my_rank?: RawGameLeaderboardEntry | null;
};

export type RawOverallLeaderboardEntry = {
  rank: number;
  player?: RawLeaderboardPlayer | null;
  total_score: number;
  games_played: number;
  last_submitted_at?: string | null;
};

export type RawOverallLeaderboard = {
  event?: LeaderboardEventSummary | null;
  total_players?: number;
  leaderboard?: RawOverallLeaderboardEntry[];
  my_rank?: RawOverallLeaderboardEntry | null;
};

export type LeaderboardQueryOptions = {
  limit?: number;
  offset?: number;
  token?: string | null;
};

function mapDirection(direction?: string): LeaderboardDirection {
  return direction === "lower_is_better"
    ? "lower_is_better"
    : "higher_is_better";
}

function mapGameEntry(
  entry: RawGameLeaderboardEntry,
  gameTitle: string,
): LeaderboardEntry {
  return {
    rank: entry.rank,
    playerId: entry.player?.id,
    playerName: entry.player?.name?.trim() || `Player #${entry.rank}`,
    gameName: gameTitle,
    score: Number(entry.score ?? 0),
    submittedAt: entry.submitted_at ?? null,
  };
}

function mapOverallEntry(
  entry: RawOverallLeaderboardEntry,
): OverallLeaderboardEntry {
  return {
    rank: entry.rank,
    playerId: entry.player?.id,
    playerName: entry.player?.name?.trim() || `Player #${entry.rank}`,
    totalScore: Number(entry.total_score ?? 0),
    gamesPlayed: Number(entry.games_played ?? 0),
    lastSubmittedAt: entry.last_submitted_at ?? null,
  };
}

/**
 * Fetches live overall accumulated leaderboard from
 * `GET /api/v1/leaderboards/overall`.
 */
export async function fetchOverallLeaderboard(
  options: LeaderboardQueryOptions = {},
): Promise<OverallLeaderboardPayload> {
  const searchParams =
    options.limit !== undefined || options.offset !== undefined
      ? {
          limit: options.limit,
          offset: options.offset,
        }
      : undefined;

  const payload = await apiGet<RawOverallLeaderboard>("/leaderboards/overall", {
    searchParams,
    token: options.token,
  });

  const raw = payload.data;
  const rawEntries = Array.isArray(raw?.leaderboard) ? raw.leaderboard : [];

  return {
    event: raw?.event ?? null,
    totalPlayers: Number(raw?.total_players ?? rawEntries.length),
    entries: rawEntries.map(mapOverallEntry),
    myRank: raw?.my_rank ? mapOverallEntry(raw.my_rank) : null,
  };
}

/**
 * Fetches live leaderboard detail for a specific game from
 * `GET /api/v1/games/{slug}/leaderboard`.
 *
 * Games without leaderboard capability enabled return HTTP 422
 * (`CAPABILITY_NOT_ENABLED`) and are returned with `unavailable: true`.
 */
export async function fetchGameLeaderboardDetail(
  slug: string,
  options: LeaderboardQueryOptions = {},
): Promise<GameLeaderboardPayload> {
  const searchParams =
    options.limit !== undefined || options.offset !== undefined
      ? {
          limit: options.limit,
          offset: options.offset,
        }
      : undefined;

  try {
    const payload = await apiGet<RawGameLeaderboard>(
      `/games/${encodeURIComponent(slug)}/leaderboard`,
      {
        searchParams,
        token: options.token,
        silentStatuses: [422],
      },
    );

    const raw = payload.data;
    const rawEntries = Array.isArray(raw?.leaderboard) ? raw.leaderboard : [];
    const gameTitle = raw?.game?.title || slug;

    return {
      game: raw?.game ?? null,
      event: raw?.event ?? null,
      direction: mapDirection(raw?.direction),
      totalPlayers: Number(raw?.total_players ?? rawEntries.length),
      entries: rawEntries.map((entry) => mapGameEntry(entry, gameTitle)),
      myRank: raw?.my_rank ? mapGameEntry(raw.my_rank, gameTitle) : null,
      unavailable: false,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      return {
        game: null,
        event: null,
        direction: "higher_is_better",
        totalPlayers: 0,
        entries: [],
        myRank: null,
        unavailable: true,
      };
    }
    throw error;
  }
}

/**
 * Fetches live leaderboard entries for a specific game from
 * `GET /api/v1/games/{slug}/leaderboard`.
 */
export async function fetchGameLeaderboard(
  slug: string,
): Promise<LeaderboardEntry[]> {
  try {
    const detail = await fetchGameLeaderboardDetail(slug);
    return detail.entries;
  } catch {
    return [];
  }
}
