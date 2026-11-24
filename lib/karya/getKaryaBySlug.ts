import { fetchKaryaBySlug } from "@/lib/api/karya";
import type { KaryaDetail } from "@/lib/api/types/karya";
import { GAMES } from "@/lib/content";

export async function getKaryaBySlug(slug: string): Promise<KaryaDetail | null> {
  try {
    const karya = await fetchKaryaBySlug(slug);
    if (karya && (karya.id || karya.slug)) {
      return karya;
    }
  } catch (error) {
    console.warn(
      `[p2r-api] Karya not found in API for slug '${slug}', checking fallback content:`,
      error,
    );
  }

  // Fallback to static GAMES if slug matches
  const fallbackGame = GAMES.find((g) => g.id === slug);
  if (fallbackGame) {
    return {
      id: fallbackGame.id,
      title: fallbackGame.name,
      slug: fallbackGame.id,
      description: fallbackGame.description,
      creators: "Tim Siswa RPL",
      category: "game",
      tech_stack: ["Next.js", "Phaser.js", "WebAudio", "Tailwind CSS"],
      media_urls: [fallbackGame.image, fallbackGame.logo],
      live_url: null,
      repo_url: null,
      is_featured: true,
      status: "published",
      votes_count: 128,
      created_at: null,
      updated_at: null,
      is_voted_by_me: "0",
    };
  }

  return null;
}
