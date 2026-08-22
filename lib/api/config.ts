const DEFAULT_API_BASE_URL = "https://api.razzan.site/p2r/v1";

/* setup dotenv and add NEXT_PUBLIC_P2R_API_BASE_URL to it to define a local api server*/
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_P2R_API_BASE_URL?.trim();
  const base = configured || DEFAULT_API_BASE_URL;
  return base.replace(/\/$/, "");
}
