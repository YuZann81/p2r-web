"use client";

import React from "react";
import TransparentMotionVideo from "@/components/verification/TransparentMotionVideo";

type SuccessMotionGraphicProps = {
  phase: "enter" | "exit";
  motionVideoSrc?: string;
  onComplete?: () => void;
};

export default function SuccessMotionGraphic({
  phase,
  motionVideoSrc,
  onComplete,
}: SuccessMotionGraphicProps) {
  const isExiting = phase === "exit";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Verifikasi 3-layer berhasil, memutar motion graphic"
      data-motion-phase={phase}
      data-fullscreen-motion="true"
      className={`absolute inset-0 z-20 flex h-full w-full items-center justify-center bg-transparent pointer-events-none select-none ${
        isExiting ? "p2r-motion-exit" : "p2r-stage-enter"
      }`}
    >
      <TransparentMotionVideo src={motionVideoSrc} onFinished={onComplete} />
    </div>
  );
}
