import { apiGet } from "@/lib/api/client";
import { getCurrentUser, type User } from "@/lib/api/auth";
import { fetchGameKaryas } from "@/lib/api/karya";
import type { RawGameLeaderboard } from "@/lib/api/leaderboard";

export type WalletTransaction = {
  id: string | number;
  type: string;
  amount: number;
  description?: string | null;
  reason?: string | null;
  created_at?: string | null;
};

export type WalletData = {
  wallet_id: string | number;
  balance: number;
  transactions: WalletTransaction[];
};

export type RedemptionRecord = {
  id: string | number;
  quantity: number;
  status: string;
  total_coins?: number;
  created_at?: string | null;
  merchandise?: {
    id: string | number;
    name: string;
    slug: string;
    coin_price?: number;
  } | null;
};

export type PlayerGameRecord = {
  gameSlug: string;
  gameTitle: string;
  rank: number | null;
  score: number;
  playedAt: string | null;
  totalPlayers: number;
};

export type PlayerProfileData = {
  user: User | null;
  coinBalance: number;
  walletTransactions: WalletTransaction[];
  redemptions: RedemptionRecord[];
  gameRecords: PlayerGameRecord[];
  activeLeaderboardGamesCount: number;
  summary: {
    gamesRecorded: number;
    totalAccumulatedScore: number;
    bestScore: number | null;
    bestRank: number | null;
  };
};

type RawMyRank = {
  rank?: number;
  score?: number;
  submitted_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

type RawPaginatedRedemptions = {
  data?: RedemptionRecord[];
};

async function fetchPlayerWallet(token: string): Promise<WalletData | null> {
  try {
    const res = await apiGet<WalletData>("/me/wallet", { token });
    return res.data ?? null;
  } catch {
    return null;
  }
}

async function fetchPlayerRedemptions(
  token: string,
): Promise<RedemptionRecord[]> {
  try {
    const res = await apiGet<RawPaginatedRedemptions | RedemptionRecord[]>(
      "/redemptions",
      { token },
    );
    if (Array.isArray(res.data)) {
      return res.data;
    }
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch {
    return [];
  }
}

async function fetchPlayerGameRank(
  slug: string,
  fallbackTitle: string,
  token: string,
): Promise<{ enabled: boolean; record: PlayerGameRecord | null }> {
  try {
    const res = await apiGet<RawGameLeaderboard>(
      `/games/${encodeURIComponent(slug)}/leaderboard`,
      { token },
    );
    const raw = res.data;
    if (!raw) {
      return { enabled: false, record: null };
    }

    const myRank = raw.my_rank as RawMyRank | null | undefined;
    if (!myRank || typeof myRank.score !== "number") {
      return { enabled: true, record: null };
    }

    return {
      enabled: true,
      record: {
        gameSlug: raw.game?.slug || slug,
        gameTitle: raw.game?.title || fallbackTitle,
        rank: typeof myRank.rank === "number" ? myRank.rank : null,
        score: myRank.score,
        playedAt:
          myRank.submitted_at || myRank.updated_at || myRank.created_at || null,
        totalPlayers:
          typeof raw.total_players === "number" ? raw.total_players : 0,
      },
    };
  } catch {
    // Games without active leaderboard capability return 422 CAPABILITY_NOT_ENABLED
    return { enabled: false, record: null };
  }
}

export async function fetchPlayerProfileData(
  token: string,
): Promise<PlayerProfileData> {
  const [meResult, wallet, redemptions, games] = await Promise.all([
    getCurrentUser(token).catch(() => null),
    fetchPlayerWallet(token),
    fetchPlayerRedemptions(token),
    fetchGameKaryas(50).catch(() => []),
  ]);

  const user = meResult?.data ?? null;

  const rankChecks = await Promise.all(
    games
      .filter((g) => typeof g.slug === "string" && g.slug.length > 0)
      .map((g) => fetchPlayerGameRank(g.slug, g.title, token)),
  );

  const activeLeaderboardGamesCount = rankChecks.filter((r) => r.enabled).length;
  const gameRecords = rankChecks
    .map((r) => r.record)
    .filter((r): r is PlayerGameRecord => r !== null)
    .sort((a, b) => b.score - a.score);

  const totalAccumulatedScore = gameRecords.reduce(
    (sum, item) => sum + item.score,
    0,
  );
  const bestScore =
    gameRecords.length > 0
      ? Math.max(...gameRecords.map((item) => item.score))
      : null;
  const ranks = gameRecords
    .map((item) => item.rank)
    .filter((rank): rank is number => typeof rank === "number");
  const bestRank = ranks.length > 0 ? Math.min(...ranks) : null;

  const coinBalance =
    typeof wallet?.balance === "number"
      ? wallet.balance
      : typeof user?.wallet?.balance === "number"
        ? user.wallet.balance
        : 0;

  return {
    user,
    coinBalance,
    walletTransactions: Array.isArray(wallet?.transactions)
      ? wallet.transactions
      : [],
    redemptions,
    gameRecords,
    activeLeaderboardGamesCount,
    summary: {
      gamesRecorded: gameRecords.length,
      totalAccumulatedScore,
      bestScore,
      bestRank,
    },
  };
}
