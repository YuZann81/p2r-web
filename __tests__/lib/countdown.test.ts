import {
  EXHIBITION_LAUNCH_ISO,
  calculateCountdown,
  padCountdownUnit,
} from "@/lib/countdown";

describe("countdown utility", () => {
  it("uses the exact WIB deadline 2026-11-26T08:00:00+07:00 (01:00:00 UTC)", () => {
    expect(EXHIBITION_LAUNCH_ISO).toBe("2026-11-26T08:00:00+07:00");
    expect(Date.parse(EXHIBITION_LAUNCH_ISO)).toBe(
      Date.parse("2026-11-26T01:00:00.000Z"),
    );
  });

  it("calculates exact remaining days, hours, minutes, and seconds timezone-independently", () => {
    // Equivalent instant expressed in UTC (-00:00) and US Eastern (-05:00)
    const utcNow = Date.parse("2026-11-24T00:15:30Z");
    const estNow = Date.parse("2026-11-23T19:15:30-05:00");

    expect(utcNow).toBe(estNow);

    const state = calculateCountdown(utcNow);
    expect(state).toEqual({
      status: "counting",
      days: 2,
      hours: 0,
      minutes: 44,
      seconds: 30,
      totalMs: ((2 * 86400 + 44 * 60 + 30) * 1000),
    });
  });

  it("returns started state at the exact deadline and after it has elapsed", () => {
    const exactLaunch = Date.parse("2026-11-26T08:00:00+07:00");
    expect(calculateCountdown(exactLaunch)).toEqual({
      status: "started",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });

    const afterLaunch = Date.parse("2026-12-01T12:00:00+07:00");
    expect(calculateCountdown(afterLaunch)).toEqual({
      status: "started",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });
  });

  it("handles invalid target dates and non-finite timestamps safely", () => {
    expect(calculateCountdown(Date.now(), "not-a-valid-date")).toEqual({
      status: "invalid",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });

    expect(calculateCountdown(Number.NaN)).toEqual({
      status: "invalid",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });
  });

  it("pads single-digit countdown units cleanly", () => {
    expect(padCountdownUnit(0)).toBe("00");
    expect(padCountdownUnit(7)).toBe("07");
    expect(padCountdownUnit(24)).toBe("24");
    expect(padCountdownUnit(-5)).toBe("00");
  });
});
