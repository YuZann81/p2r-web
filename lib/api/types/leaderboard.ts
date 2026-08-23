export type LeaderboardEntry = {
  rank: number;
  player_name?: string;
  playerName: string;
  final_score?: number;
  score: number;
  game_name?: string;
  gameName: string;
  game_slug?: string;
  game?: {
    slug?: string;
    name?: string;
  };
  played_at?: string | null;
};

export type KaryaLeaderboardEntry = {
  rank: number;
  karyaTitle: string;
  title?: string;
  category: string;
  votesCount: number;
  votes_count?: number;
  slug: string;
  karya?: {
    slug?: string;
    title?: string;
    category?: string;
  };
};
