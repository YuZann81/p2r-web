import { act, render, screen } from "@testing-library/react";
import P2RVoltSection from "@/components/P2RVoltSection";

describe("P2RVoltSection Full-Screen Countdown -> Borderless Full-Hand Gate (Scrollable Page)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders full-screen countdown while keeping page sections scrollable below, then transitions to borderless full-hand verification at 00", () => {
    render(
      <P2RVoltSection
        initialSeconds={2}
        unlockedContent={<div>Konten Pameran Scrollable</div>}
      />,
    );

    const section = screen.getByRole("region", {
      name: /halaman launch & verifikasi p2r/i,
    });
    expect(section).toHaveClass("min-h-[calc(100dvh-4.25rem)]");

    expect(screen.getByText("COUNTDOWN TO LAUNCH")).toBeInTheDocument();
    expect(screen.getByText("MENUJU PEMBUKAAN")).toBeInTheDocument();
    expect(screen.getByText("PAMERAN")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();

    // Sections below countdown stay mounted so users can scroll down and up freely
    expect(screen.getByText("Konten Pameran Scrollable")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("01")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("COUNTDOWN TO LAUNCH")).not.toBeInTheDocument();
    expect(screen.getByTestId("launch-stage-container")).toHaveAttribute(
      "data-borderless",
      "true",
    );
    expect(
      screen.getByText("VERIFICATION PLAY • TAHAP 1 / 6"),
    ).toBeInTheDocument();
    expect(screen.getByText("Konten Pameran Scrollable")).toBeInTheDocument();
  });
});
