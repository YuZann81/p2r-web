import { fetchFeeds } from "@/lib/api/feeds";
import type { FeedItem, FeedListParams } from "@/lib/api/types/feed";

export async function getFeeds(params: FeedListParams = {}): Promise<FeedItem[]> {
  try {
    const feeds = await fetchFeeds(params);
    return feeds;
  } catch (error) {
    console.error("[feeds] Error retrieving feeds in getFeeds:", error);
    return [];
  }
}
