export const NAV_LINKS = [
  { label: "Information", href: "#about" },
  { label: "Karya", href: "/karya" },
  { label: "Games", href: "/games" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Feeds", href: "/feeds" },
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

export type Investor = {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
};

export const FOOTER_CONTENT = {
  heading: "Our Investors",
  body: "Apresiasi setinggi-tingginya kepada para mitra industri, sponsor, dan pendukung yang berkolaborasi menyukseskan pameran Pixel To Reality: The Cyber Arcade.",
  copyright: "© 2026 Pixel To Reality. All rights reserved.",
  investors: [
    {
      id: "agate",
      name: "Agate",
      logo: "/images/investors/agate.png",
      logoAlt: "Agate logo",
    },
    {
      id: "aice",
      name: "Aice",
      logo: "/images/investors/aice.png",
      logoAlt: "Aice logo",
    },
    {
      id: "indomie",
      name: "Indomie",
      logo: "/images/investors/indomie.png",
      logoAlt: "Indomie logo",
    },
    {
      id: "kabayan",
      name: "Kabayan Group",
      logo: "/images/investors/kabayan.png",
      logoAlt: "Kabayan Group logo",
    },
  ] as readonly Investor[],
} as const;

export const GAMES: readonly Game[] = [
  {
    id: "game-1",
    name: "Cyber Runner 2099",
    description:
      "Game arcade endless runner berkecepatan tinggi dengan nuansa visual cyberpunk neon. Hindari rintangan siber dan raih skor tertinggi!",
    image: "/images/game-1.png",
    imageAlt: "Cyber Runner 2099 game artwork",
    logo: "/images/game-1-logo.png",
    logoAlt: "Cyber Runner 2099 logo",
  },
  {
    id: "game-2",
    name: "Byte Defender",
    description:
      "Game arcade shooter strategi untuk melindungi server inti dari gelombang malware dan bug digital dalam pertarungan piksel yang intens.",
    image: "/images/game-2.png",
    imageAlt: "Byte Defender game artwork",
    logo: "/images/game-2-logo.png",
    logoAlt: "Byte Defender logo",
  },
] as const;

export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  gameName: string;
  score: number;
};

export const LEADERBOARD_ENTRIES: readonly LeaderboardEntry[] = [
  {
    rank: 1,
    playerName: "CyberKnight",
    gameName: "Cyber Runner 2099",
    score: 98500,
  },
  {
    rank: 2,
    playerName: "PixelQueen",
    gameName: "Byte Defender",
    score: 87200,
  },
  {
    rank: 3,
    playerName: "NeonRider",
    gameName: "Neon Highway",
    score: 76450,
  },
  {
    rank: 4,
    playerName: "RetroWizard",
    gameName: "Cyber Runner 2099",
    score: 65100,
  },
  {
    rank: 5,
    playerName: "BitMaster",
    gameName: "Byte Defender",
    score: 54300,
  },
  {
    rank: 6,
    playerName: "ArcadeHero",
    gameName: "Neon Highway",
    score: 48900,
  },
  {
    rank: 7,
    playerName: "GlitchHunter",
    gameName: "Cyber Runner 2099",
    score: 42150,
  },
  {
    rank: 8,
    playerName: "ShadowCoder",
    gameName: "Byte Defender",
    score: 39800,
  },
] as const;
