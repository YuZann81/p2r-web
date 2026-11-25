import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { DEFAULT_LAYER_DURATIONS_MS } from "@/lib/verification/config";
import type {
  VerificationChallenge,
  VerificationResult,
} from "@/lib/verification/types";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const CLOCK_JITTER_TOLERANCE_MS = 150;
const LAYER_JITTER_TOLERANCE_MS = 60;

type ChallengePayload = {
  nonce: string;
  issuedAt: number;
  expiresAt: number;
  layerDurationsMs: [number, number, number];
};

type VerificationReceiptPayload = {
  nonce: string;
  verifiedAt: number;
  totalHoldMs: number;
};

type GlobalVerificationStore = typeof globalThis & {
  __p2rVerificationSecret?: string;
  __p2rUsedChallengeNonces?: Map<string, number>;
};

function getSigningSecret(): string {
  const envSecret = process.env.VERIFICATION_SECRET?.trim();
  if (envSecret) {
    return envSecret;
  }

  const g = globalThis as GlobalVerificationStore;
  if (!g.__p2rVerificationSecret) {
    g.__p2rVerificationSecret = randomBytes(32).toString("hex");
  }
  return g.__p2rVerificationSecret;
}

function getUsedNoncesStore(): Map<string, number> {
  const g = globalThis as GlobalVerificationStore;
  if (!g.__p2rUsedChallengeNonces) {
    g.__p2rUsedChallengeNonces = new Map<string, number>();
  }

  // Cleanup expired nonces to prevent unbounded memory growth
  const now = Date.now();
  for (const [nonce, expiresAt] of g.__p2rUsedChallengeNonces.entries()) {
    if (expiresAt <= now) {
      g.__p2rUsedChallengeNonces.delete(nonce);
    }
  }

  return g.__p2rUsedChallengeNonces;
}

function signPayload(data: unknown): string {
  const encoded = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  const signature = createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

function verifySignedToken<T>(token: string): T | null {
  if (typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [encoded, providedSig] = parts;
  if (!encoded || !providedSig) {
    return null;
  }

  const expectedSig = createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");

  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (
    providedBuf.length !== expectedBuf.length ||
    !timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const raw = Buffer.from(encoded, "base64url").toString("utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function sanitizeDurations(
  customDurations?: unknown,
): [number, number, number] {
  if (
    Array.isArray(customDurations) &&
    customDurations.length === 3 &&
    customDurations.every(
      (d) => typeof d === "number" && Number.isFinite(d) && d >= 300 && d <= 30000,
    )
  ) {
    return [
      Math.round(customDurations[0]),
      Math.round(customDurations[1]),
      Math.round(customDurations[2]),
    ];
  }

  return [
    DEFAULT_LAYER_DURATIONS_MS[0],
    DEFAULT_LAYER_DURATIONS_MS[1],
    DEFAULT_LAYER_DURATIONS_MS[2],
  ];
}

export function issueVerificationChallenge(
  customDurations?: unknown,
): VerificationChallenge {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + CHALLENGE_TTL_MS;
  const layerDurationsMs = sanitizeDurations(customDurations);
  const nonce = randomBytes(16).toString("hex");

  const payload: ChallengePayload = {
    nonce,
    issuedAt,
    expiresAt,
    layerDurationsMs,
  };

  return {
    challengeToken: signPayload(payload),
    expiresAt,
    layerDurationsMs,
  };
}

export function validateAndConsumeChallenge(input: {
  challengeToken: string;
  completedDurationsMs: unknown;
}):
  | { ok: true; result: VerificationResult }
  | { ok: false; status: number; message: string } {
  const payload = verifySignedToken<ChallengePayload>(input.challengeToken);
  if (!payload || !payload.nonce || !Array.isArray(payload.layerDurationsMs)) {
    return {
      ok: false,
      status: 400,
      message: "Token challenge tidak valid atau rusak.",
    };
  }

  const now = Date.now();
  if (now > payload.expiresAt) {
    return {
      ok: false,
      status: 400,
      message: "Sesi verifikasi telah kedaluwarsa. Silakan ulangi.",
    };
  }

  const usedNonces = getUsedNoncesStore();
  if (usedNonces.has(payload.nonce)) {
    return {
      ok: false,
      status: 409,
      message: "Challenge verifikasi sudah pernah digunakan.",
    };
  }

  const completed = input.completedDurationsMs;
  if (
    !Array.isArray(completed) ||
    completed.length !== 3 ||
    !completed.every((ms) => typeof ms === "number" && Number.isFinite(ms))
  ) {
    return {
      ok: false,
      status: 400,
      message: "Data durasi penyelesaian 3 layer tidak lengkap.",
    };
  }

  for (let i = 0; i < 3; i += 1) {
    const requiredMs = payload.layerDurationsMs[i];
    if (completed[i] < requiredMs - LAYER_JITTER_TOLERANCE_MS) {
      return {
        ok: false,
        status: 400,
        message: `Durasi Layer ${i + 1} belum memenuhi batas minimum.`,
      };
    }
  }

  const totalRequiredMs = payload.layerDurationsMs.reduce((sum, v) => sum + v, 0);
  const actualElapsedMs = now - payload.issuedAt;
  if (actualElapsedMs < totalRequiredMs - CLOCK_JITTER_TOLERANCE_MS) {
    return {
      ok: false,
      status: 400,
      message: "Waktu penyelesaian terlalu cepat. Verifikasi ditolak oleh server.",
    };
  }

  // Mark nonce as consumed to block replay / double submission
  usedNonces.set(payload.nonce, payload.expiresAt);

  const totalHoldMs = Math.round(
    completed.reduce((sum, v) => sum + v, 0),
  );
  const receipt: VerificationReceiptPayload = {
    nonce: payload.nonce,
    verifiedAt: now,
    totalHoldMs,
  };

  return {
    ok: true,
    result: {
      verified: true,
      verificationToken: signPayload(receipt),
      verifiedAt: now,
      totalHoldMs,
    },
  };
}

export function verifyReceiptToken(token: string): boolean {
  const decoded = verifySignedToken<VerificationReceiptPayload>(token);
  return Boolean(decoded && decoded.nonce && typeof decoded.verifiedAt === "number");
}
