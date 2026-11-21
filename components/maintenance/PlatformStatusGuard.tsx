"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MaintenanceExperience from "@/components/maintenance/MaintenanceExperience";
import {
  buildDegradedFallbackStatus,
  parsePlatformStatusPayload,
  type PlatformStatus,
} from "@/lib/maintenance/status";

interface PlatformStatusGuardProps {
  initialStatus: PlatformStatus | null;
  children: React.ReactNode;
}

const DEGRADED_POLL_MS = 10_000;
const SCHEDULED_POLL_MS = 30_000;
const NORMAL_POLL_MS = 30_000;
const CLIENT_PROBE_TIMEOUT_MS = 6_000;

export default function PlatformStatusGuard({
  initialStatus,
  children,
}: PlatformStatusGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<PlatformStatus | null>(initialStatus);
  const [isChecking, setIsChecking] = useState(false);
  const inFlightRef = useRef(false);
  const prevModeRef = useRef<PlatformStatus["mode"] | null>(
    initialStatus?.mode ?? null,
  );

  const checkStatus = useCallback(
    async (manual = false) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (manual) {
        setIsChecking(true);
      }

      const controller = new AbortController();
      const timer = setTimeout(
        () => controller.abort(),
        CLIENT_PROBE_TIMEOUT_MS,
      );

      try {
        const res = await fetch("/api/platform-status", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });

        let parsed: PlatformStatus | null = null;
        if (res.ok) {
          try {
            const json: unknown = await res.json();
            parsed = parsePlatformStatusPayload(json);
          } catch {
            parsed = null;
          }
        }

        // Never treat a generic HTTP 200 or malformed body as proof of API health.
        const nextStatus = parsed ?? buildDegradedFallbackStatus();
        const wasBlocked =
          prevModeRef.current === "system_degraded" ||
          prevModeRef.current === "scheduled_maintenance";

        prevModeRef.current = nextStatus.mode;
        setStatus(nextStatus);

        if (wasBlocked && nextStatus.mode === "normal") {
          router.refresh();
        }
      } catch {
        const fallback = buildDegradedFallbackStatus();
        prevModeRef.current = fallback.mode;
        setStatus(fallback);
      } finally {
        clearTimeout(timer);
        inFlightRef.current = false;
        if (manual) {
          setIsChecking(false);
        }
      }
    },
    [router],
  );

  useEffect(() => {
    const mode = status?.mode ?? "normal";
    const intervalMs =
      mode === "system_degraded"
        ? DEGRADED_POLL_MS
        : mode === "scheduled_maintenance"
          ? SCHEDULED_POLL_MS
          : NORMAL_POLL_MS;

    const timer = setInterval(() => {
      void checkStatus(false);
    }, intervalMs);

    const onFocus = () => {
      void checkStatus(false);
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [status?.mode, checkStatus]);

  if (
    status &&
    (status.mode === "scheduled_maintenance" ||
      status.mode === "system_degraded")
  ) {
    return (
      <MaintenanceExperience
        status={status}
        isChecking={isChecking}
        onRetry={() => void checkStatus(true)}
      />
    );
  }

  return <>{children}</>;
}
