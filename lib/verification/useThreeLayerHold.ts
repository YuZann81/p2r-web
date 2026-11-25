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
  layerDurationsMs?: readonly [number, number, number];
  /** Dipanggil ketika 3 layer selesai & backend menyetujui verifikasi. */
  onVerified?: (result: VerificationResult) => void;
  /** Nonaktifkan challenge API hanya untuk kebutuhan unit test lokal terisolasi bila diinginkan. */
  verifyEndpoint?: string;
  challengeEndpoint?: string;
};

type LayerStatuses = [LayerStatus, LayerStatus, LayerStatus];
type LayerNumbers = [number, number, number];

function getNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

export function useThreeLayerHold({
  layerDurationsMs = DEFAULT_LAYER_DURATIONS_MS,
  onVerified,
  challengeEndpoint = "/api/verification/challenge",
  verifyEndpoint = "/api/verification/verify",
}: UseThreeLayerHoldOptions = {}) {
  const [durations, setDurations] = useState<LayerNumbers>([
    layerDurationsMs[0],
    layerDurationsMs[1],
    layerDurationsMs[2],
  ]);
  const [statuses, setStatuses] = useState<LayerStatuses>(["idle", "locked", "locked"]);
  const [progress, setProgress] = useState<LayerNumbers>([0, 0, 0]);
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(0);
  const [isVerifyingBackend, setIsVerifyingBackend] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [earlyReleaseNotice, setEarlyReleaseNotice] = useState<string | null>(null);

  const challengeRef = useRef<VerificationChallenge | null>(null);
  const completedDurationsRef = useRef<number[]>([0, 0, 0]);
  const statusesRef = useRef<LayerStatuses>(statuses);
  const activeLayerRef = useRef<number>(activeLayerIndex);
  const durationsRef = useRef<LayerNumbers>(durations);

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

  useEffect(() => {
    const next: LayerNumbers = [
      layerDurationsMs[0],
      layerDurationsMs[1],
      layerDurationsMs[2],
    ];
    durationsRef.current = next;
    setDurations(next);
  }, [layerDurationsMs[0], layerDurationsMs[1], layerDurationsMs[2]]);

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
        if (Array.isArray(json.data.layerDurationsMs)) {
          const serverDurations: LayerNumbers = [
            json.data.layerDurationsMs[0],
            json.data.layerDurationsMs[1],
            json.data.layerDurationsMs[2],
          ];
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
          const next: LayerNumbers = [prev[0], prev[1], prev[2]];
          next[idx] = 0;
          return next;
        });
        setStatuses((prev) => {
          const next: LayerStatuses = [prev[0], prev[1], prev[2]];
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
      // Ensure challenge exists before verifying
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
        isSubmittingRef.current = false;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memvalidasi verifikasi pada server.",
        );
        // Reset back to Layer 1 with fresh challenge on server rejection
        completedDurationsRef.current = [0, 0, 0];
        setStatuses(["idle", "locked", "locked"]);
        setProgress([0, 0, 0]);
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
        const next: LayerNumbers = [prev[0], prev[1], prev[2]];
        next[layerIdx] = 1;
        return next;
      });

      if (layerIdx < 2) {
        const nextIdx = layerIdx + 1;
        setStatuses((prev) => {
          const next: LayerStatuses = [prev[0], prev[1], prev[2]];
          next[layerIdx] = "completed";
          next[nextIdx] = "idle";
          return next;
        });
        setActiveLayerIndex(nextIdx);
        setEarlyReleaseNotice(null);
      } else {
        setStatuses(["completed", "completed", "completed"]);
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
        const next: LayerStatuses = [prev[0], prev[1], prev[2]];
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
          const next: LayerNumbers = [prev[0], prev[1], prev[2]];
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
    stopRaf();
    holdStartTimeRef.current = null;
    activePointerIdRef.current = null;
    activeInputSourceRef.current = null;
    isSubmittingRef.current = false;
    completedDurationsRef.current = [0, 0, 0];
    challengeRef.current = null;

    setStatuses(["idle", "locked", "locked"]);
    setProgress([0, 0, 0]);
    setActiveLayerIndex(0);
    setIsVerified(false);
    setIsVerifyingBackend(false);
    setErrorMessage(null);
    setEarlyReleaseNotice(null);
    void requestChallenge();
  }, [requestChallenge, stopRaf]);

  // Request challenge on mount & clean up on unmount / tab hidden / window blur
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
