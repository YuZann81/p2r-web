import type { LayerDefinition } from "@/lib/verification/types";

/**
 * Konfigurasi durasi default tiap layer (dalam milidetik).
 * Mudah diubah dari konfigurasi atau props tanpa mengunci nilai di komponen UI.
 */
export const DEFAULT_LAYER_DURATIONS_MS: readonly [number, number, number] = [
  3500,
  3500,
  3500,
];

export const DEFAULT_LAYER_DEFINITIONS: readonly [
  LayerDefinition,
  LayerDefinition,
  LayerDefinition,
] = [
  {
    id: 1,
    title: "Layer 1 • Inisialisasi Kunci",
    instruction: "Tekan dan tahan tombol hingga penuh untuk membuka Layer 2.",
  },
  {
    id: 2,
    title: "Layer 2 • Sinkronisasi Sesi",
    instruction: "Lanjutkan dengan menahan tombol kedua secara stabil.",
  },
  {
    id: 3,
    title: "Layer 3 • Otorisasi Final",
    instruction: "Tahan tahap akhir untuk memvalidasi akses dokumentasi.",
  },
];

export const MOTION_GRAPHIC_TIMING_MS = {
  /** Fallback durasi maksimal jika event onEnded video motion tidak terpicu */
  enterAndPlay: 6200,
  disperseExit: 380,
  reducedEnterAndPlay: 800,
  reducedDisperseExit: 200,
} as const;

export const MOTION_GRAPHIC_VIDEO_CONFIG = {
  src:
    process.env.NEXT_PUBLIC_MOTION_GRAPHIC_VIDEO_URL?.trim() ||
    "/videos/motion-graphic-p2r.mp4",
  title: "Motion Graphic Pixel To Reality",
} as const;

export const STEP_TRANSITION_TIMING_MS = {
  successHold: 700,
  exitFade: 460,
  reducedSuccessHold: 260,
  reducedExitFade: 160,
} as const;

export const EXHIBITION_LAUNCH_META = {
  badgeLabel: "COUNTDOWN TO LAUNCH",
  dateLabel: "26 November 2026 • 08:00 WIB (Asia/Jakarta)",
  headingPrefix: "MENUJU PEMBUKAAN",
  headingHighlight: "PAMERAN",
} as const;

export const DOCUMENTATION_VIDEO_CONFIG = {
  src:
    process.env.NEXT_PUBLIC_DOCUMENTATION_VIDEO_URL?.trim() ||
    "/videos/dokumentasi-p2r.mp4",
  title: "Video Dokumentasi P2R",
  subtitle: "Kilas balik pameran karya & turnamen Pixel To Reality.",
} as const;

/**
 * Default simulasi countdown dummy (5 detik) agar bisa langsung dicoba,
 * siap disambungkan dengan API countdown di masa mendatang.
 */
export const DEFAULT_COUNTDOWN_SECONDS = 5;
