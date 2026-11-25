import { mapKaryaToGame } from "@/lib/games/mapKaryaToGame";
import type { KaryaDetail } from "@/lib/api/types/karya";

const mockKarya: KaryaDetail = {
  id: "1",
  title: "Pixel Runner",
  slug: "pixel-runner",
  description: "An arcade platformer built for the cyber arcade.",
  creators: "Team Alpha",
  category: "game",
  tech_stack: [],
  media_urls: [
    "https://cdn.example.com/game.png",
    "https://cdn.example.com/logo.png",
  ],
  live_url: null,
  repo_url: null,
  is_featured: true,
  status: "published",
  votes_count: 42,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  is_voted_by_me: "false",
};

describe("mapKaryaToGame", () => {
  it("maps karya API fields and preserves valid API media URLs", () => {
    const game = mapKaryaToGame(mockKarya);

    expect(game).toEqual({
      id: "pixel-runner",
      name: "Pixel Runner",
      description: "An arcade platformer built for the cyber arcade.",
      image: "https://cdn.example.com/game.png",
      imageAlt: "Pixel Runner artwork",
      logo: "https://cdn.example.com/logo.png",
      logoAlt: "Pixel Runner logo",
    });
  });

  it("returns empty media strings (no nonexistent /images/game-1.png) when media_urls are missing", () => {
    const game = mapKaryaToGame({
      ...mockKarya,
      media_urls: [],
      description: null,
    });

    expect(game.image).toBe("");
    expect(game.logo).toBe("");
    expect(game.description).toBe(
      "Explore this game at Pixel to Reality: The Cyber Arcade.",
    );
  });

  it("filters out nonexistent legacy placeholder paths from API media_urls", () => {
    const game = mapKaryaToGame({
      ...mockKarya,
      media_urls: ["/images/game-1.png", "/images/game-2.png", "/images/game-1-logo.png"],
    });

    expect(game.image).toBe("");
    expect(game.logo).toBe("");
  });
});
