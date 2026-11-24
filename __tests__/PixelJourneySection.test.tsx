import { act, render, screen } from "@testing-library/react";
import gsap from "gsap";
import P2RVoltSection from "@/components/P2RVoltSection";
import {
  ExhibitionCountdownSection,
  PixelEnergyTrail,
  TimelineToLaunchPortal,
} from "@/components/PixelJourneySection";
import { EXHIBITION_LAUNCH_LABEL } from "@/lib/countdown";

function mockMatchMedia(matchesByQuery: Record<string, boolean>) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: Boolean(matchesByQuery[query]),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

const EXPECTED_PARAGRAPH_1 =
  "Pixel To Reality (P2R) merupakan pameran tahunan karya siswa jurusan Rekayasa Perangkat Lunak (RPL). Event ini menjadi wadah apresiasi untuk memamerkan produk inovasi teknologi, game retro interaktif, aplikasi web, dan sistem cerdas yang siap bersaing di industri digital.";

const EXPECTED_PARAGRAPH_2 =
  "Melalui pameran interaktif ini, pengunjung dapat mencoba langsung puluhan project, memberikan dukungan voting kepada karya favorit, serta bertanding mencetak skor tertinggi di turnamen arcade live.";

describe("Redesigned Exhibition Information (P2RVoltSection) and Launch Countdown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockMatchMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(min-width: 768px)": true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders TENTANG PIXEL TO REALITY with exact verbatim copy, 4 feature labels, and removes P2R VOLT 1 & secondary timer", () => {
    jest.setSystemTime(new Date("2026-11-24T08:00:00+07:00"));

    const { container } = render(
      <>
        <PixelEnergyTrail />
        <P2RVoltSection />
        <TimelineToLaunchPortal />
        <ExhibitionCountdownSection />
      </>,
    );

    const trail = screen.getByTestId("pixel-energy-trail");
    const infoSection = container.querySelector("#information");
    const portal = screen.getByTestId("timeline-to-launch-portal");
    const countdownSection = container.querySelector("#countdown");

    expect(trail).toBeInTheDocument();
    expect(infoSection).toBeInTheDocument();
    expect(portal).toBeInTheDocument();
    expect(countdownSection).toBeInTheDocument();

    // Exact DOM order preserved
    expect(
      trail.compareDocumentPosition(infoSection!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      infoSection!.compareDocumentPosition(portal) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      portal.compareDocumentPosition(countdownSection!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    // Renamed heading
    const infoHeading = container.querySelector("#exhibition-info-heading");
    expect(infoHeading).toHaveTextContent(/TENTANG/i);
    expect(infoHeading).toHaveTextContent(/PIXEL TO REALITY/i);

    // Removed legacy heading & secondary fake timer
    expect(screen.queryByText(/P2R VOLT 1/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/SESI PAMERAN & TURNAMEN/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Waktu menuju penutupan sesi pameran/i),
    ).not.toBeInTheDocument();

    // Exact verbatim paragraph equality (whitespace-normalized)
    const paragraphs = Array.from(infoSection!.querySelectorAll("p")).map((p) =>
      (p.textContent ?? "").replace(/\s+/g, " ").trim(),
    );
    expect(paragraphs).toEqual([EXPECTED_PARAGRAPH_1, EXPECTED_PARAGRAPH_2]);

    // Exact 4 feature labels
    expect(screen.getByText("Pameran Interaktif")).toBeInTheDocument();
    expect(screen.getByText("Turnamen Arcade")).toBeInTheDocument();
    expect(screen.getByText("Voting Karya Publik")).toBeInTheDocument();
    expect(screen.getByText("Demo IoT & Hardware")).toBeInTheDocument();
    expect(screen.getByText(EXHIBITION_LAUNCH_LABEL)).toBeInTheDocument();
  });

  it("updates countdown dynamically once per second against 2026-11-26T08:00:00+07:00", () => {
    jest.setSystemTime(new Date("2026-11-24T08:00:00+07:00"));

    const { container } = render(<ExhibitionCountdownSection />);

    expect(
      container.querySelector('[data-countdown-unit="hari"]'),
    ).toHaveTextContent("02");
    expect(
      container.querySelector('[data-countdown-unit="jam"]'),
    ).toHaveTextContent("00");
    expect(
      container.querySelector('[data-countdown-unit="menit"]'),
    ).toHaveTextContent("00");
    expect(
      container.querySelector('[data-countdown-unit="detik"]'),
    ).toHaveTextContent("00");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(
      container.querySelector('[data-countdown-unit="hari"]'),
    ).toHaveTextContent("01");
    expect(
      container.querySelector('[data-countdown-unit="jam"]'),
    ).toHaveTextContent("23");
    expect(
      container.querySelector('[data-countdown-unit="menit"]'),
    ).toHaveTextContent("59");
    expect(
      container.querySelector('[data-countdown-unit="detik"]'),
    ).toHaveTextContent("59");
  });

  it("automatically replaces countdown with SESI PAMERAN when the WIB target timestamp is reached", () => {
    jest.setSystemTime(new Date("2026-11-26T07:59:59+07:00"));

    const { container } = render(<ExhibitionCountdownSection />);

    expect(
      container.querySelector('[data-countdown-unit="detik"]'),
    ).toHaveTextContent("01");
    expect(
      screen.queryByTestId("countdown-started-state"),
    ).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("countdown-started-state")).toBeInTheDocument();
    expect(screen.getAllByText("SESI PAMERAN").length).toBeGreaterThan(0);
    expect(
      container.querySelector('[data-countdown-unit="detik"]'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Jelajahi Karya" }),
    ).toHaveAttribute("href", "#karya-arcade");
  });

  it("renders SESI PAMERAN immediately on fresh mount/reload after deadline regardless of timezone offset", () => {
    // Equivalent to 2026-11-26 08:05:00 WIB expressed in UTC
    jest.setSystemTime(new Date("2026-11-26T01:05:00.000Z"));

    const { container } = render(<ExhibitionCountdownSection />);

    expect(screen.getByTestId("countdown-started-state")).toBeInTheDocument();
    expect(screen.getAllByText("SESI PAMERAN").length).toBeGreaterThan(0);
    expect(
      container.querySelector('[data-countdown-unit="hari"]'),
    ).not.toBeInTheDocument();
  });

  it("handles invalid target timestamps safely without crashing", () => {
    render(<ExhibitionCountdownSection targetIso="invalid-date" />);

    expect(
      screen.getByText(/Jadwal pembukaan pameran sedang diperbarui/i),
    ).toBeInTheDocument();
  });

  it("skips GSAP animations when prefers-reduced-motion is active", () => {
    jest.setSystemTime(new Date("2026-11-24T08:00:00+07:00"));
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });

    const toSpy = jest.spyOn(gsap, "to");
    const fromToSpy = jest.spyOn(gsap, "fromTo");

    render(
      <>
        <PixelEnergyTrail />
        <P2RVoltSection />
        <TimelineToLaunchPortal />
        <ExhibitionCountdownSection />
      </>,
    );

    expect(toSpy).not.toHaveBeenCalled();
    expect(fromToSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Pameran Interaktif")).toBeVisible();
    expect(screen.getByText(EXHIBITION_LAUNCH_LABEL)).toBeVisible();
  });

  it("cleans up GSAP matchMedia cleanly on unmount for all components", () => {
    jest.setSystemTime(new Date("2026-11-24T08:00:00+07:00"));

    const revertSpy = jest.fn();
    const addSpy = jest.fn();
    jest.spyOn(gsap, "matchMedia").mockReturnValue({
      add: addSpy,
      revert: revertSpy,
    } as unknown as gsap.MatchMedia);

    const { unmount } = render(
      <>
        <PixelEnergyTrail />
        <P2RVoltSection />
        <TimelineToLaunchPortal />
        <ExhibitionCountdownSection />
      </>,
    );
    expect(addSpy).toHaveBeenCalledTimes(4);

    unmount();
    expect(revertSpy).toHaveBeenCalledTimes(4);
  });
});
