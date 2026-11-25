jest.mock("@/components/Footer", () => function MockFooter() {
  return <footer data-testid="mock-footer" />;
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KaryaPage from "@/app/karya/page";
import { getAllKaryas } from "@/lib/karya/getKaryas";
import type { KaryaDetail } from "@/lib/api/types/karya";

jest.mock("@/lib/karya/getKaryas", () => ({
  getAllKaryas: jest.fn(),
}));

const mockedGetAllKaryas = getAllKaryas as jest.MockedFunction<
  typeof getAllKaryas
>;

const mockKaryas: KaryaDetail[] = [
  {
    id: "karya-1",
    title: "Portal Sekolah Next.js",
    slug: "portal-sekolah-nextjs",
    description: "Portal sekolah interaktif.",
    creators: "Tim Web RPL",
    category: "website",
    tech_stack: ["Next.js", "TypeScript"],
    media_urls: ["https://cdn.example.com/web.png"],
    live_url: "https://play.example.com",
    repo_url: null,
    is_featured: true,
    status: "published",
    votes_count: 99,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
  {
    id: "karya-2",
    title: "Smart Attendance IoT",
    slug: "smart-attendance-iot",
    description: "Sistem presensi berbasis RFID dan sensor ESP32.",
    creators: "Tim IoT RPL",
    category: "hardware_robotics",
    tech_stack: ["ESP32", "C++", "MQTT"],
    media_urls: [],
    live_url: null,
    repo_url: "https://github.com/example/iot",
    is_featured: false,
    status: "published",
    votes_count: 42,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
];

describe("KaryaPage (/karya)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders default All Categories when no category query param is provided", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce(mockKaryas);

    const Component = await KaryaPage();
    render(Component);

    expect(
      screen.getByRole("heading", { level: 1, name: /semua karya/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Semua Kategori" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Portal Sekolah Next.js")).toBeInTheDocument();
    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument();
  });

  it("pre-selects and filters category when ?category= query param is passed", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce(mockKaryas);

    const Component = await KaryaPage({
      searchParams: Promise.resolve({ category: "hardware_robotics" }),
    });
    render(Component);

    expect(
      screen.getByRole("tab", { name: "IoT & Hardware" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument();
    expect(screen.queryByText("Portal Sekolah Next.js")).not.toBeInTheDocument();
  });

  it("falls back cleanly to All Categories for unknown ?category= values", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce(mockKaryas);

    const Component = await KaryaPage({
      searchParams: Promise.resolve({ category: "nonexistent" }),
    });
    render(Component);

    expect(
      screen.getByRole("tab", { name: "Semua Kategori" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Portal Sekolah Next.js")).toBeInTheDocument();
    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument();
  });

  it("filters karya list by category tab and shows empty state when no karya matches", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce(mockKaryas);
    const user = userEvent.setup();

    const Component = await KaryaPage();
    render(Component);

    await user.click(screen.getByRole("tab", { name: "Web Innovation" }));
    expect(screen.getByText("Portal Sekolah Next.js")).toBeInTheDocument();
    expect(screen.queryByText("Smart Attendance IoT")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Digital Art" }));
    expect(
      screen.getByRole("heading", { level: 2, name: "Karya Segera Hadir" }),
    ).toBeInTheDocument();
  });

  it("handles empty initial karyas array gracefully", async () => {
    mockedGetAllKaryas.mockResolvedValueOnce([]);

    const Component = await KaryaPage();
    render(Component);

    expect(
      screen.getByRole("heading", { level: 2, name: "Karya Segera Hadir" }),
    ).toBeInTheDocument();
  });
});
