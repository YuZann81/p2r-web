import React from "react";
import Link from "next/link";
import KaryaCard from "@/components/KaryaCard";
import { getAllKaryas } from "@/lib/karya/getKaryas";

export default async function KaryaShowcasePreview() {
  const allKaryas = await getAllKaryas();

  // Prioritize non-game karyas (website, software, hardware_robotics, digital_art), then include game karyas if needed
  const nonGameKaryas = allKaryas.filter((k) => k.category !== "game");
  const showcaseKaryas = (
    nonGameKaryas.length > 0 ? [...nonGameKaryas, ...allKaryas] : allKaryas
  )
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => (t.id || t.slug) === (item.id || item.slug)),
    )
    .slice(0, 3);

  return (
    <section
      aria-label="Karya Inovasi Siswa RPL"
      className="w-full bg-[#1e1346] py-14 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-12">
          <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow sm:text-sm">
            Inovasi Digital &amp; Teknologi
          </span>
          <h2 className="mt-3 font-display text-2xl text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-4xl md:text-5xl">
            KARYA SISWA RPL
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-pretty text-white/90 sm:text-base md:text-lg">
            Eksplorasi ragam inovasi perangkat lunak, sistem IoT, web interaktif, dan karya digital art buatan siswa Rekayasa Perangkat Lunak.
          </p>
        </div>

        {/* Showcase Grid */}
        {showcaseKaryas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {showcaseKaryas.map((karya) => (
              <KaryaCard key={karya.id || karya.slug} karya={karya} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/30 bg-[#1e1040] p-10 text-center">
            <span className="font-display text-lg text-arcade-yellow">
              Belum ada karya yang tersedia.
            </span>
            <p className="mt-2 text-sm text-white/80">
              Dokumentasi karya inovasi siswa RPL sedang dipersiapkan untuk pameran.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/karya"
            className="inline-flex min-h-[44px] items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Lihat Semua Karya →
          </Link>
        </div>
      </div>
    </section>
  );
}
