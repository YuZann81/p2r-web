const NONEXISTENT_LEGACY_MEDIA_PATHS = new Set([
  "/images/game-1.png",
  "/images/game-2.png",
  "/images/game-1-logo.png",
]);

export function sanitizeMediaUrl(value: unknown): string | null {
  let raw: string | null = null;

  if (typeof value === "string") {
    raw = value.trim();
  } else if (
    value &&
    typeof value === "object" &&
    "url" in value &&
    typeof (value as { url?: unknown }).url === "string"
  ) {
    raw = ((value as { url: string }).url).trim();
  }

  if (!raw) return null;
  if (NONEXISTENT_LEGACY_MEDIA_PATHS.has(raw)) return null;
  return raw;
}

export function resolveKaryaMediaUrls(mediaUrls: unknown): string[] {
  if (!Array.isArray(mediaUrls)) return [];
  return mediaUrls
    .map(sanitizeMediaUrl)
    .filter((url): url is string => url !== null);
}
