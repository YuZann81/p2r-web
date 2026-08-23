import { apiPost } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types/api-response";
import type { ScoreResult, SubmitScorePayload } from "@/lib/api/types/score";

export type { ScoreResult, SubmitScorePayload } from "@/lib/api/types/score";

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
