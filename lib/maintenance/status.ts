/**
 * Canonical dual-state platform status resolution for P2R Web.
 *
 * Source of truth:
 *  - API / database health: `GET ${P2R_API_BASE_URL}/health`
 *  - Manual Scheduled Maintenance: `GET ${P2R_API_BASE_URL}/settings`
 *    (`site_settings`: `maintenance_enabled`, `maintenance_message`,
 *    `maintenance_schedule`, managed exclusively by Super Admin via Panel).
 *
 * Priority rules:
 *  1. Manual Maintenance Enabled + API Healthy   -> `scheduled_maintenance`
 *  2. Manual Maintenance Enabled + API Unhealthy -> `scheduled_maintenance`
 *  3. Manual Maintenance Disabled + API Healthy  -> `normal`
 *  4. Manual Maintenance Disabled + API Unhealthy -> `system_degraded`
 *
 * API-unreachable behavior (documented limitation):
 *  P2R Web runs as a stateless Next.js standalone server without its own
 *  database or Redis instance. To avoid inventing a competing source of truth
 *  while still preventing a planned API/DB restart during active Scheduled
 *  Maintenance from flashing a System Degraded crash screen, this module keeps
 *  a volatile, in-process `lastKnownMaintenance` snapshot updated whenever
 *  `GET /settings` succeeds:
 *   - If `/settings` fails AND `lastKnownMaintenance.enabled === true`, Web
 *     continues to display `scheduled_maintenance` (`source: "last_known"`).
 *   - If `/settings` fails on a cold start (`lastKnownMaintenance === null`)
 *     or when the last observed setting was disabled, Web fails safe to
 *     `system_degraded` (`source: "unknown"` or `"last_known"`).
 *   - Limitation: because this snapshot is volatile per Node.js process, if
 *     P2R Web itself restarts while the API is completely unreachable, Web
 *     cannot verify manual maintenance and safely falls back to
 *     `system_degraded` until the API responds again.
 */

export type PlatformMode =
  | "normal"
  | "scheduled_maintenance"
  | "system_degraded";

export type MaintenanceSource = "live" | "last_known" | "unknown";

export interface PlatformStatus {
  mode: PlatformMode;
  apiHealthy: boolean;
  apiReachable: boolean;
  databaseConnected: boolean;
  maintenance: {
    enabled: boolean;
    message: string;
    schedule: string;
    source: MaintenanceSource;
  };
  checkedAt: string;
}

export interface HealthProbeResult {
  ok: boolean;
  reachable: boolean;
  databaseConnected: boolean;
}

export interface SettingsProbeResult {
  ok: boolean;
  maintenanceEnabled: boolean;
  maintenanceMessage: string;
  maintenanceSchedule: string;
}

export interface LastKnownMaintenance {
  enabled: boolean;
  message: string;
  schedule: string;
  observedAt: string;
}

const PROBE_TIMEOUT_MS = 4000;

let lastKnownMaintenance: LastKnownMaintenance | null = null;

export function toSettingBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
  }
  return false;
}

export function resetLastKnownMaintenanceForTests(): void {
  lastKnownMaintenance = null;
}

export function getLastKnownMaintenance(): LastKnownMaintenance | null {
  return lastKnownMaintenance ? { ...lastKnownMaintenance } : null;
}

export function setLastKnownMaintenanceForTests(
  snapshot: LastKnownMaintenance | null,
): void {
  lastKnownMaintenance = snapshot ? { ...snapshot } : null;
}

/**
 * Pure deterministic state resolution implementing the priority matrix and
 * API-unreachable fallback rules.
 */
export function resolvePlatformStatus(params: {
  health: HealthProbeResult;
  settings: SettingsProbeResult;
  lastKnown: LastKnownMaintenance | null;
  checkedAt?: string;
}): PlatformStatus {
  const checkedAt = params.checkedAt ?? new Date().toISOString();
  const { health, settings, lastKnown } = params;

  if (settings.ok) {
    if (settings.maintenanceEnabled) {
      return {
        mode: "scheduled_maintenance",
        apiHealthy: health.ok,
        apiReachable: health.reachable,
        databaseConnected: health.databaseConnected,
        maintenance: {
          enabled: true,
          message: settings.maintenanceMessage,
          schedule: settings.maintenanceSchedule,
          source: "live",
        },
        checkedAt,
      };
    }

    return {
      mode: health.ok ? "normal" : "system_degraded",
      apiHealthy: health.ok,
      apiReachable: health.reachable,
      databaseConnected: health.databaseConnected,
      maintenance: {
        enabled: false,
        message: settings.maintenanceMessage,
        schedule: settings.maintenanceSchedule,
        source: "live",
      },
      checkedAt,
    };
  }

  // Canonical settings could not be fetched (API unreachable, timeout, or transient error).
  if (lastKnown?.enabled) {
    return {
      mode: "scheduled_maintenance",
      apiHealthy: health.ok,
      apiReachable: health.reachable,
      databaseConnected: health.databaseConnected,
      maintenance: {
        enabled: true,
        message: lastKnown.message,
        schedule: lastKnown.schedule,
        source: "last_known",
      },
      checkedAt,
    };
  }

  // If `/health` confirms the API and database are healthy, a transient
  // `/settings` failure must not take down the public homepage.
  if (health.ok) {
    return {
      mode: "normal",
      apiHealthy: true,
      apiReachable: health.reachable,
      databaseConnected: health.databaseConnected,
      maintenance: {
        enabled: false,
        message: lastKnown?.message ?? "",
        schedule: lastKnown?.schedule ?? "",
        source: lastKnown ? "last_known" : "unknown",
      },
      checkedAt,
    };
  }

  return {
    mode: "system_degraded",
    apiHealthy: false,
    apiReachable: health.reachable,
    databaseConnected: health.databaseConnected,
    maintenance: {
      enabled: false,
      message: "",
      schedule: "",
      source: lastKnown ? "last_known" : "unknown",
    },
    checkedAt,
  };
}

/**
 * Validates whether an untrusted JSON payload from `/api/platform-status`
 * conforms to the PlatformStatus contract. Prevents a generic HTTP 200 HTML
 * response or malformed payload from ever being mistaken for healthy API state.
 */
export function parsePlatformStatusPayload(
  payload: unknown,
): PlatformStatus | null {
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as Record<string, unknown>;
  const mode = candidate.mode;
  if (
    mode !== "normal" &&
    mode !== "scheduled_maintenance" &&
    mode !== "system_degraded"
  ) {
    return null;
  }
  if (
    typeof candidate.apiHealthy !== "boolean" ||
    typeof candidate.apiReachable !== "boolean" ||
    typeof candidate.databaseConnected !== "boolean"
  ) {
    return null;
  }
  const maintenance = candidate.maintenance as
    | Record<string, unknown>
    | undefined;
  if (!maintenance || typeof maintenance !== "object") return null;
  if (typeof maintenance.enabled !== "boolean") return null;
  const source = maintenance.source;
  if (source !== "live" && source !== "last_known" && source !== "unknown") {
    return null;
  }

  return {
    mode,
    apiHealthy: candidate.apiHealthy,
    apiReachable: candidate.apiReachable,
    databaseConnected: candidate.databaseConnected,
    maintenance: {
      enabled: maintenance.enabled,
      message: typeof maintenance.message === "string" ? maintenance.message : "",
      schedule:
        typeof maintenance.schedule === "string" ? maintenance.schedule : "",
      source,
    },
    checkedAt:
      typeof candidate.checkedAt === "string"
        ? candidate.checkedAt
        : new Date().toISOString(),
  };
}

export function buildDegradedFallbackStatus(
  checkedAt = new Date().toISOString(),
): PlatformStatus {
  return {
    mode: "system_degraded",
    apiHealthy: false,
    apiReachable: false,
    databaseConnected: false,
    maintenance: {
      enabled: false,
      message: "",
      schedule: "",
      source: "unknown",
    },
    checkedAt,
  };
}

async function fetchJsonWithTimeout(
  url: string,
  timeoutMs = PROBE_TIMEOUT_MS,
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    const text = await res.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    return { ok: res.ok, status: res.status, data: parsed };
  } finally {
    clearTimeout(timer);
  }
}

async function probeHealth(apiBase: string): Promise<HealthProbeResult> {
  try {
    const res = await fetchJsonWithTimeout(`${apiBase}/health`);
    if (!res.ok || !res.data || typeof res.data !== "object") {
      return { ok: false, reachable: true, databaseConnected: false };
    }
    const body = res.data as Record<string, unknown>;
    const databaseConnected = body.database === "connected";
    const statusOk = body.status === "ok" && databaseConnected;
    return { ok: statusOk, reachable: true, databaseConnected };
  } catch {
    return { ok: false, reachable: false, databaseConnected: false };
  }
}

async function probeSettings(apiBase: string): Promise<SettingsProbeResult> {
  try {
    const res = await fetchJsonWithTimeout(`${apiBase}/settings`);
    if (!res.ok || !res.data || typeof res.data !== "object") {
      return {
        ok: false,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      };
    }
    const envelope = res.data as Record<string, unknown>;
    if (envelope.success === false) {
      return {
        ok: false,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      };
    }
    const payload =
      envelope.data && typeof envelope.data === "object"
        ? (envelope.data as Record<string, unknown>)
        : envelope;

    return {
      ok: true,
      maintenanceEnabled: toSettingBool(payload.maintenance_enabled),
      maintenanceMessage:
        typeof payload.maintenance_message === "string"
          ? payload.maintenance_message.trim()
          : "",
      maintenanceSchedule:
        typeof payload.maintenance_schedule === "string"
          ? payload.maintenance_schedule.trim()
          : "",
    };
  } catch {
    return {
      ok: false,
      maintenanceEnabled: false,
      maintenanceMessage: "",
      maintenanceSchedule: "",
    };
  }
}

function resolveConfiguredServerApiBase(): string | null {
  const raw = process.env.P2R_API_BASE_URL?.trim();
  if (!raw) return null;
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

/**
 * Probes the canonical API `/health` and `/settings` endpoints from the
 * Next.js server process.
 *
 * When `allowMissingConfig` is true (used by RootLayout during static build or
 * unconfigured test runs), returns `null` if `P2R_API_BASE_URL` is absent.
 * Otherwise fails closed to `system_degraded`.
 */
export async function fetchServerPlatformStatus(options?: {
  allowMissingConfig?: boolean;
}): Promise<PlatformStatus | null> {
  const apiBase = resolveConfiguredServerApiBase();
  if (!apiBase) {
    return options?.allowMissingConfig ? null : buildDegradedFallbackStatus();
  }

  const [health, settings] = await Promise.all([
    probeHealth(apiBase),
    probeSettings(apiBase),
  ]);

  const checkedAt = new Date().toISOString();
  if (settings.ok) {
    lastKnownMaintenance = {
      enabled: settings.maintenanceEnabled,
      message: settings.maintenanceMessage,
      schedule: settings.maintenanceSchedule,
      observedAt: checkedAt,
    };
  }

  return resolvePlatformStatus({
    health,
    settings,
    lastKnown: lastKnownMaintenance,
    checkedAt,
  });
}
