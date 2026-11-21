"use client";

import React from "react";
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

const DEFAULT_SCHEDULED_LINE_1 = "We are calibrating the arcade cabinets.";
const DEFAULT_SCHEDULED_LINE_2 = "Please check back soon.";

const SYSTEM_DEGRADED_LINE_1 = "The arcade servers are temporarily offline.";
const SYSTEM_DEGRADED_LINE_2 = "Please check back soon.";

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
      className="relative flex min-h-screen min-h-[100svh] w-full flex-col justify-between overflow-x-hidden bg-[#1c0e32] font-display text-white"
    >
      {/* Top-Left Minimal Wordmark (text only, no logo asset) */}
      <header className="mx-auto w-full max-w-[1440px] px-6 pt-8 sm:px-14 sm:pt-12 lg:px-24 lg:pt-14">
        <span className="inline-block text-xl tracking-[0.14em] text-[#a594cc] uppercase sm:text-2xl">
          PIXEL TO REALITY
        </span>
      </header>

      {/* Full-Viewport Asymmetric Composition Matching Reference */}
      <section className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-6 px-6 pb-8 pt-10 sm:px-14 sm:pb-12 sm:pt-12 lg:grid-cols-12 lg:items-end lg:gap-4 lg:px-24 lg:pb-14 lg:pt-0">
        {/* Left / Upper-Mid Editorial Typography & P2R Pixel Retry Action */}
        <div className="space-y-4 sm:space-y-5 lg:col-span-7 lg:self-center lg:pb-16">
          <h1 className="text-5xl leading-[0.98] tracking-[0.06em] text-arcade-yellow uppercase sm:text-6xl lg:text-[74px] lg:whitespace-nowrap">
            {isScheduled ? "UNDER MAINTENANCE" : "SYSTEM DEGRADED"}
          </h1>

          <div className="max-w-xl space-y-0.5 text-xl leading-[1.25] tracking-[0.03em] text-[#38d6f5] sm:text-2xl lg:text-[28px]">
            {isScheduled ? (
              customMessage ? (
                <p>{customMessage}</p>
              ) : (
                <>
                  <p>{DEFAULT_SCHEDULED_LINE_1}</p>
                  <p>{DEFAULT_SCHEDULED_LINE_2}</p>
                </>
              )
            ) : (
              <>
                <p>{SYSTEM_DEGRADED_LINE_1}</p>
                <p>{SYSTEM_DEGRADED_LINE_2}</p>
              </>
            )}
          </div>

          {isScheduled && scheduleWindow && (
            <p className="text-base tracking-[0.06em] text-[#a594cc] sm:text-lg">
              {scheduleWindow}
            </p>
          )}

          <div className="pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onRetry}
              disabled={isChecking}
              className="p2r-pixel-btn inline-flex min-w-[128px] cursor-pointer items-center justify-center border-r-[4px] border-[#168aa6] bg-[#29d3eb] px-7 py-2 text-2xl tracking-[0.12em] text-arcade-ink uppercase transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#5ce1f6] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 disabled:cursor-wait disabled:opacity-75 sm:min-w-[144px] sm:px-8 sm:py-2.5 sm:text-[26px]"
            >
              {isChecking ? "CHECKING..." : "RETRY"}
            </button>
          </div>
        </div>

        {/* Lower-Right Frameless Isometric Pixel-Art Illustration */}
        <div className="flex w-full justify-end lg:col-span-5 lg:self-end">
          <div className="w-[270px] shrink-0 sm:w-[360px] lg:w-[440px] xl:w-[480px]">
            {isScheduled ? (
              <ScheduledMaintenancePixelScene />
            ) : (
              <SystemDegradedPixelScene />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
