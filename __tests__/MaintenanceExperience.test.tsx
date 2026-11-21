import React from "react";
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
    message: "Kami sedang meningkatkan performa pameran Pixels to Reality.",
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

  it("renders crisp pixel-art System Degraded scene with Indonesian recovery copy and retry action", () => {
    const onRetry = jest.fn();
    render(
      <MaintenanceExperience
        status={DEGRADED_STATUS}
        isChecking={false}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("Gangguan Sistem")).toBeInTheDocument();
    expect(screen.getByText("Layanan Sedang Dipulihkan")).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /robot teknisi P2R sedang memperbaiki terminal komputer/i,
      }),
    ).toHaveAttribute("shape-rendering", "crispEdges");

    const retryBtn = screen.getByRole("button", { name: /coba lagi/i });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders crisp pixel-art Scheduled Maintenance scene with custom message and schedule", () => {
    const onRetry = jest.fn();
    render(
      <MaintenanceExperience
        status={SCHEDULED_STATUS}
        isChecking={false}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("Pemeliharaan Terjadwal")).toBeInTheDocument();
    expect(
      screen.getByText("Dunia P2R Sedang Ditingkatkan"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Kami sedang meningkatkan performa pameran Pixels to Reality.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sabtu, 22 Nov 2026 • 01:00–03:00 WIB"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /konstruksi dan peningkatan dunia Pixels to Reality/i,
      }),
    ).toHaveAttribute("shape-rendering", "crispEdges");
    expect(
      screen.getByRole("button", { name: /periksa status/i }),
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

    expect(screen.getByText("Layanan Sedang Dipulihkan")).toBeInTheDocument();
    expect(screen.queryByText("Konten Utama P2R")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /coba lagi/i }));

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

    fireEvent.click(screen.getByRole("button", { name: /periksa status/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Dunia P2R Sedang Ditingkatkan"),
      ).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole("button", { name: /coba lagi/i }));

    await waitFor(() => {
      expect(screen.getByText("Layanan Sedang Dipulihkan")).toBeInTheDocument();
    });
    expect(screen.queryByText("Konten Utama P2R")).not.toBeInTheDocument();
  });
});
