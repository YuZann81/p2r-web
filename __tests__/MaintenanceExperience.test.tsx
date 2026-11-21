import React from "react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MaintenanceExperience from "@/components/maintenance/MaintenanceExperience";
import PlatformStatusGuard from "@/components/maintenance/PlatformStatusGuard";
import type { PlatformStatus } from "@/lib/maintenance/status";

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

const DEGRADED_STATUS: PlatformStatus = {
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
  checkedAt: "2026-11-21T11:00:00.000Z",
};

const SCHEDULED_STATUS: PlatformStatus = {
  mode: "scheduled_maintenance",
  apiHealthy: true,
  apiReachable: true,
  databaseConnected: true,
  maintenance: {
    enabled: true,
    message: "We are calibrating the arcade cabinets.",
    schedule: "Sabtu, 22 Nov 2026 • 01:00–03:00 WIB",
    source: "live",
  },
  checkedAt: "2026-11-21T11:00:00.000Z",
};

const NORMAL_STATUS: PlatformStatus = {
  mode: "normal",
  apiHealthy: true,
  apiReachable: true,
  databaseConnected: true,
  maintenance: {
    enabled: false,
    message: "",
    schedule: "",
    source: "live",
  },
  checkedAt: "2026-11-21T11:05:00.000Z",
};

describe("Dual-State Pixel-Art Maintenance Experience", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders reference-matched System Degraded UI using P2R typography, no logo image, and crisp pixel-art diorama", () => {
    const onRetry = jest.fn();
    render(
      <MaintenanceExperience
        status={DEGRADED_STATUS}
        isChecking={false}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("PIXEL TO REALITY")).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("SYSTEM DEGRADED")).toBeInTheDocument();
    expect(
      screen.getByText("The arcade servers are temporarily offline."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /robot teknisi memperbaiki mesin arcade/i,
      }),
    ).toHaveAttribute("shape-rendering", "crispEdges");

    const retryBtn = screen.getByRole("button", { name: /^retry$/i });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders reference-matched Scheduled Maintenance UI with custom message and schedule", () => {
    const onRetry = jest.fn();
    render(
      <MaintenanceExperience
        status={SCHEDULED_STATUS}
        isChecking={false}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("PIXEL TO REALITY")).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("UNDER MAINTENANCE")).toBeInTheDocument();
    expect(
      screen.getByText("We are calibrating the arcade cabinets."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sabtu, 22 Nov 2026 • 01:00–03:00 WIB"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /peningkatan dan pemeliharaan terjadwal mesin arcade/i,
      }),
    ).toHaveAttribute("shape-rendering", "crispEdges");
    expect(
      screen.getByRole("button", { name: /^retry$/i }),
    ).toBeInTheDocument();
  });

  it("recovers automatically from System Degraded when /api/platform-status reports normal", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => NORMAL_STATUS,
    }) as typeof fetch;

    render(
      <PlatformStatusGuard initialStatus={DEGRADED_STATUS}>
        <div>Konten Utama P2R</div>
      </PlatformStatusGuard>,
    );

    expect(screen.getByText("SYSTEM DEGRADED")).toBeInTheDocument();
    expect(screen.queryByText("Konten Utama P2R")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^retry$/i }));

    await waitFor(() => {
      expect(screen.getByText("Konten Utama P2R")).toBeInTheDocument();
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it("stays in Scheduled Maintenance even when API is healthy until Super Admin disables it", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => SCHEDULED_STATUS,
    }) as typeof fetch;

    render(
      <PlatformStatusGuard initialStatus={SCHEDULED_STATUS}>
        <div>Konten Utama P2R</div>
      </PlatformStatusGuard>,
    );

    fireEvent.click(screen.getByRole("button", { name: /^retry$/i }));

    await waitFor(() => {
      expect(screen.getByText("UNDER MAINTENANCE")).toBeInTheDocument();
    });
    expect(screen.queryByText("Konten Utama P2R")).not.toBeInTheDocument();
  });

  it("does not treat a generic HTTP 200 invalid JSON response as healthy API state", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError("Unexpected token <");
      },
    }) as typeof fetch;

    render(
      <PlatformStatusGuard initialStatus={DEGRADED_STATUS}>
        <div>Konten Utama P2R</div>
      </PlatformStatusGuard>,
    );

    fireEvent.click(screen.getByRole("button", { name: /^retry$/i }));

    await waitFor(() => {
      expect(screen.getByText("SYSTEM DEGRADED")).toBeInTheDocument();
    });
    expect(screen.queryByText("Konten Utama P2R")).not.toBeInTheDocument();
  });

  it("disables pixel-art maintenance animations under prefers-reduced-motion", () => {
    const css = readFileSync(
      path.resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".p2r-anim-wrench");
    expect(css).toContain(".p2r-anim-led");
    expect(css).toContain(".p2r-anim-eye");
    expect(css).toContain(".p2r-anim-core");
    expect(css).toContain("animation: none !important");
  });
});
