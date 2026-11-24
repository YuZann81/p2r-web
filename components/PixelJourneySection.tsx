"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  EXHIBITION_LAUNCH_ISO,
  EXHIBITION_LAUNCH_LABEL,
  calculateCountdown,
  padCountdownUnit,
  type CountdownState,
} from "@/lib/countdown";

type EnergyParticle = {
  id: string;
  left: string;
  top: string;
  size: number;
  color: string;
  opacity: number;
  driftY: number;
  duration: number;
  delay: number;
  desktopOnly?: boolean;
};

// Deterministic pixel energy fragments flowing downward from the Hero boundary
const ENERGY_PARTICLES: readonly EnergyParticle[] = [
  { id: "p1", left: "48%", top: "6%", size: 6, color: "#5b2be6", opacity: 0.85, driftY: 22, duration: 3.2, delay: 0 },
  { id: "p2", left: "51.5%", top: "16%", size: 5, color: "#7a1fb0", opacity: 0.78, driftY: 26, duration: 3.6, delay: 0.4 },
  { id: "p3", left: "49.5%", top: "30%", size: 4, color: "#ffe500", opacity: 0.72, driftY: 20, duration: 4.1, delay: 0.8 },
  { id: "p4", left: "50.5%", top: "52%", size: 6, color: "#5b2be6", opacity: 0.82, driftY: 24, duration: 3.4, delay: 0.2 },
  { id: "p5", left: "48.8%", top: "70%", size: 4, color: "#7ac70c", opacity: 0.72, driftY: 18, duration: 4.4, delay: 1.0 },
  { id: "p6", left: "34%", top: "14%", size: 5, color: "#7a1fb0", opacity: 0.48, driftY: 24, duration: 4.2, delay: 0.3, desktopOnly: true },
  { id: "p7", left: "65%", top: "20%", size: 5, color: "#5b2be6", opacity: 0.52, driftY: 22, duration: 3.9, delay: 0.6, desktopOnly: true },
  { id: "p8", left: "41%", top: "40%", size: 4, color: "#5b2be6", opacity: 0.58, driftY: 26, duration: 3.8, delay: 0.5, desktopOnly: true },
  { id: "p9", left: "58%", top: "46%", size: 4, color: "#7a1fb0", opacity: 0.56, driftY: 24, duration: 4.0, delay: 0.9, desktopOnly: true },
  { id: "p10", left: "45%", top: "64%", size: 5, color: "#7a1fb0", opacity: 0.64, driftY: 20, duration: 3.5, delay: 0.7, desktopOnly: true },
  { id: "p11", left: "54.5%", top: "74%", size: 4, color: "#5b2be6", opacity: 0.68, driftY: 18, duration: 3.7, delay: 1.1, desktopOnly: true },
];

/**
 * Independent Hero -> P2R VOLT 1 Pixel Energy Trail transition.
 */
export function PixelEnergyTrail() {
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = trailRef.current;
    if (!root || typeof window === "undefined") return;

    let mm: gsap.MatchMedia | undefined;

    try {
      mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { reduceMotion, isDesktop } = context.conditions ?? {};
          if (reduceMotion) return;

          const particleEls = root.querySelectorAll<HTMLElement>(
            "[data-energy-particle]",
          );
          particleEls.forEach((el) => {
            const driftY = Number(el.dataset.driftY || 20);
            const duration = Number(el.dataset.duration || 3.6);
            const delay = Number(el.dataset.delay || 0);
            const baseOpacity = Number(el.dataset.opacity || 0.7);

            gsap.fromTo(
              el,
              { y: -10, opacity: baseOpacity * 0.25 },
              {
                y: isDesktop ? driftY : Math.round(driftY * 0.65),
                opacity: baseOpacity,
                duration,
                delay,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              },
            );
          });

          gsap.fromTo(
            "[data-energy-pulse]",
            { yPercent: -100, opacity: 0.2 },
            {
              yPercent: 220,
              opacity: 0.9,
              duration: 3.4,
              ease: "none",
              repeat: -1,
            },
          );
        },
        trailRef,
      );
    } catch {
      // Static visible fallback if GSAP fails
    }

    return () => {
      mm?.revert();
    };
  }, []);

  return (
    <div
      ref={trailRef}
      aria-hidden="true"
      data-testid="pixel-energy-trail"
      className="pointer-events-none relative w-full overflow-hidden bg-[#1C172D]"
    >
      <div className="relative mx-auto flex h-24 w-full max-w-5xl items-center justify-center sm:h-32">
        <div className="relative h-full w-px overflow-hidden bg-gradient-to-b from-[#5b2be6]/20 via-[#5b2be6]/65 to-[#7a1fb0]/80">
          <div
            data-energy-pulse
            className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-[#ffe500]/90 to-[#5b2be6]"
          />
        </div>

        {ENERGY_PARTICLES.map((particle) => (
          <span
            key={particle.id}
            data-energy-particle
            data-drift-y={particle.driftY}
            data-duration={particle.duration}
            data-delay={particle.delay}
            data-opacity={particle.opacity}
            className={`absolute will-change-transform ${
              particle.desktopOnly ? "hidden md:block" : "block"
            }`}
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            }}
          />
        ))}

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center justify-center">
          <span className="h-2.5 w-2.5 border border-[#ffe500]/80 bg-[#5b2be6] shadow-[0_0_16px_rgba(91,43,230,0.85)]" />
        </div>
      </div>
    </div>
  );
}

/**
 * Independent P2R VOLT 1 -> Countdown Timeline-to-Launch circular digital portal transition.
 */
export function TimelineToLaunchPortal() {
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = portalRef.current;
    if (!root || typeof window === "undefined") return;

    let mm: gsap.MatchMedia | undefined;
    let observer: IntersectionObserver | undefined;

    try {
      mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { reduceMotion, isDesktop } = context.conditions ?? {};
          if (reduceMotion) return;

          gsap.fromTo(
            "[data-portal-pulse]",
            { yPercent: -100, opacity: 0.2 },
            {
              yPercent: 220,
              opacity: 0.9,
              duration: 3.0,
              ease: "none",
              repeat: -1,
            },
          );

          gsap.to("[data-portal-ring-outer]", {
            rotation: 360,
            duration: isDesktop ? 36 : 52,
            ease: "none",
            repeat: -1,
          });

          if (isDesktop) {
            gsap.to("[data-portal-ring-inner]", {
              rotation: -360,
              duration: 28,
              ease: "none",
              repeat: -1,
            });
          }

          gsap.to("[data-portal-core]", {
            scale: 1.08,
            opacity: 0.92,
            duration: 3.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          if (typeof IntersectionObserver !== "undefined") {
            let triggered = false;
            observer = new IntersectionObserver(
              (entries) => {
                if (triggered) return;
                if (entries.some((entry) => entry.isIntersecting)) {
                  triggered = true;
                  observer?.disconnect();
                  gsap.from("[data-portal-reveal]", {
                    scale: 0.92,
                    autoAlpha: 0,
                    duration: 0.65,
                    ease: "power3.out",
                    clearProps: "transform,opacity,visibility",
                  });
                }
              },
              { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
            );
            observer.observe(root);
          }

          return () => {
            observer?.disconnect();
          };
        },
        portalRef,
      );
    } catch {
      // Static visible fallback if GSAP fails
    }

    return () => {
      observer?.disconnect();
      mm?.revert();
    };
  }, []);

  return (
    <div
      ref={portalRef}
      aria-hidden="true"
      data-testid="timeline-to-launch-portal"
      className="pointer-events-none relative w-full overflow-hidden bg-[#1C172D]"
    >
      <div className="relative mx-auto flex flex-col items-center justify-center py-4 sm:py-6">
        <div className="relative h-14 w-px overflow-hidden bg-gradient-to-b from-[#5b2be6]/40 via-[#7a1fb0]/85 to-[#ffe500]/80 sm:h-16">
          <div
            data-portal-pulse
            className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-[#ffe500] to-[#7ac70c]"
          />
        </div>

        <div
          data-portal-reveal
          className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40"
        >
          <div
            data-portal-core
            className="absolute inset-2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(91, 43, 230, 0.5) 0%, rgba(122, 31, 176, 0.25) 55%, transparent 78%)",
            }}
          />

          <svg
            data-portal-ring-outer
            viewBox="0 0 160 160"
            className="absolute inset-0 h-full w-full will-change-transform"
          >
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="#5b2be6"
              strokeOpacity="0.65"
              strokeWidth="2"
              strokeDasharray="10 8"
            />
            <rect x="77" y="4" width="6" height="6" fill="#ffe500" />
            <rect x="77" y="150" width="6" height="6" fill="#7ac70c" />
            <rect x="4" y="77" width="6" height="6" fill="#7a1fb0" />
            <rect x="150" y="77" width="6" height="6" fill="#5b2be6" />
          </svg>

          <svg
            data-portal-ring-inner
            viewBox="0 0 160 160"
            className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] will-change-transform"
          >
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="#7a1fb0"
              strokeOpacity="0.7"
              strokeWidth="1.5"
              strokeDasharray="4 10"
            />
          </svg>

          <div className="relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-[#5b2be6]/80 bg-[#171224]/95 shadow-[0_0_24px_rgba(91,43,230,0.55)] sm:h-20 sm:w-20">
            <span className="h-2 w-2 bg-[#ffe500]" />
            <span className="mt-1 font-display text-[11px] tracking-[0.2em] text-[#FFF5E9] uppercase">
              LAUNCH
            </span>
          </div>
        </div>

        <div className="h-10 w-px bg-gradient-to-b from-[#7ac70c]/70 via-[#5b2be6]/60 to-transparent sm:h-12" />
      </div>
    </div>
  );
}

type CountdownDigitCardProps = {
  value: string;
  label: string;
  accentColor: string;
  reducedMotion: boolean;
};

function CountdownDigitCard({
  value,
  label,
  accentColor,
  reducedMotion,
}: CountdownDigitCardProps) {
  const digitRef = useRef<HTMLSpanElement | null>(null);
  const prevValueRef = useRef<string>(value);

  useEffect(() => {
    if (prevValueRef.current === value) return;
    const prev = prevValueRef.current;
    prevValueRef.current = value;

    // Skip animation on initial hydration placeholder -> real value jump or reduced motion
    if (reducedMotion || prev === "--" || !digitRef.current) return;

    const el = digitRef.current;
    try {
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        {
          y: -12,
          opacity: 0.3,
          rotationX: 42,
          transformPerspective: 420,
          transformOrigin: "50% 50%",
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.32,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
      );
    } catch {
      // Keep updated numeral visible if GSAP fails
    }

    return () => {
      gsap.killTweensOf(el);
    };
  }, [value, reducedMotion]);

  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-[#5b2be6]/40 bg-[#171224]/95 p-3 shadow-[0_14px_28px_rgba(14,10,26,0.68)] sm:p-4">
      {/* Recessed arcade display bay */}
      <div className="relative flex w-full flex-col items-center overflow-hidden rounded-xl border border-[#39265E]/80 bg-[#0E0A1A]/95 px-2 py-4 shadow-inner sm:py-5">
        {/* Top stepped pixel accent bar */}
        <span
          aria-hidden="true"
          className="mb-3 h-1 w-8"
          style={{ backgroundColor: accentColor }}
        />

        {/* Subtle split-flap horizontal seam */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/[0.04]"
        />

        <div className="relative flex h-12 w-full items-center justify-center overflow-hidden sm:h-16 md:h-[4.75rem]">
          <span
            ref={digitRef}
            data-countdown-unit={label.toLowerCase()}
            className="inline-block font-display text-4xl leading-none tracking-wider text-[#FFF5E9] tabular-nums sm:text-5xl md:text-6xl"
            style={{ textShadow: "2px 3px 0px #2a1147, 4px 5px 0px #0E0A1A" }}
          >
            {value}
          </span>
        </div>
      </div>

      <span className="mt-2.5 font-body text-[11px] font-semibold tracking-[0.22em] text-[#B7ABCE] uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
}

type ExhibitionCountdownSectionProps = {
  targetIso?: string;
};

/**
 * Deterministic WIB Exhibition Launch Countdown (2026-11-26T08:00:00+07:00).
 */
export function ExhibitionCountdownSection({
  targetIso = EXHIBITION_LAUNCH_ISO,
}: ExhibitionCountdownSectionProps) {
  const countdownRef = useRef<HTMLElement | null>(null);

  const [countdown, setCountdown] = useState<CountdownState | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Real-time deterministic countdown synced once per second against absolute WIB timestamp
  useEffect(() => {
    const sync = () => {
      const next = calculateCountdown(Date.now(), targetIso);
      setCountdown(next);
      return next;
    };

    const initial = sync();
    if (initial.status !== "counting") return;

    const timer = window.setInterval(() => {
      const state = sync();
      if (state.status !== "counting") {
        window.clearInterval(timer);
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [targetIso]);

  // Coordinated GSAP reveal for Countdown console
  useEffect(() => {
    const root = countdownRef.current;
    if (!root || typeof window === "undefined") return;

    let mm: gsap.MatchMedia | undefined;
    let observer: IntersectionObserver | undefined;

    try {
      mm = gsap.matchMedia();

      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { reduceMotion: isReduced } = context.conditions ?? {};
          setReducedMotion(Boolean(isReduced));

          if (isReduced || typeof IntersectionObserver === "undefined") return;

          let triggered = false;
          observer = new IntersectionObserver(
            (entries) => {
              if (triggered) return;
              if (entries.some((entry) => entry.isIntersecting)) {
                triggered = true;
                observer?.disconnect();
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.from("[data-countdown-reveal]", {
                  y: 16,
                  autoAlpha: 0,
                  duration: 0.5,
                  stagger: 0.08,
                  clearProps: "transform,opacity,visibility",
                }).from(
                  "[data-countdown-card]",
                  {
                    y: 18,
                    autoAlpha: 0,
                    duration: 0.48,
                    stagger: 0.08,
                    clearProps: "transform,opacity,visibility",
                  },
                  "-=0.25",
                );
              }
            },
            { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
          );
          observer.observe(root);

          return () => {
            observer?.disconnect();
          };
        },
        countdownRef,
      );
    } catch {
      // Content remains fully visible in static fallback if GSAP fails
    }

    return () => {
      observer?.disconnect();
      mm?.revert();
    };
  }, []);

  const isStarted = countdown?.status === "started";
  const isInvalid = countdown?.status === "invalid";

  const units = [
    {
      label: "Hari",
      value: countdown ? padCountdownUnit(countdown.days) : "--",
      accent: "#5b2be6",
    },
    {
      label: "Jam",
      value: countdown ? padCountdownUnit(countdown.hours) : "--",
      accent: "#7a1fb0",
    },
    {
      label: "Menit",
      value: countdown ? padCountdownUnit(countdown.minutes) : "--",
      accent: "#7ac70c",
    },
    {
      label: "Detik",
      value: countdown ? padCountdownUnit(countdown.seconds) : "--",
      accent: "#ffe500",
    },
  ];

  return (
    <section
      ref={countdownRef}
      id="countdown"
      aria-labelledby="exhibition-countdown-heading"
      className="relative w-full overflow-hidden bg-[#1C172D] px-4 pt-2 pb-16 sm:px-6 md:pb-24"
    >
      {/* Subtle atmospheric glow keeping dark purple dominant */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute bottom-8 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(122, 31, 176, 0.28) 0%, rgba(42, 17, 71, 0.24) 55%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#5b2be6]/45 bg-gradient-to-b from-[#2a1147]/72 via-[#171224]/95 to-[#171224] p-6 shadow-[0_28px_56px_rgba(14,10,26,0.78)] sm:p-10 md:p-12">
          {/* Signature stepped corner brackets matching Hero & Exhibition Info */}
          <span
            aria-hidden="true"
            className="absolute top-3 left-3 h-3.5 w-3.5 border-t-2 border-l-2 border-[#5b2be6]"
          />
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 h-3.5 w-3.5 border-t-2 border-r-2 border-[#7a1fb0]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-3 h-2.5 w-2.5 bg-[#7ac70c]/80"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 h-2.5 w-2.5 bg-[#ffe500]/80"
          />

          <div className="flex flex-col items-center text-center">
            {/* Console Header Bar: Status Indicator + Explicit WIB Schedule */}
            <div
              data-countdown-reveal
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-lg border border-[#5b2be6]/40 bg-[#0E0A1A]/85 px-3 py-1.5 font-body text-[11px] font-semibold tracking-[0.2em] text-[#B7ABCE] uppercase sm:text-xs">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 ${isStarted ? "bg-[#7ac70c]" : "bg-[#ffe500]"}`}
                />
                <span>
                  {isStarted ? "SESI PAMERAN" : "COUNTDOWN TO LAUNCH"}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-lg border border-[#39265E] bg-[#0E0A1A]/75 px-3.5 py-1.5 font-body text-xs font-medium text-[#FFF5E9]/90 sm:text-sm">
                <span className="h-1.5 w-1.5 bg-[#5b2be6]" aria-hidden="true" />
                <time dateTime={targetIso}>{EXHIBITION_LAUNCH_LABEL}</time>
              </span>
            </div>

            <h2
              id="exhibition-countdown-heading"
              data-countdown-reveal
              className="mt-5 font-display text-4xl leading-[0.98] tracking-wide text-[#FFF5E9] sm:text-5xl md:text-6xl"
              style={{
                textShadow: "3px 3px 0px #2a1147, 5px 5px 0px #0E0A1A",
              }}
            >
              {isStarted ? (
                <span className="text-[#7ac70c]">SESI PAMERAN</span>
              ) : (
                <>
                  MENUJU PEMBUKAAN{" "}
                  <span className="text-[#ffe500]">PAMERAN</span>
                </>
              )}
            </h2>

            {isInvalid ? (
              <div
                role="status"
                className="mt-8 w-full max-w-lg rounded-2xl border border-[#5b2be6]/40 bg-[#0E0A1A]/80 px-6 py-5 font-body text-sm text-[#B7ABCE]"
              >
                Jadwal pembukaan pameran sedang diperbarui.
              </div>
            ) : isStarted ? (
              <div
                role="status"
                data-testid="countdown-started-state"
                className="mt-8 flex w-full max-w-2xl flex-col items-center gap-5 rounded-2xl border border-[#7ac70c]/55 bg-[#0E0A1A]/90 px-6 py-8 shadow-inner sm:px-10"
              >
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-[#7ac70c]/45 bg-[#7ac70c]/15 px-5 py-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 bg-[#7ac70c]"
                  />
                  <span className="font-display text-xl tracking-[0.18em] text-[#7ac70c] uppercase sm:text-2xl">
                    SESI PAMERAN
                  </span>
                </div>

                <a
                  href="#karya-arcade"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ffe500] px-7 py-2.5 font-display text-lg font-bold tracking-wide text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                >
                  Jelajahi Karya
                </a>
              </div>
            ) : (
              <div
                role="timer"
                aria-live="off"
                aria-label="Hitung mundur pembukaan pameran Pixel To Reality"
                className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
              >
                {units.map((unit) => (
                  <div key={unit.label} data-countdown-card>
                    <CountdownDigitCard
                      value={unit.value}
                      label={unit.label}
                      accentColor={unit.accent}
                      reducedMotion={reducedMotion}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Stepped Cyber Arcade Plinth Bar echoing Hero */}
            <div
              aria-hidden="true"
              className="mt-9 flex flex-col items-center"
            >
              <div className="h-1.5 w-44 border-t border-[#5b2be6] bg-[#2a1147] sm:w-56" />
              <div className="flex h-2.5 w-56 items-center justify-between border-x border-b border-[#39265E] bg-[#0E0A1A] px-2.5 sm:w-68">
                <span className="h-1 w-4 bg-[#7ac70c]/80" />
                <span className="h-1 w-12 bg-[#5b2be6]/75" />
                <span className="h-1 w-4 bg-[#ffe500]/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
