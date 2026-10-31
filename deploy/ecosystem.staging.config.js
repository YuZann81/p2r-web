// ===========================================================================
// P2R STAGING PM2 definition — p2r-web
//
// Distinct from every other process on the host:
//   * name  -> p2r-web-staging (never reloads p2r-web, p2r-api-staging or
//              p2r-panel-staging)
//   * port  -> 127.0.0.1:3004 (staging only, loopback only; 3003 is the Panel)
//   * node  -> pinned upstream v24 runtime under shared/web/runtime
//   * root  -> /var/www/staging/pixel2reality
//   * logs  -> staging logs dir
//
// TWO API VALUES, and they are not interchangeable:
//   P2R_API_BASE_URL  (RUNTIME, server only) — read by lib/api/config.ts in
//                     server components, ISR regeneration and route handlers.
//                     Deliberately NOT prefixed with NEXT_PUBLIC_, so it is a
//                     runtime lookup and never reaches the browser bundle.
//   NEXT_PUBLIC_P2R_API_BASE_URL is NOT set here: it is inlined at BUILD time
//                     by `next build` and therefore belongs to the artifact.
//
// No *.env file is read: the standalone server only sees the environment it is
// started with, which keeps this process's configuration in one reviewed place.
// ===========================================================================
const ROOT = "/var/www/staging/pixel2reality";

module.exports = {
  apps: [
    {
      name: "p2r-web-staging",
      script: "server.js",
      interpreter: `${ROOT}/shared/web/runtime/bin/node`,
      interpreter_args: "",
      cwd: `${ROOT}/apps/web/current`,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      out_file: `${ROOT}/logs/web/out.log`,
      error_file: `${ROOT}/logs/web/error.log`,
      merge_logs: true,
      env: {
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
        // Loopback only: no public staging routing exists yet, and Caddy is not
        // touched in this phase.
        HOSTNAME: "127.0.0.1",
        PORT: "3004",
        // Staging API on the same host. The /api/v1 prefix is part of the API
        // contract and is appended by the application, not by a proxy.
        P2R_API_BASE_URL: "http://127.0.0.1:8091/api/v1",
      },
    },
  ],
};
