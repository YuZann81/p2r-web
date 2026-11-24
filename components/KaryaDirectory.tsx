"use client";

import React, { useState } from "react";
import type { KaryaDetail } from "@/lib/api/types/karya";
import KaryaCard from "@/components/KaryaCard";

type KaryaDirectoryProps = {
  initialKaryas: KaryaDetail[];
};

const CATEGORIES = [
  { id: "all", label: "Semua Kategori" },
  { id: "website", label: "Web Innovation" },
  { id: "software", label: "Software" },
  { id: "hardware_robotics", label: "IoT & Hardware" },
  { id: "digital_art", label: "Digital Art" },
] as const;

export default function KaryaDirectory({ initialKaryas }: KaryaDirectoryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredKaryas =
    activeCategory === "all"
      ? initialKaryas
      : initialKaryas.filter((k) => k.category === activeCategory);

  const activeCategoryObj =
    CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="w-full">
      {/* Category Tabs - Clean Arcade Segmented Control */}
      <div className="mb-10 flex justify-center">
        <div
          role="tablist"
          aria-label="Filter Kategori Karya"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-[#39265E] bg-[#171224] p-1.5 shadow-[4px_4px_0_#0E0A1A]"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-4 py-2 font-display text-sm tracking-wider transition-all duration-150 sm:text-base outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FFD447] ${
                  isActive
                    ? "bg-[#FFD447] text-[#0E0A1A] font-bold shadow-[2px_2px_0_#B8960A]"
                    : "text-[#FFF5E9]/75 hover:bg-[#39265E]/60 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty State */}
      <section aria-label="Daftar Inovasi Karya" className="w-full">
        {filteredKaryas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredKaryas.map((karya) => (
              <KaryaCard key={karya.id || karya.slug} karya={karya} />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#FFD447]/30 bg-[#171224] p-10 text-center md:p-14 shadow-[4px_4px_0_#0E0A1A]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD447]/15 text-[#FFD447] border border-[#FFD447]/30">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#FFD447] sm:text-3xl">
              Karya Segera Hadir
            </h2>
            <p className="mt-2 max-w-md font-body text-sm text-[#FFF5E9]/80 sm:text-base">
              Karya pameran untuk kategori {activeCategoryObj.label} sedang dalam tahap finalisasi oleh siswa RPL. Silakan periksa kategori lain!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
