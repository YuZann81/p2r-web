import { fetchGameKaryas } from "@/lib/api/karya";
import { fetchGameLeaderboard } from "@/lib/api/leaderboard";
import type { LeaderboardEntry } from "@/lib/api/types/leaderboard";

export type LeaderboardData = {
  mode: "live" | "empty";
  entries: LeaderboardEntry[];
};

export type GetLeaderboardOptions = {
  gameSlugs?: string[];
};

export const LEADERBOARD_CACHE_TTL_MS = 30_000;

let cachedLeaderboard: {
  data: LeaderboardData;
  expiresAt: number;
} | null = null;
let inFlightLeaderboard: Promise<LeaderboardData> | null = null;

export function resetLeaderboardCacheForTests(): void {
  cachedLeaderboard = null;
  inFlightLeaderboard = null;
}

async function resolveSlugs(preloadedSlugs?: string[]): Promise<string[]> {
  if (Array.isArray(preloadedSlugs)) {
    return Array.from(
      new Set(
        preloadedSlugs.filter(
          (slug): slug is string =>
            typeof slug === "string" && slug.trim().length > 0,
        ),
      ),
    );
  }

  const games = await fetchGameKaryas();
  return Array.from(
    new Set(
      games
        .map((game) => game.slug)
        .filter(
          (slug): slug is string =>
            typeof slug === "string" && slug.trim().length > 0,
        ),
    ),
  );
}

async function loadLeaderboardFromApi(
  preloadedSlugs?: string[],
): Promise<LeaderboardData> {
  try {
    const slugs = await resolveSlugs(preloadedSlugs);

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

export async function getLeaderboardData(
  options?: GetLeaderboardOptions,
): Promise<LeaderboardData> {
  const now = Date.now();
  if (cachedLeaderboard && now < cachedLeaderboard.expiresAt) {
    return cachedLeaderboard.data;
  }

  if (inFlightLeaderboard) {
    return inFlightLeaderboard;
  }

  const request = loadLeaderboardFromApi(options?.gameSlugs)
    .then((data) => {
      cachedLeaderboard = {
        data,
        expiresAt: Date.now() + LEADERBOARD_CACHE_TTL_MS,
      };
      return data;
    })
    .finally(() => {
      inFlightLeaderboard = null;
    });

  inFlightLeaderboard = request;
  return request;
}
