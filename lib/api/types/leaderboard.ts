export type LeaderboardEventSummary = {
  id: string;
  slug: string;
  name: string;
};

export type LeaderboardDirection = "higher_is_better" | "lower_is_better";

export type LeaderboardGameOption = {
  slug: string;
  title: string;
};

export type LeaderboardEntry = {
  rank: number;
  playerId?: number | string;
  playerName: string;
  gameName: string;
  score: number;
  submittedAt?: string | null;
};

export type OverallLeaderboardEntry = {
  rank: number;
  playerId?: number | string;
  playerName: string;
  totalScore: number;
  gamesPlayed: number;
  lastSubmittedAt?: string | null;
};

export type OverallLeaderboardPayload = {
  event: LeaderboardEventSummary | null;
  totalPlayers: number;
  entries: OverallLeaderboardEntry[];
  myRank: OverallLeaderboardEntry | null;
};

export type GameLeaderboardPayload = {
  game: {
    id: string;
    slug: string;
    title: string;
  } | null;
  event: LeaderboardEventSummary | null;
  direction: LeaderboardDirection;
  totalPlayers: number;
  entries: LeaderboardEntry[];
  myRank: LeaderboardEntry | null;
  unavailable?: boolean;
};

export type KaryaLeaderboardEntry = {
  rank: number;
  karyaTitle: string;
  category: string;
  votesCount: number;
  slug: string;
};
