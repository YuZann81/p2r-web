"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import {
  ScheduledMaintenancePixelScene,
  SystemDegradedPixelScene,
} from "@/components/maintenance/PixelArtScenes";
import type { PlatformStatus } from "@/lib/maintenance/status";

interface MaintenanceExperienceProps {
  status: PlatformStatus;
  isChecking: boolean;
  onRetry: () => void;
}

const DEFAULT_SCHEDULED_MESSAGE =
  "Kami sedang melakukan peningkatan terjadwal agar pengalaman pameran Pixels to Reality semakin siap dijelajahi.";

const SYSTEM_DEGRADED_MESSAGE =
  "Layanan kami sedang mengalami gangguan sementara dan tim teknisi sedang memulihkannya.";

export default function MaintenanceExperience({
  status,
  isChecking,
  onRetry,
}: MaintenanceExperienceProps) {
  const isScheduled = status.mode === "scheduled_maintenance";
  const customMessage = status.maintenance.message.trim();
  const scheduleWindow = status.maintenance.schedule.trim();

  return (
    <main
      role="status"
      aria-live="polite"
      data-maintenance-mode={status.mode}
      className="relative flex min-h-screen min-h-[100svh] w-full flex-col justify-between overflow-x-hidden text-white"
      style={{
        background:
          "linear-gradient(180deg, #120722 0%, #1d0c3a 36%, #311564 76%, #451e86 100%)",
      }}
    >
      {/* Subtle full-viewport pixel sky texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 229, 0, 0.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top-Left Understated Navbar Wordmark (text only, no logo image) */}
      <header className="relative z-10 w-full px-6 pt-6 sm:px-10 sm:pt-7 lg:px-14">
        <span className="inline-block font-display text-lg tracking-[0.16em] text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-xl">
          PIXEL TO REALITY
        </span>
      </header>

      {/* Editorial Copy + Frameless Pixel-Art Diorama */}
      <section className="relative z-10 flex w-full flex-1 flex-col justify-between pt-4 sm:pt-6">
        {/* Upper Editorial Copy Block — natural left-weighted composition */}
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-14">
          <div className="max-w-xl space-y-3 sm:space-y-4">
            <h1 className="font-display text-4xl leading-[1.02] tracking-wide text-white [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl lg:text-6xl">
              {isScheduled
                ? "Dunia P2R Sedang Ditingkatkan"
                : "Sistem Sedang Dipulihkan"}
            </h1>

            <p className="max-w-md font-sans text-sm leading-relaxed text-white/80 sm:text-base">
              {isScheduled
                ? customMessage || DEFAULT_SCHEDULED_MESSAGE
                : SYSTEM_DEGRADED_MESSAGE}
            </p>

            {isScheduled && scheduleWindow && (
              <p className="font-sans text-xs font-medium tracking-wide text-arcade-yellow/90 sm:text-sm">
                Jadwal: {scheduleWindow}
              </p>
            )}

            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={onRetry}
                disabled={isChecking}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-sm border-2 border-arcade-ink px-5 py-2 font-display text-lg tracking-wider uppercase transition-transform active:translate-y-0.5 disabled:cursor-wait disabled:opacity-75 ${
                  isScheduled
                    ? "bg-[#22d3ee] text-arcade-ink shadow-[3px_3px_0_#0e7490] hover:bg-[#67e8f9]"
                    : "bg-arcade-yellow text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] hover:bg-[#ffed4a]"
                }`}
              >
                <RefreshCw
                  className={`size-4 shrink-0 ${isChecking ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {isChecking ? "Memeriksa..." : "Coba Lagi"}
              </button>
            </div>
          </div>
        </div>

        {/* Large Frameless 16-Bit Pixel-Art Centerpiece Sitting on Continuous Ground */}
        <div className="relative mt-auto w-full pt-4 sm:pt-2">
          <div className="relative z-10 mx-auto flex w-full max-w-6xl justify-center px-3 sm:px-8 lg:justify-end lg:px-14">
            {isScheduled ? (
              <ScheduledMaintenancePixelScene className="h-auto max-h-[38svh] w-full max-w-[360px] sm:max-h-[44svh] sm:max-w-[680px] lg:max-h-[48svh] lg:max-w-[780px]" />
            ) : (
              <SystemDegradedPixelScene className="h-auto max-h-[38svh] w-full max-w-[360px] sm:max-h-[44svh] sm:max-w-[680px] lg:max-h-[48svh] lg:max-w-[780px]" />
            )}
          </div>

          {/* Edge-to-Edge Checkered Arcade Ground Band Seamlessly Anchoring the Scene */}
          <div
            aria-hidden="true"
            className="relative -mt-2 h-11 w-full border-t-2 border-[#4c2485] bg-[#1a0a30] sm:-mt-3 sm:h-14"
            style={{
              backgroundImage:
                "repeating-conic-gradient(#241042 0% 25%, #1a0a30 0% 50%)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
      </section>
    </main>
  );
}
