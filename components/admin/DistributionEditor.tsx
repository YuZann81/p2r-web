"use client";

import React from "react";
import type {
  Distribution,
  DistributionPlatform,
  DistributionType,
} from "@/lib/api/types/karya";

export type DistributionEditorProps = {
  distributions: Distribution[] | null | undefined;
  onChange: (distributions: Distribution[]) => void;
  disabled?: boolean;
};

const PLATFORM_OPTIONS: { value: DistributionPlatform; label: string }[] = [
  { value: "web", label: "Web / Browser" },
  { value: "windows", label: "Windows (.exe / .zip)" },
  { value: "android", label: "Android (.apk)" },
  { value: "linux", label: "Linux (.tar.gz / AppImage)" },
  { value: "macos", label: "macOS (.dmg / .zip)" },
  { value: "other", label: "Other Platform" },
];

const TYPE_OPTIONS: {
  value: DistributionType;
  label: string;
  description: string;
}[] = [
  {
    value: "p2r_arcade",
    label: "P2R Arcade (Integrated)",
    description: "Main langsung di stasiun arcade P2R dengan leaderboard resmi",
  },
  {
    value: "web_external",
    label: "Web Game (URL Eksternal)",
    description: "Link game web eksternal (itch.io, WebGL demo, dsb)",
  },
  {
    value: "download",
    label: "Download (Binary / Installer)",
    description: "Link download file installer atau arsip game",
  },
];

export default function DistributionEditor({
  distributions,
  onChange,
  disabled = false,
}: DistributionEditorProps) {
  const items: Distribution[] = Array.isArray(distributions)
    ? distributions
    : [];

  const handleAdd = (presetType: DistributionType = "web_external") => {
    const newItem: Distribution =
      presetType === "p2r_arcade"
        ? { platform: "web", type: "p2r_arcade" }
        : presetType === "download"
          ? { platform: "windows", type: "download", url: "" }
          : { platform: "web", type: "web_external", url: "" };

    onChange([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleUpdate = (
    index: number,
    field: keyof Distribution,
    value: unknown,
  ) => {
    const updated = items.map((item, idx) => {
      if (idx !== index) return item;

      const newItem = { ...item, [field]: value };

      // Type-specific automatic platform normalization
      if (field === "type") {
        if (value === "p2r_arcade" || value === "web_external") {
          newItem.platform = "web";
        } else if (value === "download" && item.platform === "web") {
          newItem.platform = "windows";
        }
      }

      return newItem;
    });

    onChange(updated);
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/15 bg-black/40 p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-arcade-yellow">
            Jalur Distribusi Game (Multi-Distribution)
          </h4>
          <p className="text-xs text-white/70">
            Tentukan bagaimana pengunjung dapat mengakses atau memainkan game ini.
          </p>
        </div>

        {/* Quick Add Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleAdd("p2r_arcade")}
            className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-arcade-yellow/60 bg-arcade-yellow/15 px-3 py-1 font-display text-xs font-bold text-arcade-yellow hover:bg-arcade-yellow/25 disabled:opacity-50 cursor-pointer"
          >
            + P2R Arcade
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleAdd("web_external")}
            className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-3 py-1 font-display text-xs font-bold text-white hover:bg-white/20 disabled:opacity-50 cursor-pointer"
          >
            + Web External
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleAdd("download")}
            className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-3 py-1 font-display text-xs font-bold text-white hover:bg-white/20 disabled:opacity-50 cursor-pointer"
          >
            + Download
          </button>
        </div>
      </div>

      {/* Distribution Items List */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/20 bg-black/20 p-6 text-center text-xs text-white/60">
          Belum ada jalur distribusi khusus. Game akan menggunakan fallback{" "}
          <code className="text-arcade-yellow">live_url</code> bila tersedia.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isArcade = item.type === "p2r_arcade";
            const isDownload = item.type === "download";

            return (
              <div
                key={index}
                data-testid={`distribution-item-${index}`}
                className="flex flex-col gap-3 rounded-xl border border-white/20 bg-[#160b33] p-3.5 sm:p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-arcade-yellow/20 font-mono text-xs font-bold text-arcade-yellow">
                      {index + 1}
                    </span>
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-white">
                      {isArcade
                        ? "P2R Arcade Integrated"
                        : isDownload
                          ? `Download (${item.platform})`
                          : "Web Game External"}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleRemove(index)}
                    aria-label={`Hapus distribusi ${index + 1}`}
                    className="inline-flex min-h-[28px] items-center justify-center rounded-md border border-red-400/40 bg-red-500/10 px-2.5 py-0.5 font-display text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Distribution Type Selector */}
                  <div>
                    <label
                      htmlFor={`dist-type-${index}`}
                      className="block font-display text-xs text-white/80"
                    >
                      Tipe Distribusi
                    </label>
                    <select
                      id={`dist-type-${index}`}
                      value={item.type}
                      disabled={disabled}
                      onChange={(e) =>
                        handleUpdate(index, "type", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-black/60 px-3 py-2 font-body text-xs text-white outline-none focus:border-arcade-yellow focus:ring-1 focus:ring-arcade-yellow"
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Platform Selector */}
                  <div>
                    <label
                      htmlFor={`dist-platform-${index}`}
                      className="block font-display text-xs text-white/80"
                    >
                      Target Platform
                    </label>
                    <select
                      id={`dist-platform-${index}`}
                      value={item.platform}
                      disabled={disabled || isArcade || item.type === "web_external"}
                      onChange={(e) =>
                        handleUpdate(index, "platform", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-black/60 px-3 py-2 font-body text-xs text-white outline-none focus:border-arcade-yellow focus:ring-1 focus:ring-arcade-yellow disabled:opacity-60"
                    >
                      {isArcade || item.type === "web_external" ? (
                        <option value="web">Web / Browser</option>
                      ) : (
                        PLATFORM_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* URL Input (Required for web_external & download, not needed for p2r_arcade) */}
                {!isArcade ? (
                  <div>
                    <label
                      htmlFor={`dist-url-${index}`}
                      className="block font-display text-xs text-white/80"
                    >
                      Destination / Download URL{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      id={`dist-url-${index}`}
                      type="url"
                      required
                      value={item.url || ""}
                      disabled={disabled}
                      onChange={(e) =>
                        handleUpdate(index, "url", e.target.value)
                      }
                      placeholder={
                        isDownload
                          ? "https://github.com/.../release.zip atau URL direct download"
                          : "https://itch.io/game atau URL live game"
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-black/60 px-3 py-2 font-mono text-xs text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-1 focus:ring-arcade-yellow"
                    />
                    {item.url &&
                      !item.url.startsWith("http://") &&
                      !item.url.startsWith("https://") && (
                        <p className="mt-1 text-xs text-amber-300">
                          URL harus diawali dengan http:// atau https://
                        </p>
                      )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-arcade-yellow/30 bg-arcade-yellow/10 px-3 py-2 text-xs text-arcade-yellow">
                    ✓ P2R Arcade tidak membutuhkan URL eksternal (menggunakan engine
                    gameplay terintegrasi).
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
