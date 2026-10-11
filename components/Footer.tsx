import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import PixelDivider from "@/components/PixelDivider";
import { getBranding } from "@/lib/branding";
import { FOOTER_CONTENT, FOOTER_MARQUEE_TEXT } from "@/lib/content";

export default async function Footer() {
  const branding = await getBranding();

  return (
    <footer aria-label="Penyelenggara dan footer situs" className="w-full">
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

          {branding.visible ? (
            <div className="mt-10 flex w-full max-w-3xl flex-col items-center rounded-3xl border-4 border-arcade-ink bg-arcade-yellow/10 p-8 text-center shadow-[8px_8px_0_var(--arcade-ink)] md:mt-14 md:p-12">
              <Image
                src={branding.logoUrl}
                alt={`Logo ${branding.name}`}
                width={1600}
                height={1600}
                sizes="(max-width: 768px) 160px, 240px"
                className="h-32 w-32 md:h-48 md:w-48"
              />

              {branding.tagline ? (
                <p className="mt-6 font-display text-sm uppercase tracking-widest text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] md:text-base">
                  {branding.tagline}
                </p>
              ) : null}

              <h3 className="mt-4 font-display text-2xl text-white [text-shadow:3px_4px_0_var(--arcade-ink)] sm:text-3xl md:text-4xl">
                {branding.name}
              </h3>

              {branding.description ? (
                <p className="mt-4 max-w-2xl text-center text-base font-semibold leading-relaxed text-pretty text-white sm:text-lg">
                  {branding.description}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {branding.website ? (
                  <a
                    href={branding.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
                  >
                    Kunjungi Situs Sekolah
                  </a>
                ) : null}

                <Link
                  href="/karya"
                  className="inline-flex items-center justify-center border-2 border-white/50 bg-black/30 px-6 py-2.5 font-display text-base font-bold text-white transition-colors hover:border-white hover:bg-black/45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow"
                >
                  Jelajahi Karya Peserta
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-10 max-w-2xl text-center text-base font-semibold leading-relaxed text-pretty text-white sm:text-lg">
              Identitas penyelenggara sedang disembunyikan oleh panitia.
            </p>
          )}

          <p className="mt-20 font-display text-sm text-white [text-shadow:2px_2px_0_var(--arcade-ink)] md:mt-28">
            {FOOTER_CONTENT.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
