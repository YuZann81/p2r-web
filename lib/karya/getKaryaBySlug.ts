import { fetchKaryaBySlug } from "@/lib/api/karya";
import type { KaryaDetail } from "@/lib/api/types/karya";

export async function getKaryaBySlug(
  slug: string,
): Promise<KaryaDetail | null> {
  try {
    const karya = await fetchKaryaBySlug(slug);
    if (karya && (karya.id || karya.slug)) {
      return karya;
    }
    return null;
  } catch (error) {
    console.error(`[p2r-api] Failed to fetch karya '${slug}' from API:`, error);
    return null;
  }
}
