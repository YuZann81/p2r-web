import {
  issueVerificationChallenge,
  validateAndConsumeChallenge,
  verifyReceiptToken,
} from "@/lib/verification/server-token";

describe("6-Layer Verification Server Token Security", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-26T01:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("issues default 6 x 2000ms challenge and rejects immediate replay before hold time elapses", () => {
    const challenge = issueVerificationChallenge();
    expect(challenge.layerDurationsMs).toEqual([2000, 2000, 2000, 2000, 2000, 2000]);

    const tooFast = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [2000, 2000, 2000, 2000, 2000, 2000],
    });
    expect(tooFast.ok).toBe(false);
    if (!tooFast.ok) {
      expect(tooFast.status).toBe(400);
    }
  });

  it("validates once real 12s hold duration elapses across 6 layers and blocks double submission", () => {
    const challenge = issueVerificationChallenge([2000, 2000, 2000, 2000, 2000, 2000]);

    jest.advanceTimersByTime(12100);

    const firstAttempt = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [2010, 2015, 2020, 2010, 2025, 2015],
    });

    expect(firstAttempt.ok).toBe(true);
    if (firstAttempt.ok) {
      expect(firstAttempt.result.verified).toBe(true);
      expect(verifyReceiptToken(firstAttempt.result.verificationToken)).toBe(true);
    }

    const replayAttempt = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [2010, 2015, 2020, 2010, 2025, 2015],
    });
    expect(replayAttempt.ok).toBe(false);
    if (!replayAttempt.ok) {
      expect(replayAttempt.status).toBe(409);
    }
  });

  it("rejects tampered tokens and incomplete layer durations", () => {
    const challenge = issueVerificationChallenge([2000, 2000, 2000, 2000, 2000, 2000]);
    jest.advanceTimersByTime(12500);

    const tampered = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken + "tamper",
      completedDurationsMs: [2000, 2000, 2000, 2000, 2000, 2000],
    });
    expect(tampered.ok).toBe(false);

    const shortLayer = validateAndConsumeChallenge({
      challengeToken: challenge.challengeToken,
      completedDurationsMs: [2000, 800, 2000, 2000, 2000, 2000],
    });
    expect(shortLayer.ok).toBe(false);
  });
});
