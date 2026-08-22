"use client";

import React, { useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredKaryas = useMemo(() => {
    let result = initialKaryas;

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter((k) => k.category === activeCategory);
    }

    // Filter by Search Query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((k) => {
        const titleMatch = k.title.toLowerCase().includes(query);
        const descMatch = (k.description || "").toLowerCase().includes(query);
        const creatorMatch = (k.creators || "").toLowerCase().includes(query);
        const techMatch = Array.isArray(k.tech_stack)
          ? k.tech_stack.some((tech) => {
              const str =
                typeof tech === "string"
                  ? tech
                  : tech && typeof tech === "object" && "name" in tech
                    ? String((tech as { name: unknown }).name)
                    : "";
              return str.toLowerCase().includes(query);
            })
          : false;

        return titleMatch || descMatch || creatorMatch || techMatch;
      });
    }

    return result;
  }, [initialKaryas, activeCategory, searchQuery]);

  const activeCategoryObj =
    CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  if (initialKaryas.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/40 bg-[#1e1040] p-10 text-center md:p-16">
        <span className="mb-3 inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-sm tracking-wide text-arcade-yellow">
          Pameran Karya
        </span>
        <h2 className="mb-3 font-display text-2xl font-bold text-arcade-yellow drop-shadow-sm md:text-3xl">
          Belum ada karya yang tersedia.
        </h2>
        <p className="max-w-md text-base font-medium leading-relaxed text-white/80">
          Koleksi karya inovasi siswa RPL sedang dipersiapkan untuk pameran.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Filter Kategori Karya"
        className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
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
              className={`rounded-xl px-4 py-2 font-display text-sm font-bold tracking-wider transition-all duration-150 sm:text-base outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-white ${
                isActive
                  ? "bg-arcade-yellow text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] -translate-y-0.5"
                  : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search Input & Result Counter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/50">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, kreator, atau teknologi..."
            aria-label="Cari karya inovasi"
            className="w-full rounded-xl border border-white/20 bg-black/40 py-2.5 pl-10 pr-10 text-sm font-medium text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleResetSearch}
              aria-label="Hapus pencarian"
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/50 hover:text-white"
            >
              <span className="font-display text-sm">✕</span>
            </button>
          )}
        </div>

        {/* Dynamic Counter */}
        <div className="font-display text-sm tracking-wider uppercase text-arcade-yellow">
          Menampilkan {filteredKaryas.length} dari {initialKaryas.length} Karya
        </div>
      </div>

      {/* Grid or Empty States */}
      <section aria-label="Daftar Inovasi Karya" className="w-full">
        {filteredKaryas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {filteredKaryas.map((karya) => (
              <KaryaCard key={karya.id || karya.slug} karya={karya} />
            ))}
          </div>
        ) : searchQuery ? (
          /* Empty Search State */
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-10 text-center sm:p-14">
            <h3 className="font-display text-xl text-arcade-yellow sm:text-2xl">
              Tidak ada karya yang cocok
            </h3>
            <p className="mt-2 text-sm text-white/80">
              Tidak ditemukan karya dengan kata kunci &quot;{searchQuery}&quot; pada kategori {activeCategoryObj.label}.
            </p>
            <button
              type="button"
              onClick={handleResetSearch}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          /* Empty Category State */
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/40 bg-[#1e1040] p-10 text-center md:p-16">
            <span className="mb-3 inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-sm tracking-wide text-arcade-yellow">
              {activeCategoryObj.label}
            </span>
            <h2 className="mb-3 font-display text-2xl font-bold text-arcade-yellow drop-shadow-sm md:text-3xl">
              Belum ada karya yang tersedia.
            </h2>
            <p className="max-w-md text-base font-medium leading-relaxed text-white/80">
              Karya pameran untuk kategori {activeCategoryObj.label} sedang dipersiapkan oleh tim siswa RPL.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
