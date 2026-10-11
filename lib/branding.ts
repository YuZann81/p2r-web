import { apiGet } from "@/lib/api/client";

/**
 * Institutional branding.
 *
 * Pixel2Reality has no investors, sponsors or external partners. The
 * exhibition is organised by SMKN 1 Katapang through its Rekayasa Perangkat
 * Lunak department, and that institutional identity is what the site presents.
 *
 * Values come from the public read-only settings endpoint so a Superadmin can
 * change them from the admin panel without a code change or redeploy. The
 * fallback below is only used when the API is unreachable so the page still
 * renders during an outage - the API is the source of truth.
 */
export type Branding = {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  website: string;
  socials: string;
  visible: boolean;
};

const OFFICIAL_LOGO = "/brand/pixel2reality-logo.png";

const FALLBACK: Branding = {
  name: "SMKN 1 Katapang × RPL",
  tagline: "Penyelenggara Pameran Karya Teknologi",
  description:
    "Pameran karya teknologi dan game interaktif karya siswa SMKN 1 Katapang melalui jurusan Rekayasa Perangkat Lunak (RPL).",
  logoUrl: OFFICIAL_LOGO,
  website: "",
  socials: "",
  visible: true,
};

type RawSettings = Record<string, unknown>;

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

export async function getBranding(): Promise<Branding> {
  try {
    const payload = await apiGet<RawSettings>("/settings");
    const settings = payload?.data ?? {};

    const visible = settings.institution_visible;
    const isVisible = visible === undefined ? true : String(visible) === "1" || String(visible) === "true";

    return {
      name: str(settings.institution_name, FALLBACK.name),
      tagline: str(settings.institution_tagline, FALLBACK.tagline),
      description: str(settings.institution_description, FALLBACK.description),
      logoUrl: str(settings.institution_logo_url, FALLBACK.logoUrl),
      website: typeof settings.institution_website === "string" ? settings.institution_website : "",
      socials: typeof settings.institution_socials === "string" ? settings.institution_socials : "",
      visible: isVisible,
    };
  } catch (error) {
    console.error("[p2r-api] Failed to load institutional branding:", error);
    return FALLBACK;
  }
}
