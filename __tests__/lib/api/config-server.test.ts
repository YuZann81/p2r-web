/**
 * @jest-environment node
 */
describe("Server-side API resolution (SSR / Node environment)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("resolves runtime P2R_API_BASE_URL when present", async () => {
    process.env.P2R_API_BASE_URL = "http://127.0.0.1:8090/p2r/v1";
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(getApiBaseUrl()).toBe("http://127.0.0.1:8090/p2r/v1");
  });

  it("throws explicit error when P2R_API_BASE_URL is missing during SSR", async () => {
    delete process.env.P2R_API_BASE_URL;
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(() => getApiBaseUrl()).toThrow(/Server-side API requests require P2R_API_BASE_URL/);
  });

  it("throws explicit error when P2R_API_BASE_URL is not an absolute URL", async () => {
    process.env.P2R_API_BASE_URL = "/api";
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(() => getApiBaseUrl()).toThrow(/not an absolute URL/);
  });
});
