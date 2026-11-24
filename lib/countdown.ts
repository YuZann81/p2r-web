export const EXHIBITION_LAUNCH_ISO = "2026-11-26T08:00:00+07:00";
export const EXHIBITION_LAUNCH_LABEL = "26 November 2026 · 08:00 WIB (Asia/Jakarta)";

export type CountdownStatus = "counting" | "started" | "invalid";

export type CountdownState = {
  status: CountdownStatus;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

const ZERO_COUNTDOWN = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalMs: 0,
} as const;

/**
 * Deterministically calculates remaining time against an absolute ISO-8601
 * timestamp with explicit offset (default: 2026-11-26T08:00:00+07:00 WIB),
 * independent of the visitor's local device timezone.
 */
export function calculateCountdown(
  nowMs: number,
  targetIso: string = EXHIBITION_LAUNCH_ISO,
): CountdownState {
  const targetMs = Date.parse(targetIso);

  if (!Number.isFinite(targetMs) || !Number.isFinite(nowMs)) {
    return { status: "invalid", ...ZERO_COUNTDOWN };
  }

  const diffMs = targetMs - nowMs;
  if (diffMs <= 0) {
    return { status: "started", ...ZERO_COUNTDOWN };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    status: "counting",
    days,
    hours,
    minutes,
    seconds,
    totalMs: diffMs,
  };
}

export function padCountdownUnit(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}
