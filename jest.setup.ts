import "@testing-library/jest-dom";

// Test-only scaffolding, required by lib/api/config.ts.
//
// That module deliberately refuses to assume an API host and throws when
// NEXT_PUBLIC_P2R_API_BASE_URL is unset, so tests that drive the API client
// directly (e.g. __tests__/lib/api/client.test.ts) must supply one. Next.js
// does not load .env.local when NODE_ENV=test, so it cannot come from there.
//
// The host below uses the reserved .invalid TLD (RFC 2606), so it can never
// resolve to a real service even if a stray request escaped the fetch mock.
// This is NOT a production fallback: real values are injected at build time by
// CI and by Docker Compose.
process.env.NEXT_PUBLIC_P2R_API_BASE_URL ??= "http://api.test.invalid/p2r/v1";
