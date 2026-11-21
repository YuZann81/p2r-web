"use client";

import React from "react";
import { RefreshCw, CalendarClock, Wrench, AlertTriangle } from "lucide-react";
import ArcadeLogo from "@/components/ArcadeLogo";
import PixelDivider from "@/components/PixelDivider";
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
  "Kami sedang melakukan pemeliharaan dan peningkatan terjadwal pada platform Pixels to Reality. Situs akan kembali dapat diakses segera setelah proses pembaruan selesai.";

const SYSTEM_DEGRADED_MESSAGE =
  "Layanan backend Pixels to Reality sedang mengalami gangguan sementara atau belum dapat dijangkau. Tim kami sedang memulihkan sistem agar pengalaman pameran segera kembali normal.";

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
      className="relative flex min-h-screen flex-col justify-between overflow-x-hidden text-white"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      {/* Subtle crisp pixel dot backdrop texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 229, 0, 0.35) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top Brand Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between px-4 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center gap-3">
          <ArcadeLogo className="h-9 sm:h-10" />
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-md border-2 px-3 py-1 font-display text-sm tracking-wider uppercase shadow-[3px_3px_0_var(--arcade-ink)] sm:text-base ${
            isScheduled
              ? "border-arcade-yellow bg-arcade-ink/90 text-arcade-yellow"
              : "border-[#fb923c] bg-arcade-ink/90 text-[#fdba74]"
          }`}
        >
          {isScheduled ? (
            <Wrench className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          )}
          {isScheduled ? "Pemeliharaan Terjadwal" : "Gangguan Sistem"}
        </span>
      </header>

      {/* Main Centered Pixel-Art Showcase Card */}
      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-5 sm:px-6 sm:py-6">
        <div
          className={`w-full overflow-hidden rounded-2xl border-2 bg-[#160828]/95 shadow-[8px_8px_0_var(--arcade-ink)] ${
            isScheduled ? "border-arcade-yellow/80" : "border-[#fb923c]/80"
          }`}
        >
          {/* Pixel-Art Illustration Centerpiece Stage */}
          <div className="relative border-b-2 border-white/10 bg-[#120722] p-3 sm:p-4">
            <div className="overflow-hidden rounded-xl border-2 border-[#3b1c6e] bg-[#120722] shadow-inner">
              {isScheduled ? (
                <ScheduledMaintenancePixelScene />
              ) : (
                <SystemDegradedPixelScene />
              )}
            </div>
          </div>

          <PixelDivider />

          {/* Clear Indonesian Content & Actions */}
          <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            <div className="space-y-2.5">
              <h1 className="font-display text-3xl leading-tight tracking-wide text-white [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-4xl">
                {isScheduled
                  ? "Dunia P2R Sedang Ditingkatkan"
                  : "Layanan Sedang Dipulihkan"}
              </h1>

              <p className="max-w-2xl font-sans text-sm leading-relaxed text-white/85 sm:text-base">
                {isScheduled
                  ? customMessage || DEFAULT_SCHEDULED_MESSAGE
                  : SYSTEM_DEGRADED_MESSAGE}
              </p>
            </div>

            {/* Optional Super Admin Schedule Window (Scheduled Maintenance only) */}
            {isScheduled && scheduleWindow && (
              <div className="flex items-start gap-3 rounded-xl border border-arcade-yellow/35 bg-arcade-yellow/10 px-4 py-3.5">
                <CalendarClock
                  className="mt-0.5 size-5 shrink-0 text-arcade-yellow"
                  aria-hidden="true"
                />
                <div className="space-y-0.5">
                  <p className="font-display text-sm tracking-wider text-arcade-yellow uppercase">
                    Jadwal Pemeliharaan
                  </p>
                  <p className="font-sans text-sm font-medium text-white sm:text-base">
                    {scheduleWindow}
                  </p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onRetry}
                disabled={isChecking}
                className={`inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border-2 border-arcade-ink px-6 py-3 font-display text-lg tracking-wider uppercase transition-transform active:translate-y-0.5 disabled:cursor-wait disabled:opacity-75 ${
                  isScheduled
                    ? "bg-[#22d3ee] text-arcade-ink shadow-[4px_4px_0_#0e7490] hover:bg-[#67e8f9]"
                    : "bg-arcade-yellow text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] hover:bg-[#ffed4a]"
                }`}
              >
                <RefreshCw
                  className={`size-4 shrink-0 ${isChecking ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {isChecking
                  ? "Memeriksa Status..."
                  : isScheduled
                    ? "Periksa Status"
                    : "Coba Lagi"}
              </button>

              <p className="font-sans text-xs leading-relaxed text-white/65 sm:text-right sm:text-sm">
                {isScheduled
                  ? "Halaman akan kembali normal secara otomatis setelah pemeliharaan selesai."
                  : "Memeriksa koneksi otomatis setiap 10 detik dan pulih otomatis saat layanan sehat."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Brand Footer */}
      <footer className="relative z-10 py-4 text-center font-sans text-xs text-white/60">
        © 2026 Pixels to Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
