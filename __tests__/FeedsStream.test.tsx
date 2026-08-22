import { fireEvent, render, screen } from "@testing-library/react";
import FeedsStream from "@/components/FeedsStream";
import type { FeedItem } from "@/lib/api/types/feed";

const mockFeeds: FeedItem[] = [
  {
    id: "feed-ig-1",
    title: "Behind The Scenes Booth P2R",
    caption: "Keseruan merakit kabinet arcade fisik!",
    content: "Seluruh tim bekerja sama merakit kabinet game arcade.",
    source: "instagram",
    author_name: "@pixel2reality_smk",
    created_at: "2026-08-22T08:30:00Z",
  },
  {
    id: "feed-tt-1",
    title: "Gameplay Sneak Peek Cyber Runner",
    caption: "Tantang refleksmu di game arcade Cyber Runner!",
    content: "Cuplikan gameplay arcade retro.",
    source: "tiktok",
    author_name: "@p2r_cyberarcade",
    created_at: "2026-08-22T09:15:00Z",
  },
  {
    id: "feed-ann-1",
    title: "Jadwal Final Turnamen Arcade",
    content: "Babak final turnamen arcade akan berlangsung besok.",
    source: "announcement",
    author_name: "Panitia P2R",
    created_at: "2026-08-22T10:00:00Z",
  },
];

describe("FeedsStream Component", () => {
  it("renders featured social spotlight when on all view", () => {
    render(<FeedsStream initialFeeds={mockFeeds} />);

    expect(screen.getByText("Sorotan Media Sosial Pameran")).toBeInTheDocument();
    expect(screen.getAllByText("@pixel2reality_smk").length).toBeGreaterThan(0);
    expect(screen.getAllByText("@p2r_cyberarcade").length).toBeGreaterThan(0);
  });

  it("filters feeds by Instagram tab", () => {
    render(<FeedsStream initialFeeds={mockFeeds} />);

    const igTab = screen.getByRole("button", { name: "Instagram" });
    fireEvent.click(igTab);

    expect(screen.getByText("Menampilkan 1 dari 3 Feeds")).toBeInTheDocument();
    expect(
      screen.getAllByText("Behind The Scenes Booth P2R").length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByText("Jadwal Final Turnamen Arcade"),
    ).not.toBeInTheDocument();
  });

  it("filters feeds by TikTok tab", () => {
    render(<FeedsStream initialFeeds={mockFeeds} />);

    const ttTab = screen.getByRole("button", { name: "TikTok" });
    fireEvent.click(ttTab);

    expect(screen.getByText("Menampilkan 1 dari 3 Feeds")).toBeInTheDocument();
    expect(
      screen.getAllByText("Gameplay Sneak Peek Cyber Runner").length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByText("Jadwal Final Turnamen Arcade"),
    ).not.toBeInTheDocument();
  });

  it("filters feeds by search keyword in real-time", () => {
    render(<FeedsStream initialFeeds={mockFeeds} />);

    const searchInput = screen.getByLabelText(/cari feeds dan pengumuman/i);
    fireEvent.change(searchInput, { target: { value: "Turnamen" } });

    expect(screen.getByText("Menampilkan 1 dari 3 Feeds")).toBeInTheDocument();
    expect(
      screen.getByText("Jadwal Final Turnamen Arcade"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Gameplay Sneak Peek Cyber Runner"),
    ).not.toBeInTheDocument();
  });

  it("shows empty search result state and resets search correctly", () => {
    render(<FeedsStream initialFeeds={mockFeeds} />);

    const searchInput = screen.getByLabelText(/cari feeds dan pengumuman/i);
    fireEvent.change(searchInput, { target: { value: "NonExistentFeed999" } });

    expect(
      screen.getByText(/tidak ditemukan postingan dengan kata kunci/i),
    ).toBeInTheDocument();

    const resetButton = screen.getByRole("button", {
      name: /lihat semua feeds/i,
    });
    fireEvent.click(resetButton);

    expect(screen.getByText("Menampilkan 3 dari 3 Feeds")).toBeInTheDocument();
    expect(
      screen.getAllByText("Behind The Scenes Booth P2R").length,
    ).toBeGreaterThan(0);
  });
});
