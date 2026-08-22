import InvestorLogo from "@/components/InvestorLogo";
import Marquee from "@/components/Marquee";
import PixelDivider from "@/components/PixelDivider";
import { FOOTER_CONTENT, FOOTER_MARQUEE_TEXT } from "@/lib/content";

export default function Footer() {
  return (
    <footer aria-label="Investors and site footer" className="w-full">
      <Marquee text={FOOTER_MARQUEE_TEXT} />
      <PixelDivider
        base="var(--arcade-green)"
        pixel="var(--arcade-green-shadow)"
      />

      <div className="bg-arcade-green">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl text-arcade-ink [text-shadow:2px_3px_0_#fff] sm:text-4xl">
            {FOOTER_CONTENT.heading}
          </h2>

          <p className="mt-8 max-w-xl text-center text-base font-semibold leading-relaxed text-pretty text-white sm:text-lg">
            {FOOTER_CONTENT.body}
          </p>

          <ul className="mt-16 grid w-full grid-cols-2 items-center gap-x-8 gap-y-12 md:mt-24 md:grid-cols-4">
            {FOOTER_CONTENT.investors.map((investor) => (
              <InvestorLogo key={investor.id} investor={investor} />
            ))}
          </ul>

          <p className="mt-20 font-display text-sm text-white [text-shadow:2px_2px_0_var(--arcade-ink)] md:mt-28">
            {FOOTER_CONTENT.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
