export type GameSessionResult = {
  session_token: string;
  expires_at: string;
};

export type SubmitScorePayload = {
  session_token: string;
  player_name: string;
  final_score: number;
  meta?: Record<string, unknown>;
  platform?: "web" | "android" | "windows" | "linux" | "macos" | "other";
  game_version?: string;
};

export type ScoreResult = {
  id: string | number;
  player_name: string;
  final_score: number;
  meta?: Record<string, unknown>;
  platform?: "web" | "android" | "windows" | "linux" | "macos" | "other" | null;
  game_version?: string | null;
  game: {
    slug: string;
    name: string;
  };
  played_at: string;
};
