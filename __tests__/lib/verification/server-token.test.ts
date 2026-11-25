import {
  issueVerificationChallenge,
  validateAndConsumeChallenge,
  verifyReceiptToken,
} from "@/lib/verification/server-token";

describe("3-Layer Verification Server Token Security", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-26T01:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("issues default 3500ms challenge and rejects immediate replay before hold time elapses", () => {
    const challenge = issueVerificationChallenge();
    expect(challenge.layerDurationsMs).toEqual([3500, 3500, 3500]);

    // Immediate verify attempt (0ms elapsed) must be blocked by backend
    const tooFast = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [3500, 3500, 3500],
    });
    expect(tooFast.ok).toBe(false);
    if (!tooFast.ok) {
      expect(tooFast.status).toBe(400);
    }
  });

  it("validates once real hold duration elapses and blocks double submission", () => {
    const challenge = issueVerificationChallenge([3500, 3500, 3500]);

    // Simulate 10.5s passing across 3 layers
    jest.advanceTimersByTime(10550);

    const firstAttempt = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [3510, 3520, 3530],
    });

    expect(firstAttempt.ok).toBe(true);
    if (firstAttempt.ok) {
      expect(firstAttempt.result.verified).toBe(true);
      expect(verifyReceiptToken(firstAttempt.result.verificationToken)).toBe(true);
    }

    // Second submit with same challengeToken must fail (anti-replay / double submit)
    const replayAttempt = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [3510, 3520, 3530],
    });
    expect(replayAttempt.ok).toBe(false);
    if (!replayAttempt.ok) {
      expect(replayAttempt.status).toBe(409);
    }
  });

  it("rejects tampered tokens and incomplete layer durations", () => {
    const challenge = issueVerificationChallenge([3500, 3500, 3500]);
    jest.advanceTimersByTime(11000);

    const tampered = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken + "tamper",
      completedDurationsMs: [3500, 3500, 3500],
    });
    expect(tampered.ok).toBe(false);

    const shortLayer = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [3500, 1200, 3500],
    });
    expect(shortLayer.ok).toBe(false);
  });
});
