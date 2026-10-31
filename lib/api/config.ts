/**
 * API base URL resolution.
 *
 * This module is reached from BOTH the browser and the Node server:
 *
 *  - Browser: client components (FeedsStream, KaryaDirectory,
 *    MerchandiseCatalog, MerchandiseDetailModal, MerchandiseSection,
 *    VoteButton, LoginPage, AuthProvider) pull it in through `lib/api/client.ts`.
 *    In the browser, requests default to the same-origin relative path `/api/v1`
 *    (routed directly by reverse proxy / Caddy to Laravel `/api/v1/*`). This allows
 *    the exact same build artifact to run across validation hosts and production
 *    without baking an environment-specific origin into the client bundle.
 *
 *  - Server: server components, ISR regeneration, and route handlers.
 *    On the server, requests resolve `process.env.P2R_API_BASE_URL` at runtime.
 *    This must be an explicit absolute URL (e.g. `http://127.0.0.1:8090/api/v1`).
 *    It is never exposed to browser bundles, never guessed, and never falls back
 *    to a browser URL.
 */

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_P2R_API_BASE_URL?.trim();

const DEFAULT_BROWSER_API_PATH = "/api/v1";

/**
 * Validates a configured server-side base URL and strips any trailing slash.
 *
 * @throws if a value is missing or is not an absolute http(s) URL.
 */
function normalizeServerApiUrl(value: string | undefined): string {
  if (!value || value === "") {
    throw new Error(
      "[p2r-api] Server-side API requests require P2R_API_BASE_URL in the runtime environment. " +
        'Set P2R_API_BASE_URL to an absolute URL (e.g. "http://127.0.0.1:8090/api/v1").',
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      "[p2r-api] P2R_API_BASE_URL is set but is not an absolute URL. " +
        'Use a full origin including the scheme, e.g. "http://127.0.0.1:8090/api/v1".',
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `[p2r-api] P2R_API_BASE_URL must use http: or https:, received "${parsed.protocol}".`,
    );
  }

  return value.replace(/\/+$/, "");
}

/**
 * Resolves the browser-side API base.
 *
 * Defaults to the same-origin relative path `/api/v1`.
 * If an explicit override is supplied via NEXT_PUBLIC_P2R_API_BASE_URL:
 *  - If it is a relative path (e.g. `/api/v1`), strips trailing slashes and returns it.
 *  - If it is an absolute URL (e.g. in test or dev harness), validates scheme and returns it.
 */
function resolveBrowserApiBase(value: string | undefined): string {
  if (!value || value === "") {
    return DEFAULT_BROWSER_API_PATH;
  }

  if (value.startsWith("/")) {
    return value.replace(/\/+$/, "") || DEFAULT_BROWSER_API_PATH;
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(`invalid protocol ${parsed.protocol}`);
    }
    return value.replace(/\/+$/, "");
  } catch {
    throw new Error(
      `[p2r-api] NEXT_PUBLIC_P2R_API_BASE_URL must be a relative path (e.g. "/api/v1") or an absolute http(s) URL, received "${value}".`,
    );
  }
}

export function getApiBaseUrl(): string {
  // Never access window at module initialization or during SSR.
  if (typeof window === "undefined") {
    // Read at runtime dynamically on the server
    const serverUrl = process.env.P2R_API_BASE_URL?.trim();
    return normalizeServerApiUrl(serverUrl);
  }

  return resolveBrowserApiBase(PUBLIC_API_BASE_URL);
}
