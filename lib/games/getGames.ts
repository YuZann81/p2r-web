import { fetchGameKaryas } from "@/lib/api/karya";
import { mapKaryaToGame } from "@/lib/games/mapKaryaToGame";

export async function getGames() {
  try {
    const karyas = await fetchGameKaryas();

    if (karyas.length === 0) {
      return [];
    }

    return karyas.map(mapKaryaToGame);
  } catch (error) {
    console.error("[games] Failed to load games from API:", error);
    return [];
  }
}
