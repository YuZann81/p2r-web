"use client";

import React, { useEffect, useState, useRef } from "react";

const PHRASES = [
  "PAGE NOT FOUND",
  "404 ERROR",
  "LEVEL NOT FOUND",
  "SYSTEM ERROR",
  "WRONG DIMENSION",
];

const GLYPHS = "0123456789!#%&*?/<>=+X$";
const CYCLE_INTERVAL = 3500; // Cycles every 3.5 seconds
const TRANSITION_DURATION = 650; // Transition duration ~650ms (between 500-800ms)
const FRAME_INTERVAL = 45; // Frame step ~45ms

export default function AnimatedArcadeHeading() {
  const [displayText, setDisplayText] = useState(PHRASES[0]);
  const [isGlitching, setIsGlitching] = useState(false);
  const phraseIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery?.matches) {
        return;
      }
    }

    const timer = setInterval(() => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const fromIndex = phraseIndexRef.current;
      const toIndex = (fromIndex + 1) % PHRASES.length;
      phraseIndexRef.current = toIndex;

      const fromText = PHRASES[fromIndex];
      const toText = PHRASES[toIndex];

      setIsGlitching(true);

      const startTime = performance.now();

      const scrambleTimer = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / TRANSITION_DURATION, 1);

        // Progressively morph length from source to target
        const targetLen = Math.round(
          fromText.length + (toText.length - fromText.length) * progress,
        );

        let scrambled = "";
        for (let i = 0; i < targetLen; i++) {
          const charThreshold = (i + 1) / targetLen;

          if (progress >= 1 || progress >= charThreshold + 0.1) {
            // Already resolved to target character
            scrambled += toText[i] || "";
          } else if (
            toText[i] === " " ||
            (fromText[i] === " " && progress < 0.3)
          ) {
            // Retain whitespace to prevent word-collapse
            scrambled += " ";
          } else if (progress > 0.08) {
            // Scrambling with retro arcade glyph
            scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            // Original character
            scrambled += fromText[i] || toText[i] || "";
          }
        }

        setDisplayText(scrambled);

        if (progress >= 1) {
          clearInterval(scrambleTimer);
          setDisplayText(toText);
          setIsGlitching(false);
          isTransitioningRef.current = false;
        }
      }, FRAME_INTERVAL);
    }, CYCLE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-12 w-full items-center justify-center overflow-visible sm:h-16 md:h-20">
      <style>{`
        @keyframes arcade-glitch-jitter {
          0%, 100% {
            transform: translate(0, 0);
            text-shadow: 2.5px 2.5px 0px #C37D29, 5px 5px 0px #0E0A1A;
          }
          20% {
            transform: translate(-1.5px, 0.5px);
            text-shadow: -2px 0px 0px #68D5E8, 2.5px 2.5px 0px #C37D29, 5px 5px 0px #0E0A1A;
          }
          40% {
            transform: translate(1.5px, -0.5px);
            text-shadow: 2px 0px 0px #F276A5, 2.5px 2.5px 0px #C37D29, 5px 5px 0px #0E0A1A;
          }
          60% {
            transform: translate(-1px, 0);
            text-shadow: -1.5px 0.5px 0px #68D5E8, 2.5px 2.5px 0px #C37D29, 5px 5px 0px #0E0A1A;
          }
          80% {
            transform: translate(1px, -0.5px);
            text-shadow: 1.5px -0.5px 0px #F276A5, 2.5px 2.5px 0px #C37D29, 5px 5px 0px #0E0A1A;
          }
        }
        .arcade-glitch-anim {
          animation: arcade-glitch-jitter 0.15s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .arcade-glitch-anim {
            animation: none !important;
          }
        }
      `}</style>
      <h1
        className={`select-none font-display font-bold tracking-wider text-[#FFD43B] text-3xl sm:text-5xl md:text-6xl leading-tight sm:whitespace-nowrap transition-transform duration-100 ${
          isGlitching ? "arcade-glitch-anim" : ""
        }`}
        style={{
          textShadow: "2.5px 2.5px 0px #C37D29, 5px 5px 0px #0E0A1A",
        }}
        aria-live="polite"
      >
        {displayText}
      </h1>
    </div>
  );
}
