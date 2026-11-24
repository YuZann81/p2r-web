export type FeedSource =
  | "instagram"
  | "announcement"
  | "activity"
  | "news"
  | "event"
  | string;

export type FeedItem = {
  id: string | number;
  title?: string | null;
  content?: string | null;
  caption?: string | null;
  image_url?: string | null;
  media_url?: string | null;
  source?: string | null;
  author_name?: string | null;
  external_url?: string | null;
  likes_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export type FeedListParams = {
  limit?: number;
  source?: string;
};
