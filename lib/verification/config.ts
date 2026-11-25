import type { LayerDefinition } from "@/lib/verification/types";

/**
 * Konfigurasi durasi default tiap tahap verifikasi telapak tangan (6 tahap × 2 detik).
 * Mudah diubah dari konfigurasi atau props tanpa mengunci nilai di komponen UI.
 */
export const DEFAULT_LAYER_DURATIONS_MS: readonly number[] = [
  2000,
  2000,
  2000,
  2000,
  2000,
  2000,
];

export const DEFAULT_LAYER_DEFINITIONS: readonly LayerDefinition[] = [
  {
    id: 1,
    title: "Layer 1 • Inisialisasi Biometrik",
    instruction: "Tempelkan telapak tangan kanan hingga terisi penuh.",
  },
  {
    id: 2,
    title: "Layer 2 • Sinkronisasi Pola",
    instruction: "Lanjutkan verifikasi tangan kanan tahap kedua.",
  },
  {
    id: 3,
    title: "Layer 3 • Kalibrasi Sesi",
    instruction: "Lanjutkan verifikasi tangan kanan tahap ketiga.",
  },
  {
    id: 4,
    title: "Layer 4 • Validasi Identitas",
    instruction: "Lanjutkan verifikasi tangan kanan tahap keempat.",
  },
  {
    id: 5,
    title: "Layer 5 • Enkripsi Akses",
    instruction: "Lanjutkan verifikasi tangan kanan tahap kelima.",
  },
  {
    id: 6,
    title: "Layer 6 • Otorisasi Final",
    instruction: "Tahan tahap akhir untuk memvalidasi akses pameran.",
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
