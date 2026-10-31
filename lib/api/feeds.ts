import { apiGet } from "@/lib/api/client";
import type { FeedItem, FeedListParams } from "@/lib/api/types/feed";

export type { FeedItem, FeedListParams, FeedSource } from "@/lib/api/types/feed";

/**
 * The public API returns the platform shape below. The Web UI was built around
 * editorial categories (announcement/activity/news/instagram), so this adapter
 * translates one into the other instead of leaking the raw platform schema into
 * every component.
 */
type RawFeedItem = {
  id: string | number;
  platform?: string | null;
  original_url?: string | null;
  title?: string | null;
  thumbnail_url?: string | null;
  embed_html?: string | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

function mapPlatformToSource(platform?: string | null): string | null {
  switch ((platform || "").toLowerCase().trim()) {
    case "instagram":
      return "instagram";
    case "tiktok":
      // Behind-the-scenes clips are presented as activity updates.
      return "activity";
    case "web":
      return "news";
    case "custom":
      // Editor-created announcements.
      return "announcement";
    default:
      return platform ?? null;
  }
}

function stripHtml(value?: string | null): string | null {
  if (!value) return null;

  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 0 ? text : null;
}

function mapFeed(raw: RawFeedItem): FeedItem {
  return {
    id: raw.id,
    title: raw.title ?? null,
    content: stripHtml(raw.embed_html),
    caption: null,
    image_url: raw.thumbnail_url ?? null,
    media_url: null,
    source: mapPlatformToSource(raw.platform),
    author_name: null,
    external_url: raw.original_url ?? null,
    created_at: raw.created_at ?? null,
    updated_at: raw.updated_at ?? null,
  };
}

export async function fetchFeeds(
  params: FeedListParams = {},
): Promise<FeedItem[]> {
  try {
    const payload = await apiGet<RawFeedItem[]>("/feeds", {
      searchParams: {
        limit: params.limit,
        source: params.source,
      },
    });

    return Array.isArray(payload.data) ? payload.data.map(mapFeed) : [];
  } catch (error) {
    console.error("[p2r-api] Failed to fetch feeds:", error);
    return [];
  }
}

export async function fetchFeedById(
  id: string | number,
): Promise<FeedItem | null> {
  try {
    const payload = await apiGet<RawFeedItem>(`/feeds/${encodeURIComponent(id)}`);
    // The API returns an empty array for a missing or inactive feed, so the
    // shape must be checked before mapping.
    if (!payload.data || Array.isArray(payload.data)) return null;
    return mapFeed(payload.data);
  } catch (error) {
    console.error("[p2r-api] Failed to fetch feed item by id:", id, error);
    return null;
  }
}
