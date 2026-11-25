"use client";

import React, { useState } from "react";
import { sanitizeMediaUrl } from "@/lib/api/media";

type GameArtworkProps = {
  image: string;
  imageAlt: string;
  logo: string;
  logoAlt: string;
  tilt?: "left" | "right";
};

export default function GameArtwork({
  image,
  imageAlt,
  logo,
  logoAlt,
  tilt = "left",
}: GameArtworkProps) {
  const safeImage = sanitizeMediaUrl(image);
  const safeLogo = sanitizeMediaUrl(logo);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const [failedLogoSrc, setFailedLogoSrc] = useState<string | null>(null);

  const rotation = tilt === "left" ? "-rotate-6" : "rotate-6";
  const badgePosition = tilt === "left" ? "-top-8 right-6" : "-bottom-8 left-6";
  const showImage = Boolean(safeImage && failedImageSrc !== safeImage);
  const showLogo = Boolean(safeLogo && failedLogoSrc !== safeLogo);

  return (
    <div
      className={`relative w-full max-w-md ${rotation} transition-transform duration-300 group-hover:rotate-0`}
    >
      {/* stacked paper layers behind the card */}
      <div
        className="absolute inset-0 translate-x-2 translate-y-2 bg-white/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 translate-x-1 translate-y-1 bg-white/60"
        aria-hidden="true"
      />

      {/* main card */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#171224] shadow-lg">
        {showImage && safeImage ? (
          <img
            src={safeImage}
            alt={imageAlt}
            onError={() => setFailedImageSrc(safeImage)}
            className="h-full w-full object-cover [image-rendering:pixelated]"
          />
        ) : (
          <div
            role="img"
            aria-label={imageAlt}
            className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#2a1147] via-[#211B35] to-[#0E0A1A] p-6 text-center"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(91,43,230,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(122,31,176,0.45) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <span className="relative h-2.5 w-2.5 bg-[#ffe500]" aria-hidden="true" />
            <span className="relative mt-2 font-display text-sm tracking-widest text-[#FFF5E9]/85 uppercase">
              Pixel To Reality
            </span>
          </div>
        )}
      </div>

      {/* circular logo badge overlapping a corner */}
      <div
        className={`absolute ${badgePosition} flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#211B35] shadow-md`}
      >
        {showLogo && safeLogo ? (
          <img
            src={safeLogo}
            alt={logoAlt}
            onError={() => setFailedLogoSrc(safeLogo)}
            className="h-full w-full object-cover [image-rendering:pixelated]"
          />
        ) : (
          <span
            role="img"
            aria-label={logoAlt}
            className="font-display text-sm tracking-widest text-[#ffe500] uppercase"
          >
            P2R
          </span>
        )}
      </div>
    </div>
  );
}
