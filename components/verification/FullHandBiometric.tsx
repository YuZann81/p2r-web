"use client";

import React, { useId } from "react";

type FullHandBiometricProps = {
  progress: number;
  state: "idle" | "holding" | "completed" | "verifying";
  showCheck?: boolean;
};

const FINGERTIP_DOTS = [
  { id: "thumb-tip", cx: 36, cy: 104, r: 4.4 },
  { id: "index-tip", cx: 69, cy: 40, r: 4.4 },
  { id: "middle-tip", cx: 101, cy: 26, r: 4.6 },
  { id: "ring-tip", cx: 134, cy: 39, r: 4.4 },
  { id: "pinky-tip", cx: 155, cy: 71, r: 4.2 },
] as const;

/**
 * Siluet tangan kanan sederhana dengan titik biometrik hanya di 5 ujung jari,
 * tanpa border dan menyatu ke background.
 */
export default function FullHandBiometric({
  progress,
  state,
  showCheck = false,
}: FullHandBiometricProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `p2r-hand-fill-${uid}`;
  const clamped = Math.max(0, Math.min(1, progress));
  const fillPct =
    state === "completed" || state === "verifying" ? 100 : Math.round(clamped * 100);

  const strokeColor =
    state === "completed" || state === "verifying"
      ? "#7AC70C"
      : state === "holding"
        ? "#68D5E8"
        : "#FFD447";

  const activeFillColor =
    state === "completed" || state === "verifying"
      ? "rgba(122, 199, 12, 0.30)"
      : state === "holding"
        ? "rgba(104, 213, 232, 0.28)"
        : "rgba(255, 212, 71, 0.06)";

  return (
    <svg
      viewBox="0 0 190 210"
      aria-hidden="true"
      className="h-52 w-48 sm:h-64 sm:w-56 select-none transition-transform duration-200"
      style={{
        filter:
          state === "holding"
            ? "drop-shadow(0 0 18px rgba(104, 213, 232, 0.52))"
            : state === "completed" || state === "verifying"
              ? "drop-shadow(0 0 22px rgba(122, 199, 12, 0.58))"
              : "drop-shadow(0 0 12px rgba(255, 212, 71, 0.24))",
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={activeFillColor} />
          <stop offset={`${fillPct}%`} stopColor={activeFillColor} />
          <stop
            offset={`${Math.min(100, fillPct + 2)}%`}
            stopColor="rgba(255, 255, 255, 0.02)"
          />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
        </linearGradient>
      </defs>

      {/* Outline tangan kanan sederhana & membulat (ibu jari kiri -> kelingking kanan) */}
      <path
        d="M 100 188 C 66 188 52 162 42 138 C 34 122 24 112 32 100 C 40 90 52 104 62 118 C 64 122 67 120 66 112 C 64 90 60 56 61 42 C 62 32 75 32 77 42 C 79 58 82 86 84 98 C 85 104 90 104 91 98 C 92 78 92 44 93 29 C 94 19 108 19 109 29 C 110 46 111 78 112 97 C 113 103 118 103 119 97 C 122 76 124 52 126 40 C 128 30 141 32 141 42 C 139 58 134 86 132 103 C 131 109 136 110 139 104 C 143 92 145 78 148 70 C 151 61 163 64 162 74 C 159 94 152 126 144 152 C 135 178 120 188 100 188 Z"
        fill={`url(#${gradId})`}
        stroke={strokeColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Titik hanya di 5 ujung jari */}
      {FINGERTIP_DOTS.map((dot) => (
        <g key={dot.id} data-fingertip-dot={dot.id}>
          <circle
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r + 2.8}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeOpacity={state === "holding" ? 0.65 : 0.35}
          />
          <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill={strokeColor} />
        </g>
      ))}

      {/* Logo ceklis tepat di tengah telapak tangan (x=101, y=144) */}
      {showCheck && (
        <path
          data-testid="palm-center-check"
          d="M 85 145 L 96 156 L 118 132"
          fill="none"
          stroke="#7AC70C"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
