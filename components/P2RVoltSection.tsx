"use client";

import React, { useEffect, useState } from "react";
import {
  DEFAULT_COUNTDOWN_SECONDS,
  EXHIBITION_LAUNCH_META,
} from "@/lib/verification/config";
import type { VerificationStage } from "@/lib/verification/types";
import ThreeLayerHoldVerification from "@/components/verification/ThreeLayerHoldVerification";

type P2RVoltSectionProps = {
  /** Durasi awal countdown (detik). Mudah dihubungkan ke API countdown nanti. */
  initialSeconds?: number;
  /** Override sumber video motion graphic jika diperlukan. */
  motionVideoSrc?: string;
  /** Override sumber video dokumentasi jika diperlukan. */
  documentationVideoSrc?: string;
  /** Konten pameran lanjutan (Hero, Karya, Games, dll.) yang dibuka setelah verifikasi selesai. */
  unlockedContent?: React.ReactNode;
};

type CountdownUnit = {
  id: string;
  label: string;
  value: string;
  accentColor: string;
};

function padTwoDigits(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

export default function P2RVoltSection({
  initialSeconds = DEFAULT_COUNTDOWN_SECONDS,
  motionVideoSrc,
  documentationVideoSrc,
  unlockedContent,
}: P2RVoltSectionProps) {
  const [timeLeft, setTimeLeft] = useState<number>(Math.max(0, initialSeconds));
  const [verificationStage, setVerificationStage] =
    useState<VerificationStage>("verifying");

  // Optional query override (?countdown=3) untuk memudahkan pengujian langsung sebelum API countdown tersambung
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const override = params.get("countdown");
    if (override !== null) {
      const parsed = Number(override);
      if (Number.isFinite(parsed) && parsed >= 0) {
        setTimeLeft(Math.floor(parsed));
      }
    }
  }, []);

  const isCountdownFinished = timeLeft <= 0;
  const isMotionActive =
    isCountdownFinished &&
    (verificationStage === "motion_enter" || verificationStage === "motion_exit");

  // Countdown berhenti di 00:00 agar memicu 3-Layer Hold Click Verification
  useEffect(() => {
    if (isCountdownFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownFinished]);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const countdownUnits: CountdownUnit[] = [
    { id: "hari", label: "HARI", value: padTwoDigits(days), accentColor: "#9470E8" },
    { id: "jam", label: "JAM", value: padTwoDigits(hours), accentColor: "#F276A5" },
    { id: "menit", label: "MENIT", value: padTwoDigits(minutes), accentColor: "#7AC70C" },
    { id: "detik", label: "DETIK", value: padTwoDigits(seconds), accentColor: "#FFD447" },
  ];

  return (
    <>
      <section
        id="information"
        aria-label="Halaman Launch & Verifikasi P2R"
        className={`relative flex min-h-[calc(100dvh-4.25rem)] w-full flex-col items-center justify-center overflow-hidden border-t border-[#39265E] bg-[#1C172D] ${
          isMotionActive ? "p-0" : "px-4 py-8 sm:px-6"
        }`}
      >
        {/* Ambient Cyber Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(148,112,232,0.18),rgba(33,27,53,0.45)_45%,rgba(14,10,26,0.96)_100%)]"
        />

        <div
          className={`${isMotionActive ? "static" : "relative z-10"} flex w-full flex-col items-center ${
            verificationStage === "video_ready" && isCountdownFinished
              ? "max-w-4xl"
              : "max-w-3xl"
          }`}
        >
          {/* Top Orbital Launch Core shown during Countdown */}
          {!isCountdownFinished && (
            <div aria-hidden="true" className="flex flex-col items-center">
              <span className="h-6 w-px bg-gradient-to-b from-transparent via-[#FFD447]/60 to-[#9470E8]/70" />
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center">
                <div className="h-full w-full rounded-full border border-dashed border-[#9470E8]/45 animate-[spin_22s_linear_infinite]">
                  <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-[2px] bg-[#9470E8]" />
                  <span className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rounded-[2px] bg-[#7AC70C]" />
                  <span className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rounded-[2px] bg-[#FFD447]" />
                </div>

                <div className="absolute flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-full border border-[#39265E] bg-[#120C21] shadow-[0_0_24px_rgba(148,112,232,0.22)]">
                  <span className="mb-1.5 h-2 w-2 rounded-[2px] bg-[#FFD447]" />
                  <span className="font-display text-[10px] sm:text-xs tracking-[0.22em] text-[#FFF5E9]">
                    LAUNCH
                  </span>
                </div>
              </div>
              <span className="h-6 w-px bg-gradient-to-b from-[#9470E8]/60 to-transparent" />
            </div>
          )}

          {/* Main Stage: Framed Card during Countdown, Borderless Clean when Hand-Scanning or Clean Video/Photo Slider */}
          <div
            data-testid="launch-stage-container"
            data-borderless={isCountdownFinished ? "true" : "false"}
            className={
              isCountdownFinished
                ? `${isMotionActive ? "static h-full w-full p-0" : "relative w-full py-2"} text-center`
                : "relative w-full rounded-3xl border border-[#39265E] bg-gradient-to-b from-[#1E1635]/95 to-[#120C21]/98 px-5 py-8 text-center shadow-[0_24px_80px_rgba(8,5,16,0.9)] sm:px-10 sm:py-10"
            }
          >
            {!isCountdownFinished && (
              <>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3.5 left-3.5 h-3.5 w-3.5 rounded-tl-md border-t-2 border-l-2 border-[#9470E8]/55"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3.5 right-3.5 h-3.5 w-3.5 rounded-tr-md border-t-2 border-r-2 border-[#9470E8]/55"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 left-4 h-2 w-2 rounded-[2px] bg-[#7AC70C]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 bottom-4 h-2 w-2 rounded-[2px] bg-[#FFD447]"
                />
              </>
            )}

            {!isCountdownFinished ? (
              <div className="flex flex-col items-center">
                {/* Launch Info Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#39265E] bg-[#140E24] px-3.5 py-1 font-display text-[11px] tracking-widest uppercase text-[#FFD447]">
                    <span className="h-2 w-2 rounded-[2px] bg-[#FFD447]" aria-hidden="true" />
                    {EXHIBITION_LAUNCH_META.badgeLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#39265E] bg-[#140E24] px-3.5 py-1 font-body text-xs text-[#FFF5E9]/85">
                    <span className="h-2 w-2 rounded-[2px] bg-[#9470E8]" aria-hidden="true" />
                    {EXHIBITION_LAUNCH_META.dateLabel}
                  </span>
                </div>

                {/* Display Heading */}
                <h1 className="mt-6 font-display text-3xl tracking-wider uppercase sm:text-5xl">
                  <span className="text-[#FFF5E9]">
                    {EXHIBITION_LAUNCH_META.headingPrefix}{" "}
                  </span>
                  <span className="text-[#FFD447]">
                    {EXHIBITION_LAUNCH_META.headingHighlight}
                  </span>
                </h1>

                {/* 4-Box Countdown Grid: HARI | JAM | MENIT | DETIK */}
                <div className="mx-auto mt-7 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {countdownUnits.map((unit) => (
                    <div
                      key={unit.id}
                      data-countdown-unit={unit.id}
                      className="flex flex-col items-center rounded-2xl border border-[#39265E]/80 bg-[#151026]/95 p-3 sm:p-4"
                    >
                      <span
                        aria-hidden="true"
                        className="mb-3 h-1 w-6 rounded-full"
                        style={{ backgroundColor: unit.accentColor }}
                      />
                      <div className="flex w-full items-center justify-center rounded-xl border border-white/5 bg-[#0E0919] py-3.5 shadow-inner sm:py-4">
                        <span className="font-display text-4xl tracking-wider text-[#FFF5E9] tabular-nums sm:text-5xl">
                          {unit.value}
                        </span>
                      </div>
                      <span className="mt-2.5 font-display text-[11px] tracking-[0.22em] text-[#B7ABCE] uppercase sm:text-xs">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  aria-hidden="true"
                  className="mt-7 flex items-center justify-center gap-2"
                >
                  <span className="h-1 w-5 rounded-full bg-[#7AC70C]" />
                  <span className="h-1 w-10 rounded-full bg-[#9470E8]" />
                  <span className="h-1 w-4 rounded-full bg-[#FFD447]" />
                </div>
              </div>
            ) : (
              <ThreeLayerHoldVerification
                motionVideoSrc={motionVideoSrc}
                videoSrc={documentationVideoSrc}
                onStageChange={setVerificationStage}
              />
            )}
          </div>
        </div>
      </section>

      {unlockedContent ?? null}
    </>
  );
}
