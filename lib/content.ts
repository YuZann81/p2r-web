export const NAV_LINKS = [
  { label: "Information", href: "#information" },
  { label: "Marchandise", href: "#marchandise" },
  { label: "Shoping", href: "#shoping" },
] as const;

export const BRAND_NAME = "Pixels to Reality";

export const HERO_CONTENT = {
  heading:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  subheading:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  ctaLabel: "Let's explore",
} as const;

export const ABOUT_MARQUEE_TEXT = "Chapter 2 Aboust Software Enginering";

export const ABOUT_CONTENT = {
  headingLines: ["Welcome to major", "Software Enginering"],
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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

export const FOOTER_MARQUEE_TEXT = "Final Chapter About Software Enginering";

export type Investor = {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
};

export const FOOTER_CONTENT = {
  heading: "Our Investors",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  copyright: "© 2026 Lorem ipsum dolor sit amet",
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
    name: "Name of Game",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/images/game-1.png",
    imageAlt: "image game",
    logo: "/images/game-1-logo.png",
    logoAlt: "logo game",
  },
  {
    id: "game-2",
    name: "Name of Game",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/images/game-2.png",
    imageAlt: "image game",
    logo: "/images/game-2-logo.png",
    logoAlt: "logo game",
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

