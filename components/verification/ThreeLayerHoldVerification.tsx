"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  DEFAULT_LAYER_DEFINITIONS,
  DEFAULT_LAYER_DURATIONS_MS,
  MOTION_GRAPHIC_TIMING_MS,
  STEP_TRANSITION_TIMING_MS,
} from "@/lib/verification/config";
import { useThreeLayerHold } from "@/lib/verification/useThreeLayerHold";
import type {
  LayerDefinition,
  VerificationResult,
  VerificationStage,
} from "@/lib/verification/types";
import FullHandBiometric from "@/components/verification/FullHandBiometric";
import SuccessMotionGraphic from "@/components/verification/SuccessMotionGraphic";
import DocumentationVideoPlayer from "@/components/verification/DocumentationVideoPlayer";

type StepVisualPhase = "interactive" | "success" | "exiting";

type ThreeLayerHoldVerificationProps = {
  layerDurationsMs?: readonly number[];
  layers?: readonly LayerDefinition[];
  motionVideoSrc?: string;
  videoSrc?: string;
  onVerificationComplete?: (result: VerificationResult) => void;
  onStageChange?: (stage: VerificationStage) => void;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ThreeLayerHoldVerification({
  layerDurationsMs = DEFAULT_LAYER_DURATIONS_MS,
  layers = DEFAULT_LAYER_DEFINITIONS,
  motionVideoSrc,
  videoSrc,
  onVerificationComplete,
  onStageChange,
}: ThreeLayerHoldVerificationProps) {
  const [stage, setStage] = useState<VerificationStage>("verifying");
  const [visibleLayerIndex, setVisibleLayerIndex] = useState<number>(0);
  const [stepPhase, setStepPhase] = useState<StepVisualPhase>("interactive");

  const transitionTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pendingVerifiedResultRef = useRef<VerificationResult | null>(null);
  const finalStepExitedRef = useRef<boolean>(false);

  const clearTransitionTimers = useCallback(() => {
    for (const timer of transitionTimersRef.current) {
      clearTimeout(timer);
    }
    transitionTimersRef.current = [];
  }, []);

  const clearStepTimers = useCallback(() => {
    for (const timer of stepTimerRef.current) {
      clearTimeout(timer);
    }
    stepTimerRef.current = [];
  }, []);

  const updateStage = useCallback(
    (nextStage: VerificationStage) => {
      setStage(nextStage);
      onStageChange?.(nextStage);
    },
    [onStageChange],
  );

  useEffect(() => {
    return () => {
      clearTransitionTimers();
      clearStepTimers();
    };
  }, [clearStepTimers, clearTransitionTimers]);

  const advanceToExitAndVideo = useCallback(() => {
    clearTransitionTimers();
    const reduced = prefersReducedMotion();
    const exitDuration = reduced
      ? MOTION_GRAPHIC_TIMING_MS.reducedDisperseExit
      : MOTION_GRAPHIC_TIMING_MS.disperseExit;

    updateStage("motion_exit");
    const videoTimer = setTimeout(() => {
      updateStage("video_ready");
    }, exitDuration);
    transitionTimersRef.current.push(videoTimer);
  }, [clearTransitionTimers, updateStage]);

  const startMotionSequence = useCallback(
    (result: VerificationResult) => {
      onVerificationComplete?.(result);
      clearTransitionTimers();

      const reduced = prefersReducedMotion();
      const maxPlayDuration = reduced
        ? MOTION_GRAPHIC_TIMING_MS.reducedEnterAndPlay
        : MOTION_GRAPHIC_TIMING_MS.enterAndPlay;

      updateStage("motion_enter");

      const fallbackTimer = setTimeout(() => {
        advanceToExitAndVideo();
      }, maxPlayDuration);

      transitionTimersRef.current.push(fallbackTimer);
    },
    [advanceToExitAndVideo, clearTransitionTimers, onVerificationComplete, updateStage],
  );

  const handleBackendVerified = useCallback(
    (result: VerificationResult) => {
      pendingVerifiedResultRef.current = result;
      if (finalStepExitedRef.current) {
        pendingVerifiedResultRef.current = null;
        startMotionSequence(result);
      }
    },
    [startMotionSequence],
  );

  const {
    durations,
    statuses,
    progress,
    isVerifyingBackend,
    errorMessage,
    earlyReleaseNotice,
    startHold,
    releaseHold,
    resetVerification,
  } = useThreeLayerHold({
    layerDurationsMs,
    onVerified: handleBackendVerified,
  });

  const totalLayers = Math.min(layers.length, durations.length) || 6;

  //Sequential 1-by-1 "verification success" -> fade-out exit -> next hand enter
  useEffect(() => {
    if (stage !== "verifying") return;

    const currentStatus = statuses[visibleLayerIndex];
    if (currentStatus !== "completed" || stepPhase !== "interactive") {
      return;
    }

    clearStepTimers();
    setStepPhase("success");

    const reduced = prefersReducedMotion();
    const successHoldMs = reduced
      ? STEP_TRANSITION_TIMING_MS.reducedSuccessHold
      : STEP_TRANSITION_TIMING_MS.successHold;
    const exitFadeMs = reduced
      ? STEP_TRANSITION_TIMING_MS.reducedExitFade
      : STEP_TRANSITION_TIMING_MS.exitFade;

    const exitTimer = setTimeout(() => {
      setStepPhase("exiting");
    }, successHoldMs);

    const advanceTimer = setTimeout(() => {
      if (visibleLayerIndex < totalLayers - 1) {
        setVisibleLayerIndex((prev) => Math.min(totalLayers - 1, prev + 1));
        setStepPhase("interactive");
      } else {
        finalStepExitedRef.current = true;
        if (pendingVerifiedResultRef.current) {
          const result = pendingVerifiedResultRef.current;
          pendingVerifiedResultRef.current = null;
          startMotionSequence(result);
        }
      }
    }, successHoldMs + exitFadeMs);

    stepTimerRef.current.push(exitTimer, advanceTimer);
  }, [clearStepTimers, stage, startMotionSequence, statuses, stepPhase, totalLayers, visibleLayerIndex]);

  // Reset visual step back to Hand 1 if backend validation fails
  useEffect(() => {
    if (errorMessage && statuses[0] === "idle" && visibleLayerIndex !== 0) {
      clearStepTimers();
      pendingVerifiedResultRef.current = null;
      finalStepExitedRef.current = false;
      setVisibleLayerIndex(0);
      setStepPhase("interactive");
    }
  }, [clearStepTimers, errorMessage, statuses, visibleLayerIndex]);

  const handleReplayVerification = () => {
    clearTransitionTimers();
    clearStepTimers();
    pendingVerifiedResultRef.current = null;
    finalStepExitedRef.current = false;
    setVisibleLayerIndex(0);
    setStepPhase("interactive");
    updateStage("verifying");
    resetVerification();
  };

  if (stage === "motion_enter" || stage === "motion_exit") {
    return (
      <SuccessMotionGraphic
        phase={stage === "motion_exit" ? "exit" : "enter"}
        motionVideoSrc={motionVideoSrc}
        onComplete={stage === "motion_enter" ? advanceToExitAndVideo : undefined}
      />
    );
  }

  if (stage === "video_ready") {
    return (
      <DocumentationVideoPlayer
        videoSrc={videoSrc}
        onReplayVerification={handleReplayVerification}
      />
    );
  }

  const activeLayer =
    layers[visibleLayerIndex] ||
    layers[0] || {
      id: visibleLayerIndex + 1,
      title: `Layer ${visibleLayerIndex + 1}`,
      instruction: "",
    };
  const activeStatus = statuses[visibleLayerIndex] ?? "idle";
  const activeProgress = progress[visibleLayerIndex] || 0;
  const activeDurationSec = ((durations[visibleLayerIndex] || 2000) / 1000).toFixed(1);
  const isShowingSuccess = stepPhase === "success" || stepPhase === "exiting";

  const handState: "idle" | "holding" | "completed" | "verifying" = isVerifyingBackend
    ? "verifying"
    : activeStatus === "completed"
      ? "completed"
      : activeStatus === "holding"
        ? "holding"
        : "idle";

  return (
    <div
      aria-label={`Verifikasi Telapak Tangan ${totalLayers}-Layer`}
      className="p2r-stage-enter relative flex w-full flex-col items-center justify-center text-center"
    >
      {/* Subtle Borderless Header & Step Dots floating cleanly in background */}
      <div className="flex flex-col items-center gap-3">
        <span className="font-display text-xs tracking-[0.26em] uppercase text-[#68D5E8]/85">
          VERIFICATION PLAY • TAHAP {visibleLayerIndex + 1} / {totalLayers}
        </span>

        <div
          aria-label={`Tahap ${visibleLayerIndex + 1} dari ${totalLayers}`}
          className="flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalLayers }, (_, idx) => {
            const isCompleted = statuses[idx] === "completed";
            const isCurrent = idx === visibleLayerIndex;
            return (
              <span
                key={idx}
                data-step-dot={idx}
                data-step-state={
                  isCompleted ? "completed" : isCurrent ? "active" : "locked"
                }
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "w-7 bg-[#7AC70C] shadow-[0_0_12px_rgba(122,199,12,0.75)]"
                    : isCurrent
                      ? "w-7 bg-[#FFD447] shadow-[0_0_12px_rgba(255,212,71,0.65)]"
                      : "w-2.5 bg-white/15"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Borderless Background-Blended Full Hand Biometric Stage */}
      <div className="relative mt-4 flex min-h-[290px] sm:min-h-[320px] w-full flex-col items-center justify-center">
        {/* Ambient Background Glow Aura behind Hand */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute h-64 w-64 rounded-full blur-3xl transition-all duration-300 ${
            isShowingSuccess
              ? "bg-[#7AC70C]/25 scale-110"
              : activeStatus === "holding"
                ? "bg-[#68D5E8]/25 scale-110"
                : "bg-[#9470E8]/15 scale-100"
          }`}
        />

        {isShowingSuccess ? (
          <div
            key={`success-${visibleLayerIndex}`}
            role="status"
            aria-live="polite"
            data-testid="step-verification-success"
            data-step-phase={stepPhase}
            className={`relative z-10 flex flex-col items-center justify-center gap-3 ${
              stepPhase === "exiting" ? "p2r-fp-exit" : "p2r-fp-success-in"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <FullHandBiometric progress={1} state="completed" showCheck />
            </div>

            <span className="font-display text-base sm:text-lg tracking-[0.26em] uppercase text-[#7AC70C] drop-shadow-[0_0_16px_rgba(122,199,12,0.6)]">
              verification success
            </span>
          </div>
        ) : (
          <div
            key={`fp-${visibleLayerIndex}`}
            data-testid="active-fingerprint-stage"
            data-layer-index={visibleLayerIndex}
            data-layer-status={activeStatus}
            data-progress={Math.round(activeProgress * 100)}
            className="p2r-fp-enter relative z-10 flex flex-col items-center justify-center"
          >
            <button
              type="button"
              disabled={isVerifyingBackend || activeStatus === "completed"}
              aria-label={`Tahan ${activeLayer.title} selama ${activeDurationSec} detik`}
              title={`Tempel & tahan telapak tangan (${activeDurationSec}s)`}
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => {
                if (e.button !== 0 && e.pointerType === "mouse") return;
                e.preventDefault();
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  // ignore in test environments without pointer capture
                }
                startHold(visibleLayerIndex, "pointer", e.pointerId);
              }}
              onPointerUp={(e) => {
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {
                  // ignore
                }
                releaseHold("pointer", e.pointerId);
              }}
              onPointerCancel={(e) => {
                releaseHold("pointer", e.pointerId);
              }}
              onLostPointerCapture={(e) => {
                releaseHold("pointer", e.pointerId);
              }}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  if (!e.repeat) {
                    startHold(visibleLayerIndex, "keyboard");
                  }
                }
              }}
              onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  releaseHold("keyboard");
                }
              }}
              className={`relative flex items-center justify-center border-0 bg-transparent p-2 touch-none select-none outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-[#68D5E8]/70 focus-visible:rounded-3xl disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer ${
                activeStatus === "holding" ? "scale-[0.97]" : "hover:scale-[1.03]"
              }`}
            >
              {/* Full-Hand Biometric SVG (Borderless, integrated straight into background) */}
              <FullHandBiometric progress={activeProgress} state={handState} />

              {/* Scanning Laser Sweep across palm while holding */}
              {activeStatus === "holding" && (
                <span
                  aria-hidden="true"
                  className="p2r-scan-sweep pointer-events-none absolute left-4 right-4 h-0.5 rounded-full bg-[#68D5E8] shadow-[0_0_14px_#68D5E8]"
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Feedback Notice only when interrupted/error */}
      <div className="mt-2 min-h-[28px] flex items-center justify-center">
        {errorMessage ? (
          <div
            role="alert"
            className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-1.5 font-body text-xs text-red-200"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        ) : earlyReleaseNotice && !isShowingSuccess ? (
          <p
            role="status"
            className="font-body text-xs tracking-wide text-[#F5A05E]"
          >
            {earlyReleaseNotice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
