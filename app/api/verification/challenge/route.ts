import { issueVerificationChallenge } from "@/lib/verification/server-token";

export async function POST(request: Request) {
  let body: { layerDurationsMs?: unknown } = {};
  try {
    body = (await request.json()) as { layerDurationsMs?: unknown };
  } catch {
    body = {};
  }

  const challenge = issueVerificationChallenge(body.layerDurationsMs);
  return Response.json({
    success: true,
    data: challenge,
  });
}
