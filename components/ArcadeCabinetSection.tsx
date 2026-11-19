"use client";

import React from "react";
import Link from "next/link";

type CategoryItem = {
  id: string;
  badge: string;
  icon: string;
  title: string;
  color: string;
  description: string;
  techs: string[];
  featuredProject: string;
  href: string;
};

// Section Karya: Khusus karya non-game (Web Innovation, Software, IoT & Hardware, Digital Art)
const CATEGORIES: CategoryItem[] = [
  {
    id: "website",
    badge: "WEB INNOVATION",
    icon: "🌐",
    title: "Web Platform & SaaS",
    color: "#68D5E8",
    description:
      "Aplikasi web modern, platform edukasi terpadu, sistem SaaS interaktif, dan dashboard analitik data yang cepat serta responsif.",
    techs: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    featuredProject: "EduPortal RPL",
    href: "/karya?category=website",
  },
  {
    id: "software",
    badge: "SOFTWARE & UTILITY",
    icon: "💻",
    title: "Software & Desktop Apps",
    color: "#F276A5",
    description:
      "Aplikasi kasir (POS) cerdas, sistem manajemen inventaris barang, utilitas desktop, dan arsitektur database terintegrasi.",
    techs: ["Electron", "Python", "PostgreSQL", "Node.js"],
    featuredProject: "PosPoint Smart POS",
    href: "/karya?category=software",
  },
  {
    id: "hardware_robotics",
    badge: "IOT & HARDWARE",
    icon: "⚡",
    title: "IoT & Embedded Systems",
    color: "#02FD0C",
    description:
      "Inovasi mikrokontroler ESP32, pemilah sampah otomatis berbasis AI servo, sensor lingkungan pintar, dan otomasi robotik.",
    techs: ["ESP32", "Arduino", "MicroPython", "Servo Motors"],
    featuredProject: "TrashBot AI Sorter",
    href: "/karya?category=hardware_robotics",
  },
  {
    id: "digital_art",
    badge: "DIGITAL ART & UI/UX",
    icon: "🎨",
    title: "Pixel Art & Design System",
    color: "#9470E8",
    description:
      "Eksplorasi antarmuka digital UI/UX interaktif, ilustrasi aset piksel retro 8-bit, 3D modelling, dan standarisasi token desain.",
    techs: ["Figma", "Aseprite", "Design Tokens", "Blender"],
    featuredProject: "CyberPixel UI Kit",
    href: "/karya?category=digital_art",
  },
];

export default function ArcadeCabinetSection() {
  return (
    <section
      id="karya-arcade"
      className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#171224]"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD447]/30 bg-[#FFD447]/10 px-4 py-1.5 font-display text-xs tracking-widest uppercase text-[#FFD447]">
            <span>✨</span>
            <span>INOVASI TEKNOLOGI RPL</span>
            <span>✨</span>
          </div>

          <h2
            className="mt-4 font-display text-3xl sm:text-5xl md:text-6xl tracking-wider text-[#FFD447] select-none"
            style={{
              textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
            }}
          >
            KARYA PAMERAN RPL
          </h2>

          <p className="mt-3 max-w-2xl mx-auto font-body text-sm sm:text-base md:text-lg text-[#FFF5E9]/80 leading-relaxed">
            Eksplorasi ragam inovasi perangkat lunak, sistem IoT cerdas, dan karya kreatif buatan siswa Rekayasa Perangkat Lunak di luar kategori game.
          </p>
        </div>

        {/* Clean 4-Card Grid (Simple, Clean, & Informative) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="group relative flex flex-col justify-between rounded-2xl border-2 border-[#39265E] bg-[#211B35]/80 p-6 sm:p-7 shadow-[4px_4px_0_#0E0A1A] transition-all duration-200 hover:-translate-y-1 hover:border-[#FFD447]/50"
            >
              <div>
                {/* Card Top: Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="rounded-lg px-3 py-1 font-display text-[11px] sm:text-xs tracking-wider uppercase font-semibold"
                    style={{
                      backgroundColor: `${cat.color}18`,
                      color: cat.color,
                      border: `1px solid ${cat.color}45`,
                    }}
                  >
                    {cat.badge}
                  </span>
                  <span className="text-2xl" aria-hidden="true">
                    {cat.icon}
                  </span>
                </div>

                {/* Card Title */}
                <h3
                  className="font-display text-xl sm:text-2xl tracking-wide text-[#FFF5E9] transition-colors group-hover:text-[#FFD447]"
                  style={{
                    textShadow: "1px 1px 0px #0E0A1A",
                  }}
                >
                  {cat.title}
                </h3>

                {/* Card Description - Clean, readable, no scanlines */}
                <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-[#FFF5E9]/80">
                  {cat.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="mt-5">
                  <span className="block font-display text-[11px] tracking-wider text-[#68D5E8] uppercase mb-2">
                    Teknologi:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.techs.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-[#171224] px-2.5 py-1 font-body text-xs text-[#FFF5E9]/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Proyek Unggulan & Action Link */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="font-body text-xs text-[#FFF5E9]/65 truncate">
                  <span className="text-[#FFD447]">Proyek:</span> {cat.featuredProject}
                </div>

                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-display text-xs sm:text-sm font-bold tracking-wider transition-all hover:gap-2.5 shrink-0 cursor-pointer"
                  style={{
                    color: cat.color,
                    backgroundColor: `${cat.color}15`,
                    border: `1px solid ${cat.color}40`,
                  }}
                >
                  <span>Lihat Karya</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global Catalog Footer Link */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            href="/karya"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#68D5E8]/40 bg-[#211B35] px-8 py-3.5 font-display text-sm sm:text-base font-bold text-[#68D5E8] shadow-[4px_4px_0_#0E0A1A] transition-all hover:bg-[#68D5E8] hover:text-[#0E0A1A] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span>Lihat Semua Katalog Karya</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
