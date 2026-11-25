import type { KaryaDetail } from "@/lib/api/types/karya";
import type { Game } from "@/lib/content";
import { resolveKaryaMediaUrls } from "@/lib/api/media";

const DEFAULT_DESCRIPTION =
  "Explore this game at Pixel to Reality: The Cyber Arcade.";

export function mapKaryaToGame(karya: KaryaDetail): Game {
  const mediaUrls = resolveKaryaMediaUrls(karya.media_urls);

  const image = mediaUrls[0] ?? "";
  const logo = mediaUrls[1] ?? mediaUrls[0] ?? "";

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
