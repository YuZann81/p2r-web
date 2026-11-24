/**
 * Resolves a safe local/dev proxy target for `/api/v1/*` when running `next dev`.
 * Returns `null` in production builds or when `P2R_API_BASE_URL` is absent/invalid
 * so Next.js never silently falls back to production and standalone Caddy routing
 * remains completely unchanged.
 */
function resolveDevApiProxyBase() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const raw = process.env.P2R_API_BASE_URL?.trim();
  if (!raw) {
    return null;
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return raw.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const devApiBase = resolveDevApiProxyBase();
    if (!devApiBase) {
      return [];
    }

    return [
      {
        source: "/api/v1/:path*",
        destination: `${devApiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
