"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const EXHIBITION_FEATURES = [
  { label: "Pameran Interaktif", accent: "#5b2be6" },
  { label: "Turnamen Arcade", accent: "#ffe500" },
  { label: "Voting Karya Publik", accent: "#7a1fb0" },
  { label: "Demo IoT & Hardware", accent: "#7ac70c" },
] as const;

export default function P2RVoltSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;

    let mm: gsap.MatchMedia | undefined;
    let observer: IntersectionObserver | undefined;

    try {
      mm = gsap.matchMedia();

      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};
          if (reduceMotion || typeof IntersectionObserver === "undefined") return;

          let revealed = false;
          observer = new IntersectionObserver(
            (entries) => {
              if (revealed) return;
              if (entries.some((entry) => entry.isIntersecting)) {
                revealed = true;
                observer?.disconnect();
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.from("[data-info-reveal]", {
                  y: 16,
                  autoAlpha: 0,
                  duration: 0.52,
                  stagger: 0.08,
                  clearProps: "transform,opacity,visibility",
                }).from(
                  "[data-info-feature]",
                  {
                    y: 12,
                    autoAlpha: 0,
                    duration: 0.42,
                    stagger: 0.06,
                    clearProps: "transform,opacity,visibility",
                  },
                  "-=0.28",
                );
              }
            },
            { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
          );

          observer.observe(section);

          return () => {
            observer?.disconnect();
          };
        },
        sectionRef,
      );
    } catch {
      // Keep static visible fallback if GSAP fails
    }

    return () => {
      observer?.disconnect();
      mm?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="information"
      aria-labelledby="exhibition-info-heading"
      className="relative w-full overflow-hidden bg-[#1C172D] px-4 py-14 sm:px-6 md:py-20"
    >
      {/* Restrained purple atmospheric wash echoing Hero stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-[-6%] top-[12%] h-[360px] w-[360px] rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(91, 43, 230, 0.32) 0%, rgba(122, 31, 176, 0.16) 52%, transparent 76%)",
          }}
        />
        <div
          className="absolute right-[-4%] bottom-[8%] h-[340px] w-[340px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(122, 31, 176, 0.3) 0%, rgba(42, 17, 71, 0.22) 55%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column (5 cols): Editorial Display Heading & 4 Feature Labels */}
          <div className="flex flex-col items-start text-left lg:col-span-5">
            {/* Stepped pixel identity bar echoing Hero plinth */}
            <div
              data-info-reveal
              aria-hidden="true"
              className="flex items-center gap-2"
            >
              <span className="h-2 w-2 bg-[#7ac70c]" />
              <span className="h-1.5 w-8 bg-[#5b2be6]" />
              <span className="h-2 w-2 bg-[#ffe500]" />
            </div>

            <h2
              id="exhibition-info-heading"
              data-info-reveal
              className="mt-5 font-display text-5xl leading-[0.96] tracking-wide text-[#FFF5E9] sm:text-6xl"
              style={{
                textShadow: "3px 3px 0px #2a1147, 6px 6px 0px #0E0A1A",
              }}
            >
              <span className="block">TENTANG</span>
              <span className="block text-[#ffe500]">PIXEL TO REALITY</span>
            </h2>

            {/* 4 Verbatim Feature Labels in Clean Architectural 2x2 Index Grid */}
            <div className="mt-8 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
              {EXHIBITION_FEATURES.map((feature) => (
                <div
                  key={feature.label}
                  data-info-feature
                  className="flex items-center gap-3 rounded-xl border border-[#5b2be6]/35 bg-[#171224]/90 px-4 py-3 shadow-[0_8px_18px_rgba(14,10,26,0.5)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0"
                    style={{ backgroundColor: feature.accent }}
                  />
                  <span className="font-display text-sm tracking-wide text-[#FFF5E9]">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (7 cols): Framed Cyber Arcade Exhibition Narrative Panel */}
          <div
            data-info-reveal
            className="relative overflow-hidden rounded-3xl border border-[#5b2be6]/40 bg-gradient-to-b from-[#2a1147]/65 via-[#171224]/94 to-[#171224] p-7 shadow-[0_24px_48px_rgba(14,10,26,0.72)] sm:p-10 lg:col-span-7"
          >
            {/* Signature stepped pixel corner accents */}
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

            {/* Subtle top hairline inside frame */}
            <div
              aria-hidden="true"
              className="mb-6 flex items-center justify-between border-b border-white/10 pb-4"
            >
              <span className="h-1 w-14 bg-[#5b2be6]" />
              <span className="h-1.5 w-1.5 bg-[#ffe500]" />
            </div>

            {/* Verbatim Exhibition Paragraphs */}
            <div className="space-y-6 font-body">
              <p className="border-l-2 border-[#ffe500] pl-5 text-base leading-relaxed text-[#FFF5E9]/95 sm:text-lg md:text-[1.15rem]">
                <strong className="font-semibold text-[#ffe500]">
                  Pixel To Reality (P2R)
                </strong>{" "}
                merupakan pameran tahunan karya siswa jurusan{" "}
                <strong className="font-semibold text-[#FFF5E9]">
                  Rekayasa Perangkat Lunak (RPL)
                </strong>
                . Event ini menjadi wadah apresiasi untuk memamerkan produk inovasi teknologi,
                game retro interaktif, aplikasi web, dan sistem cerdas yang siap bersaing di industri digital.
              </p>

              <p className="border-t border-white/10 pt-6 text-base leading-relaxed text-[#FFF5E9]/82 sm:text-lg">
                Melalui pameran interaktif ini, pengunjung dapat mencoba langsung puluhan project,
                memberikan dukungan voting kepada karya favorit, serta bertanding mencetak skor tertinggi
                di turnamen arcade live.
              </p>
            </div>

            {/* Stepped pixel architectural base strip */}
            <div
              aria-hidden="true"
              className="mt-8 flex items-center justify-center gap-2 pt-2"
            >
              <span className="h-1 w-6 bg-[#7ac70c]/75" />
              <span className="h-1 w-16 bg-[#5b2be6]/75" />
              <span className="h-1 w-6 bg-[#ffe500]/75" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
