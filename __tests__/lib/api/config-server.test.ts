/**
 * @jest-environment node
 */
import path from "node:path";
import { pathToFileURL } from "node:url";

describe("Server-side API resolution (SSR / Node environment)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("resolves runtime P2R_API_BASE_URL for local development (8091) and production (8090)", async () => {
    process.env.P2R_API_BASE_URL = "http://127.0.0.1:8091/api/v1/";
    const { getApiBaseUrl: getLocal } = await import("@/lib/api/config");
    expect(getLocal()).toBe("http://127.0.0.1:8091/api/v1");

    jest.resetModules();
    process.env.P2R_API_BASE_URL = "http://127.0.0.1:8090/api/v1";
    const { getApiBaseUrl: getProd } = await import("@/lib/api/config");
    expect(getProd()).toBe("http://127.0.0.1:8090/api/v1");
  });

  it("throws explicit error when P2R_API_BASE_URL is missing during SSR (never falls back to production)", async () => {
    delete process.env.P2R_API_BASE_URL;
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(() => getApiBaseUrl()).toThrow(/Server-side API requests require P2R_API_BASE_URL/);
  });

  it("throws explicit error when P2R_API_BASE_URL is not an absolute URL", async () => {
    process.env.P2R_API_BASE_URL = "/api";
    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(() => getApiBaseUrl()).toThrow(/not an absolute URL/);
  });

  it("warns in development if P2R_API_BASE_URL points to production host", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      configurable: true,
    });
    process.env.P2R_API_BASE_URL = "https://pameran.devsaka.id/api/v1";

    const { getApiBaseUrl } = await import("@/lib/api/config");
    expect(getApiBaseUrl()).toBe("https://pameran.devsaka.id/api/v1");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/points to production host "pameran\.devsaka\.id"/i),
    );
  });

  it("configures dev-only /api/v1 rewrite in next.config.mjs without affecting production or falling back when unset", async () => {
    const configUrl = pathToFileURL(
      path.join(process.cwd(), "next.config.mjs"),
    ).href;
    const mod = await import(configUrl);
    const nextConfig = mod.default;

    // Development + local API configured -> proxy /api/v1/* to local API
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      configurable: true,
    });
    process.env.P2R_API_BASE_URL = "http://127.0.0.1:8091/api/v1/";
    expect(await nextConfig.rewrites()).toEqual([
      {
        source: "/api/v1/:path*",
        destination: "http://127.0.0.1:8091/api/v1/:path*",
      },
    ]);

    // Development + production API configured -> proxy /api/v1/* to configured API base URL
    process.env.P2R_API_BASE_URL = "https://pameran.devsaka.id/api/v1";
    expect(await nextConfig.rewrites()).toEqual([
      {
        source: "/api/v1/:path*",
        destination: "https://pameran.devsaka.id/api/v1/:path*",
      },
    ]);

    // Development + P2R_API_BASE_URL unset -> no rewrite (never falls back to production)
    delete process.env.P2R_API_BASE_URL;
    expect(await nextConfig.rewrites()).toEqual([]);

    // Production -> no Next.js rewrite (Caddy owns /api/v1/*)
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      configurable: true,
    });
    process.env.P2R_API_BASE_URL = "http://127.0.0.1:8090/api/v1";
    expect(await nextConfig.rewrites()).toEqual([]);
  });
});
