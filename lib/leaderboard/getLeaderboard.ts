import { fetchGameKaryas } from "@/lib/api/karya";
import {
  fetchGameLeaderboardDetail,
  fetchOverallLeaderboard,
} from "@/lib/api/leaderboard";
import type {
  GameLeaderboardPayload,
  LeaderboardGameOption,
  OverallLeaderboardPayload,
} from "@/lib/api/types/leaderboard";

export const LEADERBOARD_CACHE_TTL_MS = 30_000;
export const DEFAULT_LEADERBOARD_LIMIT = 100;

export type OverallLeaderboardLoadResult = {
  status: "live" | "empty" | "error";
  data: OverallLeaderboardPayload;
  errorMessage?: string;
};

export type GameLeaderboardLoadResult = {
  status: "live" | "empty" | "unavailable" | "error";
  data: GameLeaderboardPayload;
  errorMessage?: string;
};

export type DualLeaderboardBootstrap = {
  overall: OverallLeaderboardLoadResult;
  games: LeaderboardGameOption[];
};

export type CachedLeaderboardOptions = {
  limit?: number;
  offset?: number;
  token?: string | null;
  forceRefresh?: boolean;
};

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const overallCache = new Map<string, CacheEntry<OverallLeaderboardLoadResult>>();
const overallInFlight = new Map<string, Promise<OverallLeaderboardLoadResult>>();

const gameCache = new Map<string, CacheEntry<GameLeaderboardLoadResult>>();
const gameInFlight = new Map<string, Promise<GameLeaderboardLoadResult>>();

const EMPTY_OVERALL_PAYLOAD: OverallLeaderboardPayload = {
  event: null,
  totalPlayers: 0,
  entries: [],
  myRank: null,
};

const EMPTY_GAME_PAYLOAD: GameLeaderboardPayload = {
  game: null,
  event: null,
  direction: "higher_is_better",
  totalPlayers: 0,
  entries: [],
  myRank: null,
  unavailable: false,
};

function getTokenScopeKey(token?: string | null): string {
  const trimmed = token?.trim();
  if (!trimmed) {
    return "anon";
  }
  return `auth:${trimmed.length}:${trimmed.slice(-8)}`;
}

function buildCacheKey(
  prefix: string,
  options: CachedLeaderboardOptions = {},
): string {
  const limit = options.limit ?? DEFAULT_LEADERBOARD_LIMIT;
  const offset = options.offset ?? 0;
  return `${prefix}:${limit}:${offset}:${getTokenScopeKey(options.token)}`;
}

export function resetLeaderboardCacheForTests(): void {
  overallCache.clear();
  overallInFlight.clear();
  gameCache.clear();
  gameInFlight.clear();
}

export async function getOverallLeaderboardData(
  options: CachedLeaderboardOptions = {},
): Promise<OverallLeaderboardLoadResult> {
  const limit = options.limit ?? DEFAULT_LEADERBOARD_LIMIT;
  const offset = options.offset ?? 0;
  const key = buildCacheKey("overall", { ...options, limit, offset });

  if (options.forceRefresh) {
    overallCache.delete(key);
  } else {
    const cached = overallCache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.value;
    }

    const existingInFlight = overallInFlight.get(key);
    if (existingInFlight) {
      return existingInFlight;
    }
  }

  const request = (async (): Promise<OverallLeaderboardLoadResult> => {
    try {
      const data = await fetchOverallLeaderboard({
        limit,
        offset,
        token: options.token,
      });

      const result: OverallLeaderboardLoadResult = {
        status: data.entries.length > 0 ? "live" : "empty",
        data,
      };

      overallCache.set(key, {
        value: result,
        expiresAt: Date.now() + LEADERBOARD_CACHE_TTL_MS,
      });

      return result;
    } catch (error) {
      console.error("[leaderboard] Failed to load overall leaderboard:", error);
      return {
        status: "error",
        data: EMPTY_OVERALL_PAYLOAD,
        errorMessage:
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : "Gagal memuat klasemen keseluruhan.",
      };
    }
  })().finally(() => {
    overallInFlight.delete(key);
  });

  overallInFlight.set(key, request);
  return request;
}

export async function getGameLeaderboardData(
  slug: string,
  options: CachedLeaderboardOptions = {},
): Promise<GameLeaderboardLoadResult> {
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    return {
      status: "empty",
      data: EMPTY_GAME_PAYLOAD,
    };
  }

  const limit = options.limit ?? DEFAULT_LEADERBOARD_LIMIT;
  const offset = options.offset ?? 0;
  const key = buildCacheKey(`game:${cleanSlug}`, { ...options, limit, offset });

  if (options.forceRefresh) {
    gameCache.delete(key);
  } else {
    const cached = gameCache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.value;
    }

    const existingInFlight = gameInFlight.get(key);
    if (existingInFlight) {
      return existingInFlight;
    }
  }

  const request = (async (): Promise<GameLeaderboardLoadResult> => {
    try {
      const data = await fetchGameLeaderboardDetail(cleanSlug, {
        limit,
        offset,
        token: options.token,
      });

      const status: GameLeaderboardLoadResult["status"] = data.unavailable
        ? "unavailable"
        : data.entries.length > 0
          ? "live"
          : "empty";

      const result: GameLeaderboardLoadResult = {
        status,
        data,
      };

      gameCache.set(key, {
        value: result,
        expiresAt: Date.now() + LEADERBOARD_CACHE_TTL_MS,
      });

      return result;
    } catch (error) {
      console.error(
        `[leaderboard] Failed to load leaderboard for game "${cleanSlug}":`,
        error,
      );
      return {
        status: "error",
        data: EMPTY_GAME_PAYLOAD,
        errorMessage:
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : "Gagal memuat klasemen game.",
      };
    }
  })().finally(() => {
    gameInFlight.delete(key);
  });

  gameInFlight.set(key, request);
  return request;
}

function normalizeGameOptions(
  games: readonly LeaderboardGameOption[],
): LeaderboardGameOption[] {
  const seen = new Set<string>();
  const normalized: LeaderboardGameOption[] = [];

  for (const game of games) {
    const slug = game.slug?.trim();
    if (!slug || seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    normalized.push({
      slug,
      title: game.title?.trim() || slug,
    });
  }

  return normalized;
}

async function resolvePublishedGames(
  preloadedGames?: readonly LeaderboardGameOption[],
): Promise<LeaderboardGameOption[]> {
  if (Array.isArray(preloadedGames)) {
    return normalizeGameOptions(preloadedGames);
  }

  const karyas = await fetchGameKaryas();
  return normalizeGameOptions(
    karyas.map((karya) => ({
      slug: karya.slug,
      title: karya.title,
    })),
  );
}

/**
 * Loads the initial SSR payload for homepage LeaderboardSection and /leaderboard.
 * Fetches only the overall leaderboard + published games list (reusing preloaded
 * games on the homepage) — per-game leaderboards are loaded on demand when selected.
 */
export async function getDualLeaderboardBootstrap(options?: {
  games?: readonly LeaderboardGameOption[];
  limit?: number;
}): Promise<DualLeaderboardBootstrap> {
  const [overall, games] = await Promise.all([
    getOverallLeaderboardData({ limit: options?.limit ?? DEFAULT_LEADERBOARD_LIMIT }),
    resolvePublishedGames(options?.games),
  ]);

  return {
    overall,
    games,
  };
}
