"use client";

import React, { useEffect, useRef, useState } from "react";

type GameScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "section" | "heading" | "row" | "fade";
};

export default function GameScrollReveal({
  children,
  className = "",
  delayMs = 0,
  variant = "section",
}: GameScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced-motion preference
    if (typeof window !== "undefined" && window.matchMedia) {
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (motionQuery.matches) {
        setPrefersReducedMotion(true);
        setIsVisible(true);
        return;
      }
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  // When reduced motion is preferred, render cleanly without transforms/delays
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getTransitionStyle = (): React.CSSProperties => {
    const baseTransition =
      "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)";
    const delay = `${delayMs}ms`;

    if (isVisible) {
      return {
        opacity: 1,
        transform: "none",
        transition: baseTransition,
        transitionDelay: delay,
        willChange: "opacity, transform",
      };
    }

    let initialTransform = "translateY(16px)";
    if (variant === "heading") {
      initialTransform = "translateY(12px)";
    } else if (variant === "fade") {
      initialTransform = "none";
    } else if (variant === "row") {
      initialTransform = "translateY(16px)";
    }

    return {
      opacity: 0,
      transform: initialTransform,
      transition: baseTransition,
      transitionDelay: delay,
      willChange: "opacity, transform",
    };
  };

  return (
    <div ref={ref} className={className} style={getTransitionStyle()}>
      {children}
    </div>
  );
}
