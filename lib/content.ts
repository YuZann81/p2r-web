export const NAV_LINKS = [
  { label: "Karya", href: "/karya" },
  { label: "Games", href: "/games" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Merchandise", href: "/merchandise" },
] as const;

export type Game = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  logo: string;
  logoAlt: string;
};

export const FOOTER_CONTENT = {
  copyright: "© 2026 Pixel To Reality. All rights reserved.",
} as const;
