export const NAV_LINKS = [
  { label: "Karya", href: "/karya" },
  { label: "Games", href: "/games" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Merchandise", href: "/merchandise" },
] as const;

export const BRAND_NAME = "Pixels to Reality";

export const HERO_CONTENT = {
  heading:
    "Pixels to Reality: The Cyber Arcade — Pameran Karya Teknologi & Game Interaktif Siswa RPL.",
  subheading:
    "Eksplorasi ragam inovasi perangkat lunak, game retro arcade, web, dan sistem IoT buatan siswa Rekayasa Perangkat Lunak. Mainkan gamenya, dukung karya terbaik, dan rasakan pengalaman pameran interaktif masa depan.",
  ctaLabel: "Jelajahi Karya",
} as const;

export const ABOUT_MARQUEE_TEXT = "Chapter 2 About Software Engineering";

export const ABOUT_CONTENT = {
  headingLines: ["Welcome to major", "Software Engineering"],
  body: "Rekayasa Perangkat Lunak (RPL) adalah kompetensi keahlian yang berfokus pada rekayasa software, pembuatan game interaktif, aplikasi web & mobile, serta inovasi teknologi digital. Kami mewujudkan baris kode menjadi karya nyata yang berdampak.",
  emblem: {
    src: "/images/rpl-emblem.png",
    alt: "RPL (Rekayasa Perangkat Lunak) pixel-art emblem featuring a globe, Java logo, and binary code",
  },
} as const;

export type Game = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  logo: string;
  logoAlt: string;
};

export const GAMES_HEADING = "Games";

export const FOOTER_MARQUEE_TEXT = "Final Chapter About Software Engineering";

export const FOOTER_CONTENT = {
  copyright: "© 2026 Pixel To Reality. All rights reserved.",
} as const;
