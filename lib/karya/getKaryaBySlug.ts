import { fetchKaryaBySlug } from "@/lib/api/karya";
import type { KaryaDetail } from "@/lib/api/types/karya";

export async function getKaryaBySlug(slug: string): Promise<KaryaDetail | null> {
  try {
    const karya = await fetchKaryaBySlug(slug);
    if (karya && (karya.id || karya.slug)) {
      return karya;
    }
  } catch (error) {
    console.warn(`[p2r-api] Karya '${slug}' is unavailable:`, error);
  }

  return null;
}
