import Marquee from "@/components/Marquee";
import PixelDivider from "@/components/PixelDivider";
import RplEmblem from "@/components/RplEmblem";
import { ABOUT_CONTENT, ABOUT_MARQUEE_TEXT } from "@/lib/content";

export default function About() {
  return (
    <section aria-label="About Software Enginering" className="w-full">
      <Marquee text={ABOUT_MARQUEE_TEXT} />
      <PixelDivider />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2
            id="about-heading"
            className="font-display text-2xl leading-relaxed text-balance text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-3xl md:text-4xl"
          >
            {ABOUT_CONTENT.headingLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-6 max-w-md text-base font-semibold leading-relaxed text-pretty text-white sm:text-lg">
            {ABOUT_CONTENT.body}
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <RplEmblem />
        </div>
      </div>
    </section>
  );
}
