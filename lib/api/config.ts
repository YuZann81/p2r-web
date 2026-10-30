/**
 * API base URL resolution.
 *
 * This module is reached from BOTH the browser and the Node server:
 *
 *  - Browser: six `use client` components (FeedsStream, KaryaDirectory,
 *    MerchandiseCatalog, MerchandiseDetailModal, MerchandiseSection,
 *    VoteButton) pull it in through `lib/api/client.ts`.
 *  - Server: 33 server-side modules use the same path for server components,
 *    ISR regeneration and route handlers.
 *
 * The two sides legitimately need different values, so both are configured
 * explicitly and neither is guessed:
 *
 *  - NEXT_PUBLIC_P2R_API_BASE_URL (BUILD time, browser). Inlined into the
 *    client bundle, so it must be an absolute URL the browser can resolve.
 *  - P2R_API_BASE_URL (RUNTIME, server only). Deliberately NOT prefixed with
 *    NEXT_PUBLIC_, so Next.js leaves it as a runtime lookup and it can never
 *    reach the bundle. It may point at an internal address.
 *
 * There is intentionally NO default host. A silent fallback to localhost, a
 * container name, or a retired domain silently ships a broken bundle: the
 * page builds fine and fails only at request time. Failing loudly at first
 * use is the intended behaviour.
 *
 * NEXT_PUBLIC_* is only inlined when referenced statically, so both reads
 * below are deliberately written as full static property accesses.
 */

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_P2R_API_BASE_URL?.trim();
const SERVER_API_BASE_URL = process.env.P2R_API_BASE_URL?.trim();

/**
 * Validates a configured base URL and strips any trailing slash.
 *
 * Returns undefined when nothing is configured, so the caller can report one
 * clear error instead of failing with an opaque parse error.
 *
 * @throws if a value is present but is not an absolute http(s) URL.
 */
function normalizeBaseUrl(name: string, value: string | undefined): string | undefined {
  if (!value) return undefined;

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `[p2r-api] ${name} is set but is not an absolute URL. ` +
        'Use a full origin including the scheme, e.g. "https://example.com/p2r/v1".',
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `[p2r-api] ${name} must use http: or https:, received "${parsed.protocol}".`,
    );
  }

  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const browserSide = normalizeBaseUrl(
    "NEXT_PUBLIC_P2R_API_BASE_URL",
    PUBLIC_API_BASE_URL,
  );
  const serverSide = normalizeBaseUrl("P2R_API_BASE_URL", SERVER_API_BASE_URL);

  // On the server the internal address is preferred because it never leaves
  // the private network. In the browser the build-time public value is the only
  // one that exists.
  const resolved =
    typeof window === "undefined" ? (serverSide ?? browserSide) : browserSide;

  if (!resolved) {
    throw new Error(
      "[p2r-api] No API base URL is configured, so no host will be assumed. " +
        "Set NEXT_PUBLIC_P2R_API_BASE_URL at BUILD time for browser requests, " +
        "and P2R_API_BASE_URL at RUNTIME to let server-side requests use an " +
        "internal address. See .env.example.",
    );
  }

  return resolved;
}
