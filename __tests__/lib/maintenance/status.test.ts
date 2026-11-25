import {
  fetchServerPlatformStatus,
  parsePlatformStatusPayload,
  resetLastKnownMaintenanceForTests,
  resolvePlatformStatus,
} from "@/lib/maintenance/status";

describe("Platform Maintenance Status Resolution", () => {
  const originalEnv = process.env.P2R_API_BASE_URL;

  beforeEach(() => {
    resetLastKnownMaintenanceForTests();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.P2R_API_BASE_URL;
    } else {
      process.env.P2R_API_BASE_URL = originalEnv;
    }
  });

  it("enforces the complete dual-state priority matrix", () => {
    // 1. Enabled + Healthy -> Scheduled Maintenance
    const enabledHealthy = resolvePlatformStatus({
      health: { ok: true, reachable: true, databaseConnected: true },
      settings: {
        ok: true,
        maintenanceEnabled: true,
        maintenanceMessage: "Pembaruan terjadwal",
        maintenanceSchedule: "22:00–23:00 WIB",
      },
      lastKnown: null,
    });
    expect(enabledHealthy.mode).toBe("scheduled_maintenance");
    expect(enabledHealthy.apiHealthy).toBe(true);
    expect(enabledHealthy.maintenance.enabled).toBe(true);
    expect(enabledHealthy.maintenance.source).toBe("live");

    // 2. Enabled + Unhealthy -> Scheduled Maintenance (manual takes precedence)
    const enabledUnhealthy = resolvePlatformStatus({
      health: { ok: false, reachable: true, databaseConnected: false },
      settings: {
        ok: true,
        maintenanceEnabled: true,
        maintenanceMessage: "Upgrade DB",
        maintenanceSchedule: "",
      },
      lastKnown: null,
    });
    expect(enabledUnhealthy.mode).toBe("scheduled_maintenance");
    expect(enabledUnhealthy.apiHealthy).toBe(false);

    // 3. Disabled + Healthy -> Normal
    const disabledHealthy = resolvePlatformStatus({
      health: { ok: true, reachable: true, databaseConnected: true },
      settings: {
        ok: true,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      },
      lastKnown: null,
    });
    expect(disabledHealthy.mode).toBe("normal");
    expect(disabledHealthy.apiHealthy).toBe(true);

    // 4. Disabled + Unhealthy -> System Degraded
    const disabledUnhealthy = resolvePlatformStatus({
      health: { ok: false, reachable: true, databaseConnected: false },
      settings: {
        ok: true,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      },
      lastKnown: null,
    });
    expect(disabledUnhealthy.mode).toBe("system_degraded");
    expect(disabledUnhealthy.apiHealthy).toBe(false);
  });

  it("falls back to system_degraded when API is unreachable on cold start", () => {
    const result = resolvePlatformStatus({
      health: { ok: false, reachable: false, databaseConnected: false },
      settings: {
        ok: false,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      },
      lastKnown: null,
    });

    expect(result.mode).toBe("system_degraded");
    expect(result.apiReachable).toBe(false);
    expect(result.maintenance.source).toBe("unknown");
  });

  it("retains scheduled_maintenance via last-known state if API briefly goes unreachable during active maintenance", () => {
    const result = resolvePlatformStatus({
      health: { ok: false, reachable: false, databaseConnected: false },
      settings: {
        ok: false,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      },
      lastKnown: {
        enabled: true,
        message: "Sedang upgrade server API.",
        schedule: "01:00–02:00 WIB",
        observedAt: "2026-11-21T10:00:00.000Z",
      },
    });

    expect(result.mode).toBe("scheduled_maintenance");
    expect(result.apiHealthy).toBe(false);
    expect(result.apiReachable).toBe(false);
    expect(result.maintenance.source).toBe("last_known");
    expect(result.maintenance.message).toBe("Sedang upgrade server API.");
  });

  it("never auto-disables manual maintenance when API recovers", async () => {
    process.env.P2R_API_BASE_URL = "http://api.test.local/api/v1";

    // First call: API healthy + manual maintenance enabled
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/health")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({
              status: "ok",
              database: "connected",
              version: "1.0.0",
            }),
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            data: {
              maintenance_enabled: true,
              maintenance_message: "Upgrade dunia P2R",
              maintenance_schedule: "Sabtu 01:00 WIB",
            },
          }),
      } as Response;
    }) as typeof fetch;

    const active = await fetchServerPlatformStatus();
    expect(active?.mode).toBe("scheduled_maintenance");

    // Second call: API temporarily unreachable during maintenance
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("ECONNREFUSED")) as typeof fetch;
    const unreachable = await fetchServerPlatformStatus();
    expect(unreachable?.mode).toBe("scheduled_maintenance");
    expect(unreachable?.maintenance.source).toBe("last_known");

    // Third call: API recovers healthy while manual maintenance is still enabled
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/health")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({ status: "ok", database: "connected" }),
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            data: {
              maintenance_enabled: true,
              maintenance_message: "Upgrade dunia P2R",
              maintenance_schedule: "Sabtu 01:00 WIB",
            },
          }),
      } as Response;
    }) as typeof fetch;

    const recoveredStillManual = await fetchServerPlatformStatus();
    expect(recoveredStillManual?.mode).toBe("scheduled_maintenance");
    expect(recoveredStillManual?.apiHealthy).toBe(true);
    expect(recoveredStillManual?.maintenance.source).toBe("live");
  });

  it("handles missing server API config safely according to allowMissingConfig", async () => {
    delete process.env.P2R_API_BASE_URL;

    expect(await fetchServerPlatformStatus({ allowMissingConfig: true })).toBeNull();

    const closed = await fetchServerPlatformStatus({ allowMissingConfig: false });
    expect(closed?.mode).toBe("system_degraded");
    expect(closed?.apiHealthy).toBe(false);
  });

  it("rejects non-conforming payloads so HTTP 200 HTML is never treated as healthy", () => {
    expect(parsePlatformStatusPayload(null)).toBeNull();
    expect(parsePlatformStatusPayload("<html>OK</html>")).toBeNull();
    expect(parsePlatformStatusPayload({ status: "ok" })).toBeNull();
    expect(parsePlatformStatusPayload({ mode: "unknown" })).toBeNull();
  });

  it("stays normal when /health confirms API and DB are healthy even if /settings transiently fails", () => {
    const result = resolvePlatformStatus({
      health: { ok: true, reachable: true, databaseConnected: true },
      settings: {
        ok: false,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      },
      lastKnown: null,
    });

    expect(result.mode).toBe("normal");
    expect(result.apiHealthy).toBe(true);
    expect(result.databaseConnected).toBe(true);
    expect(result.maintenance.enabled).toBe(false);
    expect(result.maintenance.source).toBe("unknown");
  });

  it("preserves last-known scheduled_maintenance if /settings transiently fails even when /health is ok", () => {
    const result = resolvePlatformStatus({
      health: { ok: true, reachable: true, databaseConnected: true },
      settings: {
        ok: false,
        maintenanceEnabled: false,
        maintenanceMessage: "",
        maintenanceSchedule: "",
      },
      lastKnown: {
        enabled: true,
        message: "Kalibrasi mesin arcade",
        schedule: "01:00–02:00 WIB",
        observedAt: "2026-11-25T02:00:00.000Z",
      },
    });

    expect(result.mode).toBe("scheduled_maintenance");
    expect(result.apiHealthy).toBe(true);
    expect(result.databaseConnected).toBe(true);
    expect(result.maintenance.source).toBe("last_known");
  });
});
