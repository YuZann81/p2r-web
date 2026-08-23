export type FeedPlatform =
  | "instagram"
  | "tiktok"
  | "custom"
  | "web"
  | string;

export type FeedSource =
  | "instagram"
  | "tiktok"
  | "announcement"
  | "activity"
  | "news"
  | "event"
  | string;

export type FeedItem = {
  id: string | number;
  platform?: FeedPlatform | null;
  source?: string | null;
  original_url?: string | null;
  external_url?: string | null;
  title?: string | null;
  thumbnail_url?: string | null;
  image_url?: string | null;
  media_url?: string | null;
  embed_html?: string | null;
  content?: string | null;
  caption?: string | null;
  author_name?: string | null;
  likes_count?: number;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type FeedListParams = {
  limit?: number;
  source?: string;
  platform?: string;
};
