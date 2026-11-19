"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

type CategoryItem = {
  id: string;
  label: string;
  title: string;
  tag: string;
  color: string;
  description: string;
  techs: string[];
  href: string;
};

const CATEGORIES: CategoryItem[] = [
  {
    id: "game",
    label: "GAME ARCADE",
    title: "Cyber Arcade Games",
    tag: "INTERACTIVE ENTERTAINMENT",
    color: "#FFD447",
    description: "Koleksi game retro pixel art, 2D/3D platformer seru, endless cyberpunk runner, dan game web canvas buatan siswa.",
    techs: ["Phaser.js", "Unity", "Godot", "WebAudio"],
    href: "/karya?category=game",
  },
  {
    id: "website",
    label: "WEB INNOVATION",
    title: "Web Platform & SaaS",
    tag: "MODERN WEB SYSTEMS",
    color: "#68D5E8",
    description: "Aplikasi web interaktif, sistem SaaS modern, portal sekolah terintegrasi, dan dashboard data visual yang responsif.",
    techs: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    href: "/karya?category=website",
  },
  {
    id: "software",
    label: "SOFTWARE",
    title: "Software & Utility",
    tag: "DESKTOP & SERVICES",
    color: "#F276A5",
    description: "Aplikasi kasir otomatis, sistem manajemen inventaris, utilitas desktop, dan arsitektur database terintegrasi.",
    techs: ["Python", "Electron", "PostgreSQL", "Node.js"],
    href: "/karya?category=software",
  },
  {
    id: "hardware_robotics",
    label: "IOT & HARDWARE",
    title: "IoT & Embedded Systems",
    tag: "SMART HARDWARE",
    color: "#02FD0C",
    description: "Inovasi perangkat keras mikrokontroler ESP32, pemilah sampah cerdas berbasis AI servo, sensor lingkungan, dan robotik.",
    techs: ["ESP32", "Arduino", "Servo Motors", "C++ / MicroPython"],
    href: "/karya?category=hardware_robotics",
  },
  {
    id: "digital_art",
    label: "DIGITAL ART",
    title: "Pixel Art & UI/UX Design",
    tag: "CREATIVE & ASSETS",
    color: "#9470E8",
    description: "Eksplorasi antarmuka digital UI/UX interaktif, ilustrasi sprite karakter retro 8-bit, 3D modelling, dan branding pameran.",
    techs: ["Figma", "Aseprite", "Blender", "Design Tokens"],
    href: "/karya?category=digital_art",
  },
];

// Tilt coordinates for each category (every 72° in 360° circle)
const CATEGORY_TILTS = [
  { x: 0, y: -18 },   // 0: Game Arcade (Top)
  { x: 17, y: -6 },   // 1: Web Innovation (Top-Right)
  { x: 11, y: 15 },   // 2: Software (Bottom-Right)
  { x: -11, y: 15 },  // 3: IoT & Hardware (Bottom-Left)
  { x: -17, y: -6 },  // 4: Digital Art (Top-Left)
];

export default function ArcadeCabinetSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Interactive Draggable Joystick State
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastTriggeredSectorRef = useRef<number | null>(null);

  const MAX_RADIUS = 24; // Maximum travel distance of stick from center
  const TRIGGER_THRESHOLD = 13; // Distance required to trigger category shift

  const activeCategory = CATEGORIES[selectedIdx] || CATEGORIES[0];

  const handleSelectCategory = (idx: number) => {
    const safeIdx = Math.max(0, Math.min(idx, CATEGORIES.length - 1));
    setSelectedIdx(safeIdx);
    const tilt = CATEGORY_TILTS[safeIdx];
    if (tilt) {
      setJoystickPos(tilt);
      setTimeout(() => {
        setJoystickPos({ x: 0, y: 0 });
      }, 300);
    }
  };

  // Joystick Pointer Drag Handlers (Supports Mouse, Touch, & Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(true);
    updateJoystickFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateJoystickFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    lastTriggeredSectorRef.current = null;
  };

  const updateJoystickFromPointer = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let x = dx;
    let y = dy;
    if (dist > MAX_RADIUS) {
      x = (dx / dist) * MAX_RADIUS;
      y = (dy / dist) * MAX_RADIUS;
    }

    setJoystickPos({ x, y });

    // Determine 5-way radial sector (Every 72° in 360° circle)
    // Sector 0 is centered at 0° (Top / 12:00)
    if (dist >= TRIGGER_THRESHOLD) {
      let angleDeg = Math.atan2(dx, -dy) * (180 / Math.PI);
      if (angleDeg < 0) angleDeg += 360;

      const sectorIdx = Math.floor(((angleDeg + 36) % 360) / 72);

      if (sectorIdx >= 0 && sectorIdx < CATEGORIES.length) {
        if (sectorIdx !== lastTriggeredSectorRef.current) {
          lastTriggeredSectorRef.current = sectorIdx;
          setSelectedIdx(sectorIdx);
        }
      }
    } else if (dist < TRIGGER_THRESHOLD / 2) {
      lastTriggeredSectorRef.current = null;
    }
  };

  // Keyboard accessibility for Joystick
  const handleJoystickKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleSelectCategory(0);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelectCategory((selectedIdx + 1) % CATEGORIES.length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleSelectCategory(2);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelectCategory((selectedIdx - 1 + CATEGORIES.length) % CATEGORIES.length);
    } else if (["1", "2", "3", "4", "5"].includes(e.key)) {
      e.preventDefault();
      handleSelectCategory(parseInt(e.key, 10) - 1);
    }
  };

  return (
    <section id="karya-arcade" className="relative w-full py-16 md:py-24 overflow-hidden border-t border-[#39265E] bg-[#171224]/80">
      {/* Background Ambience Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[130px]"
        style={{
          background: `radial-gradient(circle, ${activeCategory.color} 0%, #39265E 65%, transparent 100%)`,
          transition: "background 0.5s ease",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD447]/30 bg-[#FFD447]/10 px-4 py-1.5 font-display text-xs tracking-widest uppercase text-[#FFD447]">
            <span>🕹️</span>
            <span>INTERACTIVE ARCADE CABINET</span>
            <span>🕹️</span>
          </div>
          <h2
            className="mt-3 font-display text-4xl tracking-wider text-[#FFD447] sm:text-5xl md:text-6xl select-none"
            style={{
              textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
            }}
          >
            KARYA PAMERAN RPL
          </h2>
          <p className="mt-3 max-w-2xl mx-auto font-body text-base text-[#FFF5E9]/85 sm:text-lg">
            Pilih kategori karya untuk menjelajahi ragam inovasi teknologi buatan siswa Rekayasa Perangkat Lunak.
          </p>
        </div>

        {/* =========================================================================
            THE RETRO ARCADE CABINET (Bodi Mesin Dingdong Autentik & Interaktif)
           ========================================================================= */}
        <div className="relative mx-auto max-w-4xl rounded-[2.5rem] border-4 border-[#39265E] bg-[#0E0A1A] p-3 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),8px_8px_0_#0E0A1A]">
          {/* 1. TOP MARQUEE (Papan Lampu Neon Atas) */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#FFD447] bg-[#211B35] px-4 py-3 sm:py-4 shadow-[0_0_20px_rgba(255,212,71,0.2)]">
            <div className="flex items-center justify-between">
              {/* Left Speaker Grille */}
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-1 sm:h-8 sm:w-1.5 rounded-full bg-[#39265E]" />
                ))}
              </div>

              {/* Glowing Marquee Text */}
              <div className="flex flex-col items-center text-center">
                <span className="font-display text-xs tracking-widest text-[#68D5E8] uppercase drop-shadow-[0_0_6px_rgba(104,213,232,0.8)] sm:text-sm">
                  ★ PIXEL TO REALITY ★
                </span>
                <span className="font-display text-lg tracking-widest text-[#FFD447] drop-shadow-[0_0_10px_rgba(255,212,71,0.7)] sm:text-2xl">
                  THE CYBER ARCADE VOLT 1
                </span>
              </div>

              {/* Right Speaker Grille */}
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-1 sm:h-8 sm:w-1.5 rounded-full bg-[#39265E]" />
                ))}
              </div>
            </div>
          </div>

          {/* 2. CRT MONITOR BEZEL (Layar Kaca Arcade Melengkung dengan Scanlines) */}
          <div className="relative mt-4 sm:mt-6 overflow-hidden rounded-3xl border-4 sm:border-8 border-[#171224] bg-[#05030A] p-4 sm:p-7 shadow-inner">
            {/* CRT Glass Glare / Curved Screen Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)",
                backgroundSize: "100% 4px",
              }}
            />

            {/* CRT Screen Top Status Bar */}
            <div className="relative z-10 mb-4 flex items-center justify-between border-b border-[#39265E] pb-3 text-[11px] sm:text-xs font-display">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#02FD0C]" />
                <span className="text-[#02FD0C]">SYSTEM ONLINE</span>
              </div>
              <div className="text-[#68D5E8] tracking-wider">
                5 KATEGORI KARYA &bull; REKAYASA PERANGKAT LUNAK
              </div>
            </div>

            {/* CRT Screen Split Layout: Menu Pemilihan (Kiri) & Cartridge Preview (Kanan) */}
            <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-stretch">
              {/* Sisi Kiri: Arcade Category Menu List */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-2.5">
                <div className="mb-1">
                  <span className="font-display text-xs tracking-wider text-[#68D5E8] uppercase">
                    PILIH KATEGORI :
                  </span>
                </div>

                {CATEGORIES.map((cat, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(idx)}
                      className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 font-display text-xs sm:text-sm tracking-wider transition-all cursor-pointer text-left ${
                        isSelected
                          ? "scale-[1.02] border-2 shadow-[0_0_15px_rgba(255,212,71,0.3)]"
                          : "border border-white/10 bg-[#171224]/80 text-[#FFF5E9]/80 hover:bg-[#211B35] hover:text-white"
                      }`}
                      style={{
                        backgroundColor: isSelected ? "#211B35" : undefined,
                        borderColor: isSelected ? cat.color : undefined,
                        color: isSelected ? cat.color : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs ${isSelected ? "text-[#FFD447]" : "opacity-0 group-hover:opacity-100"}`}>
                          ▶
                        </span>
                        <span>{cat.label}</span>
                      </div>
                      <span className={`text-xs transition-transform ${isSelected ? "translate-x-1" : "opacity-30 group-hover:opacity-100"}`}>
                        ▶
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sisi Kanan: Mission Briefing / Cartridge Screen Preview */}
              <div
                className="lg:col-span-7 flex flex-col justify-between rounded-2xl border-2 p-5 sm:p-6 shadow-inner transition-colors duration-300"
                style={{
                  backgroundColor: "#171224",
                  borderColor: `${activeCategory.color}60`,
                }}
              >
                <div>
                  {/* Category Header Tag & Mission Level */}
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-md px-2.5 py-1 font-display text-[10px] tracking-wider uppercase font-bold"
                      style={{
                        backgroundColor: `${activeCategory.color}20`,
                        color: activeCategory.color,
                        border: `1px solid ${activeCategory.color}50`,
                      }}
                    >
                      {activeCategory.tag}
                    </span>
                    <span className="font-display text-[10px] text-[#FFF5E9]/70 tracking-wider">
                      STAGE 0{selectedIdx + 1} / 05
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="mt-4 font-display text-2xl tracking-wide sm:text-3xl drop-shadow-[2px_2px_0_#0E0A1A]"
                    style={{ color: activeCategory.color }}
                  >
                    {activeCategory.title}
                  </h3>

                  <p className="mt-3 font-body text-sm leading-relaxed text-[#FFF5E9]/90 sm:text-base">
                    {activeCategory.description}
                  </p>

                  {/* Tech Stack List */}
                  <div className="mt-5">
                    <span className="block font-display text-[11px] tracking-wider text-[#68D5E8] uppercase">
                      TECH ARSENAL &amp; TOOLS:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeCategory.techs.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-white/10 bg-[#211B35] px-3 py-1 font-display text-xs text-[#FFF5E9]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Action Button (Play / Demo) */}
                <div className="mt-7 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-display text-[#FFF5E9]/70">
                    <span className="text-[#02FD0C]">●</span> READY FOR DEMO
                  </div>

                  <Link
                    href={activeCategory.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-display text-sm font-bold text-[#0E0A1A] shadow-[3px_3px_0_#0E0A1A] transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                    style={{
                      backgroundColor: activeCategory.color,
                      boxShadow: `0 4px 14px ${activeCategory.color}50`,
                    }}
                  >
                    <span>JELAJAHI KARYA</span>
                    <span>▶</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ARCADE CONTROL PANEL (Clean Interactive Joystick Desk) */}
          <div className="relative mt-4 sm:mt-6 rounded-2xl border-2 border-[#39265E] bg-[#211B35] p-4 sm:p-5 shadow-[inset_0_4px_8px_rgba(255,255,255,0.05)]">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
              {/* Clean Retro Joystick (Draggable with Mouse or Touch) */}
              <div
                ref={joystickBaseRef}
                tabIndex={0}
                role="slider"
                aria-label="Arcade Joystick Pengontrol Kategori"
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuenow={selectedIdx}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onKeyDown={handleJoystickKeyDown}
                className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border-4 border-[#0E0A1A] bg-[#120D1F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.6)] touch-none select-none cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
              >
                {/* Outer Dust Ring / Washer */}
                <div className="absolute h-20 w-20 sm:h-22 sm:w-22 rounded-full border border-white/5 bg-[#171224] shadow-inner" />

                {/* Metallic Shaft (Follows Joystick Angle) */}
                <div
                  className="pointer-events-none absolute h-7 w-3 rounded-full bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 shadow-sm"
                  style={{
                    transform: `translate(${joystickPos.x * 0.4}px, ${joystickPos.y * 0.4}px)`,
                    transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />

                {/* The Red Arcade Joystick Ball (Draggable) */}
                <div
                  className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5A5A] via-[#EF4444] to-[#881313] transition-all pointer-events-none"
                  style={{
                    transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                    boxShadow: isDragging
                      ? `inset -3px -3px 8px rgba(0,0,0,0.7), inset 2px 2px 5px rgba(255,255,255,0.4), 0 0 16px rgba(239,68,68,0.6)`
                      : `inset -3px -3px 8px rgba(0,0,0,0.7), inset 2px 2px 5px rgba(255,255,255,0.4), ${-joystickPos.x * 0.3}px ${4 - joystickPos.y * 0.3}px 10px rgba(0,0,0,0.7)`,
                    transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {/* Shiny Specular Highlight Dot */}
                  <div className="absolute top-2.5 left-2.5 h-3.5 w-3.5 rounded-full bg-white/70 blur-[0.5px]" />
                </div>
              </div>

              {/* Clean Active Category Indicator */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-display text-[10px] tracking-widest text-[#FFF5E9]/50 uppercase">
                  KATEGORI TERPILIH
                </span>
                <div className="mt-1 flex items-center gap-2.5">
                  <span
                    className="inline-block h-3 w-3 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: activeCategory.color }}
                  />
                  <span
                    className="font-display text-lg sm:text-2xl font-bold tracking-wider transition-colors duration-300"
                    style={{ color: activeCategory.color }}
                  >
                    {activeCategory.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Catalog Footer Link */}
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Link
            href="/karya"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#68D5E8] bg-[#211B35] px-8 py-3.5 font-display text-base font-bold text-[#68D5E8] shadow-[4px_4px_0_#0E0A1A] transition-all hover:bg-[#68D5E8] hover:text-[#0E0A1A] hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <span>Lihat Seluruh Direktori Karya Lengkap</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
