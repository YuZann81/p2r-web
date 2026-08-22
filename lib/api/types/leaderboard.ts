export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  gameName: string;
  score: number;
};

export type KaryaLeaderboardEntry = {
  rank: number;
  karyaTitle: string;
  category: string;
  votesCount: number;
  slug: string;
};
