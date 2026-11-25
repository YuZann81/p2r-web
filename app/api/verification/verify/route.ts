import { validateAndConsumeChallenge } from "@/lib/verification/server-token";

export async function POST(request: Request) {
  let body: { challengeToken?: unknown; completedDurationsMs?: unknown } = {};
  try {
    body = (await request.json()) as {
      challengeToken?: unknown;
      completedDurationsMs?: unknown;
    };
  } catch {
    return Response.json(
      { success: false, message: "Format payload JSON tidak valid." },
      { status: 400 },
    );
  }

  if (typeof body.challengeToken !== "string") {
    return Response.json(
      { success: false, message: "challengeToken wajib disertakan." },
      { status: 400 },
    );
  }

  const outcome = validateAndConsumeChallenge({
    challengeToken: body.challengeToken,
    completedDurationsMs: body.completedDurationsMs,
  });

  if (!outcome.ok) {
    return Response.json(
      { success: false, message: outcome.message },
      { status: outcome.status },
    );
  }

  return Response.json({
    success: true,
    data: outcome.result,
  });
}
