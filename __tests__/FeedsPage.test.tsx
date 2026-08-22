import { fireEvent, render, screen } from "@testing-library/react";
import FeedsPage from "@/app/feeds/page";
import { getFeeds } from "@/lib/feeds/getFeeds";

jest.mock("@/lib/feeds/getFeeds", () => ({
  getFeeds: jest.fn(),
}));

const mockedGetFeeds = getFeeds as jest.MockedFunction<typeof getFeeds>;

describe("FeedsPage (/feeds)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page title, back links, and empty state when feeds array is empty", async () => {
    mockedGetFeeds.mockResolvedValueOnce([]);

    const Component = await FeedsPage();
    render(Component);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /info terkini & feeds/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /belum ada postingan feeds/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "← Kembali ke Beranda" }),
    ).toBeInTheDocument();
  });

  it("renders feed items and allows filtering by category tab", async () => {
    const mockFeeds = [
      {
        id: "feed-1",
        title: "Pengumuman Final Turnamen Arcade",
        content: "Turnamen game retro akan diadakan besok pukul 13.00.",
        source: "announcement",
        created_at: "2026-08-22T10:00:00Z",
      },
      {
        id: "feed-2",
        title: "Keseruan Booth IoT & VR",
        content: "Pengunjung mencoba demo robotika dan game VR di booth RPL.",
        source: "activity",
        created_at: "2026-08-22T11:00:00Z",
      },
    ];

    mockedGetFeeds.mockResolvedValueOnce(mockFeeds);

    const Component = await FeedsPage();
    render(Component);

    expect(
      screen.getByText("Pengumuman Final Turnamen Arcade"),
    ).toBeInTheDocument();
    expect(screen.getByText("Keseruan Booth IoT & VR")).toBeInTheDocument();

    // Filter by 'Pengumuman' tab
    const announcementTab = screen.getByRole("button", {
      name: "Pengumuman",
    });
    fireEvent.click(announcementTab);

    expect(
      screen.getByText("Pengumuman Final Turnamen Arcade"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Keseruan Booth IoT & VR"),
    ).not.toBeInTheDocument();
  });
});
