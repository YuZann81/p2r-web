import { apiGet } from "@/lib/api/client";
import type { FeedItem, FeedListParams } from "@/lib/api/types/feed";

export type { FeedItem, FeedListParams, FeedSource } from "@/lib/api/types/feed";

export async function fetchFeeds(
  params: FeedListParams = {},
): Promise<FeedItem[]> {
  try {
    const payload = await apiGet<FeedItem[]>("/feeds", {
      searchParams: {
        limit: params.limit,
        source: params.source,
      },
    });

    return Array.isArray(payload.data) ? payload.data : [];
  } catch (error) {
    console.error("[p2r-api] Failed to fetch feeds:", error);
    return [];
  }
}

export async function fetchFeedById(
  id: string | number,
): Promise<FeedItem | null> {
  try {
    const payload = await apiGet<FeedItem>(`/feeds/${encodeURIComponent(id)}`);
    return payload.data || null;
  } catch (error) {
    console.error("[p2r-api] Failed to fetch feed item by id:", id, error);
    return null;
  }
}
