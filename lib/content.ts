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
