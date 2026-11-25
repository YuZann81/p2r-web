export const KARYA_CATEGORIES = [
  { id: "all", label: "Semua Kategori" },
  { id: "website", label: "Web Innovation" },
  { id: "software", label: "Software" },
  { id: "hardware_robotics", label: "IoT & Hardware" },
  { id: "digital_art", label: "Digital Art" },
] as const;

export type KaryaFilterCategory = (typeof KARYA_CATEGORIES)[number]["id"];

export const KARYA_FILTERABLE_CATEGORIES = KARYA_CATEGORIES.filter(
  (category) => category.id !== "all",
);

const VALID_CATEGORY_IDS = new Set<string>(
  KARYA_CATEGORIES.map((category) => category.id),
);

export function normalizeKaryaCategory(
  raw?: string | string[] | null,
): KaryaFilterCategory {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = typeof candidate === "string" ? candidate.trim() : "";
  if (VALID_CATEGORY_IDS.has(trimmed)) {
    return trimmed as KaryaFilterCategory;
  }
  return "all";
}
