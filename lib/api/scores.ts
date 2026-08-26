import { apiPost } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types/api-response";
import type {
  GameSessionResult,
  ScoreResult,
  SubmitScorePayload,
} from "@/lib/api/types/score";

export type {
  GameSessionResult,
  ScoreResult,
  SubmitScorePayload,
} from "@/lib/api/types/score";

export async function createGameSession(
  gameSlug: string,
  token?: string | null,
): Promise<ApiResponse<GameSessionResult>> {
  return apiPost<GameSessionResult, Record<string, never>>(
    `/games/${encodeURIComponent(gameSlug)}/sessions`,
    {},
    { token },
  );
}

export async function submitScore(
  gameSlug: string,
  payload: SubmitScorePayload,
  token?: string | null,
): Promise<ApiResponse<ScoreResult>> {
  return apiPost<ScoreResult, SubmitScorePayload>(
    `/games/${encodeURIComponent(gameSlug)}/scores`,
    payload,
    { token },
  );
}
