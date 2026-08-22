import React from "react";
import InvestorLogo from "@/components/InvestorLogo";
import Marquee from "@/components/Marquee";
import PixelDivider from "@/components/PixelDivider";
import { FOOTER_CONTENT, FOOTER_MARQUEE_TEXT } from "@/lib/content";

export default function Footer() {
  return (
    <footer aria-label="Mitra industri dan footer website" className="w-full">
      <Marquee text={FOOTER_MARQUEE_TEXT} />
      <PixelDivider
        base="var(--arcade-green)"
        pixel="var(--arcade-green-shadow)"
      />

      <div className="bg-arcade-green">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14 sm:px-6 sm:py-20 md:py-24">
          <h2 className="font-display text-2xl text-arcade-ink [text-shadow:2px_3px_0_#fff] sm:text-3xl md:text-4xl text-center">
            {FOOTER_CONTENT.heading}
          </h2>

          <p className="mt-4 max-w-xl text-center text-sm font-bold leading-relaxed text-pretty text-arcade-ink sm:mt-6 sm:text-base md:text-lg">
            {FOOTER_CONTENT.body}
          </p>

          <ul className="mt-12 grid w-full grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 md:mt-16">
            {FOOTER_CONTENT.investors.map((investor) => (
              <InvestorLogo key={investor.id} investor={investor} />
            ))}
          </ul>

          <p className="mt-14 font-display text-xs font-bold text-arcade-ink sm:text-sm md:mt-20">
            {FOOTER_CONTENT.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
