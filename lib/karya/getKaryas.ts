import { fetchKaryas } from "@/lib/api/karya";
import type { KaryaCategory, KaryaDetail } from "@/lib/api/types/karya";

export async function getAllKaryas(
  category?: KaryaCategory,
): Promise<KaryaDetail[]> {
  try {
    return await fetchKaryas(category ? { category } : {});
  } catch (error) {
    console.error("[karya] Failed to load karyas from API:", error);
    return [];
  }
}
