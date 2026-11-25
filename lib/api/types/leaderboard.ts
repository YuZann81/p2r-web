export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  gameName: string;
  score: number;
};

export type CoreLeaderboardEntry = {
  rank: number;
  playerName: string;
  gameName: string;
  score: number;
  gamesCount: number;
  gamesBreakdown: { gameName: string; score: number }[];
};

export type GameLeaderboardGroup = {
  gameName: string;
  entries: LeaderboardEntry[];
};

export type KaryaLeaderboardEntry = {
  rank: number;
  karyaTitle: string;
  category: string;
  votesCount: number;
  slug: string;
};
