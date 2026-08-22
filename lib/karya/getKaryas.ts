import { fetchKaryas } from "@/lib/api/karya";
import type { KaryaCategory, KaryaDetail } from "@/lib/api/types/karya";

export async function getAllKaryas(
  category?: KaryaCategory,
): Promise<KaryaDetail[]> {
  try {
    const karyas = await fetchKaryas(category ? { category } : {});
    if (Array.isArray(karyas)) {
      return karyas;
    }
    return [];
  } catch (error) {
    console.error("[p2r-api] Failed to load karyas from API:", error);
    return [];
  }
}
