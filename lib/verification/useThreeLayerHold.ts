"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_LAYER_DURATIONS_MS } from "@/lib/verification/config";
import type {
  LayerStatus,
  VerificationChallenge,
  VerificationResult,
} from "@/lib/verification/types";

export type UseThreeLayerHoldOptions = {
  /** Durasi per layer dalam ms (fleksibel, tidak dikunci di UI). */
  layerDurationsMs?: readonly number[];
  /** Dipanggil ketika semua layer selesai & backend menyetujui verifikasi. */
  onVerified?: (result: VerificationResult) => void;
  /** Endpoint API challenge & verifikasi. */
  verifyEndpoint?: string;
  challengeEndpoint?: string;
};

function getNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function createInitialStatuses(count: number): LayerStatus[] {
  return Array.from({ length: count }, (_, idx) => (idx === 0 ? "idle" : "locked"));
}

function createZeroArray(count: number): number[] {
  return Array.from({ length: count }, () => 0);
}

export function useThreeLayerHold({
  layerDurationsMs = DEFAULT_LAYER_DURATIONS_MS,
  onVerified,
  challengeEndpoint = "/api/verification/challenge",
  verifyEndpoint = "/api/verification/verify",
}: UseThreeLayerHoldOptions = {}) {
  const initialDurations =
    layerDurationsMs.length > 0 ? [...layerDurationsMs] : [...DEFAULT_LAYER_DURATIONS_MS];

  const [durations, setDurations] = useState<number[]>(initialDurations);
  const [statuses, setStatuses] = useState<LayerStatus[]>(() =>
    createInitialStatuses(initialDurations.length),
  );
  const [progress, setProgress] = useState<number[]>(() =>
    createZeroArray(initialDurations.length),
  );
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(0);
  const [isVerifyingBackend, setIsVerifyingBackend] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [earlyReleaseNotice, setEarlyReleaseNotice] = useState<string | null>(null);

  const challengeRef = useRef<VerificationChallenge | null>(null);
  const completedDurationsRef = useRef<number[]>(createZeroArray(initialDurations.length));
  const statusesRef = useRef<LayerStatus[]>(statuses);
  const activeLayerRef = useRef<number>(activeLayerIndex);
  const durationsRef = useRef<number[]>(durations);

  const rafIdRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const activeInputSourceRef = useRef<"pointer" | "keyboard" | null>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const onVerifiedRef = useRef(onVerified);

  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  useEffect(() => {
    statusesRef.current = statuses;
  }, [statuses]);

  useEffect(() => {
    activeLayerRef.current = activeLayerIndex;
  }, [activeLayerIndex]);

  const durationsKey = initialDurations.join(",");
  useEffect(() => {
    const next = [...initialDurations];
    durationsRef.current = next;
    setDurations(next);
  }, [durationsKey]);

  const requestChallenge = useCallback(async () => {
    try {
      const response = await fetch(challengeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layerDurationsMs: durationsRef.current }),
      });

      if (!response.ok) return;
      const json = (await response.json()) as {
        success?: boolean;
        data?: VerificationChallenge;
      };
      if (json.success && json.data && isMountedRef.current) {
        challengeRef.current = json.data;
        if (
          Array.isArray(json.data.layerDurationsMs) &&
          json.data.layerDurationsMs.length === durationsRef.current.length
        ) {
          const serverDurations = [...json.data.layerDurationsMs];
          durationsRef.current = serverDurations;
          setDurations(serverDurations);
        }
      }
    } catch {
      // Challenge fallback handled safely on verify attempt
    }
  }, [challengeEndpoint]);

  const stopRaf = useCallback(() => {
    if (rafIdRef.current !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  /** Menghentikan hold yang sedang berjalan dan mereset progres layer aktif ke 0 (tanpa menyelesaikan layer). */
  const cancelActiveHold = useCallback(
    (reason?: string) => {
      stopRaf();
      const wasHolding = activeInputSourceRef.current !== null;
      holdStartTimeRef.current = null;
      activePointerIdRef.current = null;
      activeInputSourceRef.current = null;

      if (!wasHolding) return;

      const idx = activeLayerRef.current;
      if (statusesRef.current[idx] === "holding") {
        setProgress((prev) => {
          const next = [...prev];
          next[idx] = 0;
          return next;
        });
        setStatuses((prev) => {
          const next = [...prev];
          if (next[idx] === "holding") {
            next[idx] = "idle";
          }
          return next;
        });
        if (reason) {
          setEarlyReleaseNotice(reason);
        }
      }
    },
    [stopRaf],
  );

  const submitFinalVerification = useCallback(async () => {
    if (isSubmittingRef.current || !isMountedRef.current) return;
    isSubmittingRef.current = true;
    setIsVerifyingBackend(true);
    setErrorMessage(null);

    try {
      if (!challengeRef.current) {
        await requestChallenge();
      }

      const challengeToken = challengeRef.current?.challengeToken;
      if (!challengeToken) {
        throw new Error("Sesi challenge server tidak tersedia. Silakan coba lagi.");
      }

      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken,
          completedDurationsMs: completedDurationsRef.current,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: VerificationResult;
      };

      if (!response.ok || !payload.success || !payload.data?.verified) {
        throw new Error(payload.message || "Validasi server gagal. Silakan ulangi.");
      }

      if (isMountedRef.current) {
        setIsVerified(true);
        onVerifiedRef.current?.(payload.data);
      }
    } catch (error) {
      if (isMountedRef.current) {
        const count = durationsRef.current.length;
        isSubmittingRef.current = false;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memvalidasi verifikasi pada server.",
        );
        completedDurationsRef.current = createZeroArray(count);
        setStatuses(createInitialStatuses(count));
        setProgress(createZeroArray(count));
        setActiveLayerIndex(0);
        challengeRef.current = null;
        void requestChallenge();
      }
    } finally {
      if (isMountedRef.current) {
        setIsVerifyingBackend(false);
      }
    }
  }, [requestChallenge, verifyEndpoint]);

  const completeActiveLayer = useCallback(
    (layerIdx: number, elapsedMs: number) => {
      stopRaf();
      holdStartTimeRef.current = null;
      activePointerIdRef.current = null;
      activeInputSourceRef.current = null;

      completedDurationsRef.current[layerIdx] = Math.round(elapsedMs);

      setProgress((prev) => {
        const next = [...prev];
        next[layerIdx] = 1;
        return next;
      });

      const totalLayers = durationsRef.current.length;
      if (layerIdx < totalLayers - 1) {
        const nextIdx = layerIdx + 1;
        setStatuses((prev) => {
          const next = [...prev];
          next[layerIdx] = "completed";
          next[nextIdx] = "idle";
          return next;
        });
        setActiveLayerIndex(nextIdx);
        setEarlyReleaseNotice(null);
      } else {
        setStatuses(Array.from({ length: totalLayers }, () => "completed"));
        setEarlyReleaseNotice(null);
        void submitFinalVerification();
      }
    },
    [stopRaf, submitFinalVerification],
  );

  const startHold = useCallback(
    (layerIdx: number, source: "pointer" | "keyboard", pointerId?: number) => {
      if (
        isSubmittingRef.current ||
        isVerified ||
        layerIdx !== activeLayerRef.current ||
        statusesRef.current[layerIdx] !== "idle" ||
        activeInputSourceRef.current !== null
      ) {
        return false;
      }

      activeInputSourceRef.current = source;
      activePointerIdRef.current = source === "pointer" ? (pointerId ?? null) : null;
      holdStartTimeRef.current = getNow();
      setErrorMessage(null);
      setEarlyReleaseNotice(null);

      setStatuses((prev) => {
        const next = [...prev];
        next[layerIdx] = "holding";
        return next;
      });

      const step = () => {
        if (
          !isMountedRef.current ||
          holdStartTimeRef.current === null ||
          activeInputSourceRef.current === null
        ) {
          return;
        }

        const elapsed = Math.max(0, getNow() - holdStartTimeRef.current);
        const targetDuration = durationsRef.current[layerIdx] || 1;
        const ratio = Math.min(1, elapsed / targetDuration);

        if (ratio >= 1) {
          completeActiveLayer(layerIdx, elapsed);
          return;
        }

        setProgress((prev) => {
          const next = [...prev];
          next[layerIdx] = ratio;
          return next;
        });

        rafIdRef.current = requestAnimationFrame(step);
      };

      rafIdRef.current = requestAnimationFrame(step);
      return true;
    },
    [completeActiveLayer, isVerified],
  );

  const releaseHold = useCallback(
    (source: "pointer" | "keyboard", pointerId?: number) => {
      if (activeInputSourceRef.current !== source) return;
      if (
        source === "pointer" &&
        activePointerIdRef.current !== null &&
        pointerId !== undefined &&
        activePointerIdRef.current !== pointerId
      ) {
        return;
      }

      cancelActiveHold("verifikasi gagal, silahkan tempelkan tangan anda");
    },
    [cancelActiveHold],
  );

  const resetVerification = useCallback(() => {
    const count = durationsRef.current.length;
    stopRaf();
    holdStartTimeRef.current = null;
    activePointerIdRef.current = null;
    activeInputSourceRef.current = null;
    isSubmittingRef.current = false;
    completedDurationsRef.current = createZeroArray(count);
    challengeRef.current = null;

    setStatuses(createInitialStatuses(count));
    setProgress(createZeroArray(count));
    setActiveLayerIndex(0);
    setIsVerified(false);
    setIsVerifyingBackend(false);
    setErrorMessage(null);
    setEarlyReleaseNotice(null);
    void requestChallenge();
  }, [requestChallenge, stopRaf]);

  useEffect(() => {
    isMountedRef.current = true;
    void requestChallenge();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelActiveHold("Halaman tidak aktif — progres hold dibatalkan.");
      }
    };

    const handleWindowBlur = () => {
      cancelActiveHold("Fokus halaman berpindah — progres hold dibatalkan.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      isMountedRef.current = false;
      stopRaf();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [cancelActiveHold, requestChallenge, stopRaf]);

  return {
    durations,
    statuses,
    progress,
    activeLayerIndex,
    isVerifyingBackend,
    isVerified,
    errorMessage,
    earlyReleaseNotice,
    startHold,
    releaseHold,
    resetVerification,
  };
}
