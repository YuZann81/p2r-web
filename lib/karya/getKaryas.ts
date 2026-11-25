import { fetchKaryas } from "@/lib/api/karya";
import type { KaryaCategory, KaryaDetail } from "@/lib/api/types/karya";
import { GAMES } from "@/lib/content";

export const FALLBACK_NON_GAME_KARYAS: KaryaDetail[] = [
  {
    id: "karya-web-1",
    title: "EduPortal RPL - Learning Management System",
    slug: "eduportal-rpl",
    description: "Portal akademik terintegrasi untuk manajemen tugas, absensi digital, dan materi pembelajaran siswa jurusan RPL berbasis web modern.",
    creators: "Tim Web Innovation RPL",
    category: "website",
    tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    media_urls: ["/images/custom-design/direct_38_1025x639_img_38.png.png"],
    live_url: "https://eduportal.example.com",
    repo_url: "https://github.com/example/eduportal",
    is_featured: true,
    status: "published",
    votes_count: 85,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
  {
    id: "karya-soft-1",
    title: "PosPoint - Smart POS & Inventory Management",
    slug: "pospoint-smart-pos",
    description: "Sistem aplikasi kasir otomatis dan inventaris barang toko dengan pelaporan analitik real-time dan pencetakan struk digital.",
    creators: "Tim Software Engineering RPL",
    category: "software",
    tech_stack: ["Electron", "Python", "PostgreSQL", "Node.js"],
    media_urls: ["/images/custom-design/direct_46_625x415_img_46.png.png"],
    live_url: null,
    repo_url: "https://github.com/example/pospoint",
    is_featured: true,
    status: "published",
    votes_count: 72,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
  {
    id: "karya-iot-1",
    title: "TrashBot AI - Smart Waste Sorter ESP32",
    slug: "trashbot-ai-smart-sorter",
    description: "Tempat sampah pintar pemilah sampah otomatis berbasis sensor servo ESP32 dan klasifikasi citra AI terintegrasi dashboard IoT.",
    creators: "Tim IoT & Hardware RPL",
    category: "hardware_robotics",
    tech_stack: ["ESP32", "Arduino", "MicroPython", "Servo Motors"],
    media_urls: ["/images/custom-design/direct_10_1025x1130_img_10.png.png"],
    live_url: null,
    repo_url: "https://github.com/example/trashbot-ai",
    is_featured: true,
    status: "published",
    votes_count: 94,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
  {
    id: "karya-art-1",
    title: "CyberPixel UI - Design System & Retro 8-Bit Assets",
    slug: "cyberpixel-ui-design-system",
    description: "Design system token berbasis Figma dengan katalog sprite piksel retro 8-bit, komponen modular dark arcade, dan ilustrasi digital.",
    creators: "Tim Digital Art & UI/UX RPL",
    category: "digital_art",
    tech_stack: ["Figma", "Aseprite", "Design Tokens", "Blender"],
    media_urls: ["/images/custom-design/direct_17_1024x1129_img_17.png.png"],
    live_url: "https://figma.example.com",
    repo_url: null,
    is_featured: true,
    status: "published",
    votes_count: 110,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
];

export async function getAllKaryas(
  category?: KaryaCategory,
): Promise<KaryaDetail[]> {
  try {
    const karyas = await fetchKaryas(category ? { category } : {});
    if (karyas.length > 0) {
      return karyas;
    }
  } catch (error) {
    console.error(
      "[karya] Failed to load karyas from API; checking static fallback:",
      error,
    );
  }

  // If specific category requested, return corresponding fallback
  if (category) {
    if (category === "game") {
      return GAMES.map((g) => ({
        id: g.id,
        title: g.name,
        slug: g.id,
        description: g.description,
        creators: "Tim Siswa RPL",
        category: "game",
        tech_stack: ["Next.js", "Phaser.js", "WebAudio", "Pixel Shader"],
        media_urls: [g.image, g.logo],
        live_url: null,
        repo_url: null,
        is_featured: true,
        status: "published",
        votes_count: 128,
        created_at: null,
        updated_at: null,
        is_voted_by_me: "0",
      }));
    }
    return FALLBACK_NON_GAME_KARYAS.filter((k) => k.category === category);
  }

  // By default, return the non-game karya collection
  return FALLBACK_NON_GAME_KARYAS;
}
