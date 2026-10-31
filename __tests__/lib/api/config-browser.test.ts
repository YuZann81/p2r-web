/**
 * @jest-environment jsdom
 */
describe("Browser-side API resolution (jsdom environment)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("defaults to same-origin /api/v1 when NEXT_PUBLIC_P2R_API_BASE_URL is unset", async () => {
    delete process.env.NEXT_PUBLIC_P2R_API_BASE_URL;
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(getApiBaseUrl()).toBe("/api/v1");
  });

  it("defaults to /api/v1 when NEXT_PUBLIC_P2R_API_BASE_URL is empty string", async () => {
    process.env.NEXT_PUBLIC_P2R_API_BASE_URL = "   ";
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(getApiBaseUrl()).toBe("/api/v1");
  });

  it("accepts a relative path like /api/v1 and strips trailing slash", async () => {
    process.env.NEXT_PUBLIC_P2R_API_BASE_URL = "/api/v1/";
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(getApiBaseUrl()).toBe("/api/v1");
  });

  it("accepts an absolute http/https URL if explicitly provided for local testing", async () => {
    process.env.NEXT_PUBLIC_P2R_API_BASE_URL = "https://custom-proxy.test/api/v1";
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(getApiBaseUrl()).toBe("https://custom-proxy.test/api/v1");
  });

  it("builds relative API URLs with search parameters without throwing", async () => {
    delete process.env.NEXT_PUBLIC_P2R_API_BASE_URL;
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true, data: [] })),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { apiGet } = await import("@/lib/api/client");
    await apiGet("/karyas", { searchParams: { category: "web", limit: 10 } });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/karyas?category=web&limit=10",
      expect.anything(),
    );
  });
});
