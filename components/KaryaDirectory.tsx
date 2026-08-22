"use client";

import React, { useState } from "react";
import type { KaryaDetail } from "@/lib/api/types/karya";
import KaryaCard from "@/components/KaryaCard";

type KaryaDirectoryProps = {
  initialKaryas: KaryaDetail[];
};

const CATEGORIES = [
  { id: "all", label: "Semua Kategori" },
  { id: "game", label: "Game Arcade" },
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
      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Filter Kategori Karya"
        className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
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
              className={`rounded-full px-5 py-2 font-display text-sm font-bold tracking-wider transition-all duration-150 sm:text-base outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-white ${
                isActive
                  ? "bg-arcade-yellow text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] -translate-y-0.5"
                  : "bg-black/30 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid or Empty State */}
      <section aria-label="Daftar Inovasi Karya" className="w-full">
        {filteredKaryas.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredKaryas.map((karya) => (
              <KaryaCard key={karya.id || karya.slug} karya={karya} />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/40 bg-black/20 p-10 text-center backdrop-blur-xs md:p-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="mb-3 inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-sm tracking-wide text-arcade-yellow">
              {activeCategoryObj.label}
            </span>
            <h2 className="mb-3 font-display text-2xl font-bold text-arcade-yellow drop-shadow-sm md:text-3xl">
              Karya Segera Hadir
            </h2>
            <p className="max-w-md text-base font-medium leading-relaxed text-white/80">
              Karya pameran untuk kategori {activeCategoryObj.label} sedang dipersiapkan oleh tim siswa RPL. Pantau terus linimasa pameran!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
