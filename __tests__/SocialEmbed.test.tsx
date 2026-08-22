import { render, screen } from "@testing-library/react";
import { InstagramEmbed, TikTokEmbed } from "@/components/SocialEmbed";
import UpdateCard from "@/components/UpdateCard";
import type { FeedItem } from "@/lib/api/types/feed";

const sampleIgFeed: FeedItem = {
  id: "ig-test",
  title: "Instagram Spotlight Test",
  caption: "Dokumentasi booth pameran",
  source: "instagram",
  author_name: "@p2r_official",
  external_url: "https://instagram.com/p2r_official",
  likes_count: 500,
  created_at: "2026-08-22T10:00:00Z",
};

const sampleTtFeed: FeedItem = {
  id: "tt-test",
  title: "TikTok Video Test",
  caption: "Cuplikan video gameplay",
  source: "tiktok",
  author_name: "@p2r_tiktok",
  external_url: "https://tiktok.com/@p2r_tiktok",
  likes_count: 1200,
  created_at: "2026-08-22T11:00:00Z",
};

const sampleUpdateFeed: FeedItem = {
  id: "ann-test",
  title: "Pengumuman Resmi Turnamen",
  content: "Babak final akan diselenggarakan besok sore.",
  source: "announcement",
  author_name: "Panitia P2R",
  created_at: "2026-08-22T12:00:00Z",
};

describe("SocialEmbed Components", () => {
  it("renders InstagramEmbed with platform tag, author, title, and link", () => {
    render(<InstagramEmbed feed={sampleIgFeed} />);

    expect(screen.getByText("INSTAGRAM")).toBeInTheDocument();
    expect(screen.getByText("@p2r_official")).toBeInTheDocument();
    expect(screen.getByText("Instagram Spotlight Test")).toBeInTheDocument();
    expect(screen.getByText("500 LIKES")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /lihat di instagram/i })).toHaveAttribute(
      "href",
      "https://instagram.com/p2r_official",
    );
  });

  it("renders TikTokEmbed with platform tag, creator tag, title, and link", () => {
    render(<TikTokEmbed feed={sampleTtFeed} />);

    expect(screen.getByText("TIKTOK")).toBeInTheDocument();
    expect(screen.getByText("@p2r_tiktok")).toBeInTheDocument();
    expect(screen.getByText("TikTok Video Test")).toBeInTheDocument();
    expect(screen.getByText("1.200 VIEWS")).toBeInTheDocument();
    expect(screen.getByText("VIDEO PREVIEW")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /buka di tiktok/i })).toHaveAttribute(
      "href",
      "https://tiktok.com/@p2r_tiktok",
    );
  });
});

describe("UpdateCard Component", () => {
  it("renders UpdateCard with announcement badge, author, and content", () => {
    render(<UpdateCard feed={sampleUpdateFeed} />);

    expect(screen.getByText("PENGUMUMAN")).toBeInTheDocument();
    expect(screen.getByText("Pengumuman Resmi Turnamen")).toBeInTheDocument();
    expect(screen.getByText("Panitia P2R")).toBeInTheDocument();
    expect(
      screen.getByText("Babak final akan diselenggarakan besok sore."),
    ).toBeInTheDocument();
  });
});
