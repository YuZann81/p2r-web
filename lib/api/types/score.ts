export type SubmitScorePayload = {
  player_name: string;
  final_score: number;
  meta?: Record<string, unknown>;
};

export type ScoreResult = {
  id: string | number;
  player_name: string;
  final_score: number;
  meta?: Record<string, unknown>;
  game: {
    slug: string;
    name: string;
  };
  played_at: string;
};
