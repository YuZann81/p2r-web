import { fetchFeeds } from "@/lib/api/feeds";
import type { FeedItem, FeedListParams } from "@/lib/api/types/feed";

export async function getFeeds(
  params: FeedListParams = {},
): Promise<FeedItem[]> {
  try {
    const feeds = await fetchFeeds(params);
    if (Array.isArray(feeds)) {
      return feeds;
    }
    return [];
  } catch (error) {
    console.error("[p2r-api] Error retrieving feeds in getFeeds:", error);
    return [];
  }
}
