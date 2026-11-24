import { fetchGameKaryas } from "@/lib/api/karya";
import { GAMES } from "@/lib/content";
import { mapKaryaToGame } from "@/lib/games/mapKaryaToGame";

export async function getGames() {
  try {
    const karyas = await fetchGameKaryas();

    if (karyas.length === 0) {
      console.log(
        "[games] No API game karyas found; using static fallback content",
      );
      return [...GAMES];
    }

    console.log("[games] Loaded games from API:", karyas.length);
    return karyas.map(mapKaryaToGame);
  } catch (error) {
    console.error(
      "[games] Failed to load games from API; using static fallback",
      error,
    );
    return [...GAMES];
  }
}
