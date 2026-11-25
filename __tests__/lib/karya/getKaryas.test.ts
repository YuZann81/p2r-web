import { getAllKaryas } from "@/lib/karya/getKaryas";
import { fetchKaryas } from "@/lib/api/karya";
import type { KaryaDetail } from "@/lib/api/types/karya";

jest.mock("@/lib/api/karya", () => ({
  fetchKaryas: jest.fn(),
}));

const mockedFetchKaryas = fetchKaryas as jest.MockedFunction<typeof fetchKaryas>;

describe("getAllKaryas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns real API karyas when available", async () => {
    const liveKaryas: KaryaDetail[] = [
      {
        id: "karya-live-1",
        title: "Smart Attendance RPL",
        slug: "smart-attendance-rpl",
        description: "Aplikasi absensi siswa berbasis QR.",
        creators: "XI RPL 1",
        category: "website",
        tech_stack: ["Next.js", "Laravel"],
        media_urls: ["https://cdn.example.com/attendance.png"],
        live_url: null,
        repo_url: null,
        is_featured: true,
        status: "published",
        votes_count: 12,
        created_at: null,
        updated_at: null,
        is_voted_by_me: "0",
      },
    ];

    mockedFetchKaryas.mockResolvedValueOnce(liveKaryas);

    const result = await getAllKaryas("website");

    expect(mockedFetchKaryas).toHaveBeenCalledWith({ category: "website" });
    expect(result).toEqual(liveKaryas);
  });

  it("returns empty array without fabricating dummy karya when API returns empty", async () => {
    mockedFetchKaryas.mockResolvedValueOnce([]);
    expect(await getAllKaryas()).toEqual([]);

    mockedFetchKaryas.mockResolvedValueOnce([]);
    expect(await getAllKaryas("game")).toEqual([]);

    mockedFetchKaryas.mockResolvedValueOnce([]);
    expect(await getAllKaryas("website")).toEqual([]);
  });

  it("returns empty array without fabricating dummy karya when API throws", async () => {
    mockedFetchKaryas.mockRejectedValueOnce(new Error("API unavailable"));

    const result = await getAllKaryas();

    expect(result).toEqual([]);
  });
});
