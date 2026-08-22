import { fetchKaryas } from "@/lib/api/karya";
import type { KaryaCategory, KaryaDetail } from "@/lib/api/types/karya";
import { GAMES } from "@/lib/content";

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

  // If no category specified or category is "game", provide fallback from GAMES
  if (!category || category === "game") {
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

  return [];
}
