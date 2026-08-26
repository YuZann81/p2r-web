import { render, screen } from "@testing-library/react";
import KaryaShowcasePreview from "@/components/KaryaShowcasePreview";
import Games from "@/components/Games";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import LatestFeedsPreview from "@/components/LatestFeedsPreview";
import MerchandisePreview from "@/components/MerchandisePreview";
import { getAllKaryas } from "@/lib/karya/getKaryas";
import { getGames } from "@/lib/games/getGames";
import { getLeaderboardData } from "@/lib/leaderboard/getLeaderboard";
import { getFeeds } from "@/lib/feeds/getFeeds";
import { fetchProducts } from "@/lib/api/products";

jest.mock("@/lib/karya/getKaryas", () => ({
  getAllKaryas: jest.fn(),
}));

jest.mock("@/lib/games/getGames", () => ({
  getGames: jest.fn(),
}));

jest.mock("@/lib/leaderboard/getLeaderboard", () => ({
  getLeaderboardData: jest.fn(),
}));

jest.mock("@/lib/feeds/getFeeds", () => ({
  getFeeds: jest.fn(),
}));

jest.mock("@/lib/api/products", () => ({
  fetchProducts: jest.fn(),
}));

const mockedGetAllKaryas = getAllKaryas as jest.MockedFunction<
  typeof getAllKaryas
>;
const mockedGetGames = getGames as jest.MockedFunction<typeof getGames>;
const mockedGetLeaderboardData = getLeaderboardData as jest.MockedFunction<
  typeof getLeaderboardData
>;
const mockedGetFeeds = getFeeds as jest.MockedFunction<typeof getFeeds>;
const mockedFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>;

describe("Landing Feature Discovery Previews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("KaryaShowcasePreview", () => {
    it("renders section heading, karya cards, and link to /karya", async () => {
      mockedGetAllKaryas.mockResolvedValueOnce([
        {
          id: "karya-web-1",
          title: "Portal Siswa Cerdas",
          slug: "portal-siswa-cerdas",
          description: "Aplikasi portal pintar manajemen tugas.",
          creators: "Tim Web",
          category: "website",
          tech_stack: ["Next.js", "TypeScript"],
          media_urls: ["https://example.com/img.png"],
          live_url: null,
          repo_url: null,
          is_featured: true,
          status: "published",
          votes_count: 55,
          created_at: null,
          updated_at: null,
          is_voted_by_me: "0",
        },
      ]);

      const Component = await KaryaShowcasePreview();
      render(Component);

      expect(
        screen.getByRole("heading", { name: "KARYA SISWA RPL" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Portal Siswa Cerdas")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /lihat semua karya/i }),
      ).toHaveAttribute("href", "/karya");
    });
  });

  describe("Games (Arcade Showcase)", () => {
    it("renders section heading, game showcase cards with artwork, and links to /games", async () => {
      mockedGetGames.mockResolvedValueOnce([
        {
          id: "game-1",
          name: "Cyber Runner 2099",
          description: "Game arcade endless runner bertema cyberpunk neon.",
          image: "/images/game-1.png",
          imageAlt: "Cyber Runner 2099 artwork",
          logo: "/images/game-1-logo.png",
          logoAlt: "Cyber Runner 2099 logo",
        },
      ]);

      const Component = await Games();
      render(Component);

      expect(
        screen.getByRole("heading", { name: "GAME ARCADE SISWA RPL" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Cyber Runner 2099")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /lihat detail game/i }),
      ).toHaveAttribute("href", "/games/game-1");
      expect(
        screen.getByRole("link", { name: /eksplorasi semua game/i }),
      ).toHaveAttribute("href", "/games");
    });
  });

  describe("LeaderboardPreview", () => {
    it("renders podium rankings and link to /leaderboard", async () => {
      mockedGetLeaderboardData.mockResolvedValueOnce({
        mode: "live",
        entries: [
          { rank: 1, playerName: "CyberPro", gameName: "Cyber Runner", score: 99000 },
          { rank: 2, playerName: "ByteKing", gameName: "Byte Defender", score: 88000 },
          { rank: 3, playerName: "NeonStar", gameName: "Neon Highway", score: 77000 },
        ],
      });

      const Component = await LeaderboardPreview();
      render(Component);

      expect(
        screen.getByRole("heading", { name: "TOP PLAYERS LEADERBOARD" }),
      ).toBeInTheDocument();
      expect(screen.getByText("CyberPro")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /lihat leaderboard lengkap/i }),
      ).toHaveAttribute("href", "/leaderboard");
    });
  });

  describe("LatestFeedsPreview", () => {
    it("renders feeds cards and link to /feeds", async () => {
      mockedGetFeeds.mockResolvedValueOnce([
        {
          id: "feed-101",
          title: "Pengumuman Turnamen VR",
          content: "Babak penyisihan dimulai pukul 10.00.",
          source: "announcement",
          created_at: "2026-08-22T10:00:00Z",
        },
      ]);

      const Component = await LatestFeedsPreview();
      render(Component);

      expect(
        screen.getByRole("heading", { name: "FEEDS & INFO TERKINI" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Pengumuman Turnamen VR")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /lihat semua feed/i }),
      ).toHaveAttribute("href", "/feeds");
    });
  });

  describe("MerchandisePreview", () => {
    it("renders preview products with formatted price and link to /merchandise", async () => {
      mockedFetchProducts.mockResolvedValueOnce([
        {
          id: "prod-1",
          name: "Cyber T-Shirt",
          slug: "cyber-t-shirt",
          description: "Official cyberpunk t-shirt.",
          price: 85000,
          stock: 20,
          image_url: "https://example.com/tshirt.png",
          category: "Fashion",
          status: "Ready Stock",
        },
      ]);

      const Component = await MerchandisePreview();
      render(Component);

      expect(
        screen.getByRole("heading", { name: "MERCHANDISE RESMI P2R" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Cyber T-Shirt")).toBeInTheDocument();
      expect(screen.getByText("Rp 85.000")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /pesan merchandise/i }),
      ).toHaveAttribute("href", "/merchandise");
      expect(
        screen.getByRole("link", { name: /lihat semua merchandise/i }),
      ).toHaveAttribute("href", "/merchandise");
    });
  });
});
