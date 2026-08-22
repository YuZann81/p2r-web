import type { KaryaDetail } from "@/lib/api/types/karya";
import type { Game } from "@/lib/content";

const DEFAULT_GAME_IMAGE = "/images/game-1.png";
const DEFAULT_GAME_LOGO = "/images/game-1-logo.png";
const DEFAULT_DESCRIPTION =
  "Explore this game at Pixel to Reality: The Cyber Arcade.";

function resolveMediaUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "url" in value &&
    typeof value.url === "string" &&
    value.url.trim().length > 0
  ) {
    return value.url;
  }

  return null;
}

export function mapKaryaToGame(karya: KaryaDetail): Game {
  const mediaUrls = karya.media_urls
    .map(resolveMediaUrl)
    .filter((url): url is string => url !== null);

  const image = mediaUrls[0] ?? DEFAULT_GAME_IMAGE;
  const logo = mediaUrls[1] ?? mediaUrls[0] ?? DEFAULT_GAME_LOGO;

  return {
    id: karya.slug,
    name: karya.title,
    description: karya.description?.trim() || DEFAULT_DESCRIPTION,
    image,
    imageAlt: `${karya.title} artwork`,
    logo,
    logoAlt: `${karya.title} logo`,
  };
}
