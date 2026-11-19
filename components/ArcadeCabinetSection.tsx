"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

type CategoryItem = {
  id: string;
  label: string;
  title: string;
  color: string;
  description: string;
  techs: string[];
  href: string;
};

// Section Karya: Khusus karya non-game (Web Innovation, Software, IoT & Hardware, Digital Art)
const CATEGORIES: CategoryItem[] = [
  {
    id: "website",
    label: "WEB INNOVATION",
    title: "Web Platform & SaaS",
    color: "#68D5E8",
    description: "Aplikasi web modern, portal sekolah interaktif, dan dashboard data visual responsif.",
    techs: ["Next.js", "React", "TypeScript", "Tailwind"],
    href: "/karya?category=website",
  },
  {
    id: "software",
    label: "SOFTWARE",
    title: "Software & Desktop",
    color: "#F276A5",
    description: "Aplikasi kasir POS cerdas, sistem manajemen inventaris, dan database desktop.",
    techs: ["Electron", "Python", "PostgreSQL", "Node.js"],
    href: "/karya?category=software",
  },
  {
    id: "hardware_robotics",
    label: "IOT & HARDWARE",
    title: "IoT & Robotik",
    color: "#02FD0C",
    description: "Inovasi mikrokontroler ESP32, pemilah sampah cerdas AI servo, dan otomasi sensor.",
    techs: ["ESP32", "Arduino", "MicroPython", "Servo"],
    href: "/karya?category=hardware_robotics",
  },
  {
    id: "digital_art",
    label: "DIGITAL ART",
    title: "Pixel Art & UI/UX",
    color: "#9470E8",
    description: "Desain antarmuka UI/UX interaktif, aset sprite retro 8-bit, dan 3D modelling.",
    techs: ["Figma", "Aseprite", "Blender", "Tokens"],
    href: "/karya?category=digital_art",
  },
];

// Tilt coordinates for each of the 4 non-game categories
const CATEGORY_TILTS = [
  { x: 0, y: -18 }, // 0: Web Innovation (Top)
  { x: 18, y: 0 },  // 1: Software (Right)
  { x: 0, y: 18 },  // 2: IoT & Hardware (Bottom)
  { x: -18, y: 0 }, // 3: Digital Art (Left)
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

    // 4 cardinal directions: Up (0), Right (1), Down (2), Left (3)
    if (dist >= TRIGGER_THRESHOLD) {
      let sectorIdx: number;
      if (Math.abs(dy) >= Math.abs(dx)) {
        sectorIdx = dy < 0 ? 0 : 2; // Up: Web Innovation (0), Down: IoT & Hardware (2)
      } else {
        sectorIdx = dx > 0 ? 1 : 3; // Right: Software (1), Left: Digital Art (3)
      }

      if (sectorIdx !== lastTriggeredSectorRef.current) {
        lastTriggeredSectorRef.current = sectorIdx;
        setSelectedIdx(sectorIdx);
      }
    } else if (dist < TRIGGER_THRESHOLD / 2) {
      lastTriggeredSectorRef.current = null;
    }
  };

  // Keyboard accessibility for Joystick
  const handleJoystickKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleSelectCategory(0); // Web Innovation
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelectCategory(1); // Software
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleSelectCategory(2); // IoT & Hardware
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelectCategory(3); // Digital Art
    } else if (["1", "2", "3", "4"].includes(e.key)) {
      e.preventDefault();
      handleSelectCategory(parseInt(e.key, 10) - 1);
    }
  };

  return (
    <section id="karya-arcade" className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#171224]/90">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-10 text-center">
          <h2
            className="font-display text-4xl tracking-wider text-[#FFD447] sm:text-5xl md:text-6xl select-none"
            style={{
              textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
            }}
          >
            KARYA PAMERAN RPL
          </h2>
        </div>

        {/* =========================================================================
            THE RETRO ARCADE CABINET (Authentic, Fun & Clean)
           ========================================================================= */}
        <div className="relative mx-auto max-w-4xl rounded-[2.5rem] border-4 border-[#39265E] bg-[#0E0A1A] p-3 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.8),6px_6px_0_#0E0A1A]">
          {/* 1. TOP MARQUEE (Papan Lampu Arcade) */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#FFD447] bg-[#211B35] px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Left Speaker Grille */}
              <div className="flex gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-1 sm:h-8 sm:w-1.5 rounded-full bg-[#39265E]" />
                ))}
              </div>

              {/* Marquee Title */}
              <div className="flex items-center gap-2 text-center">
                <span className="font-display text-lg tracking-widest text-[#FFD447] sm:text-2xl">
                  PAMERAN KARYA RPL
                </span>
              </div>

              {/* Right Speaker Grille */}
              <div className="flex gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-1 sm:h-8 sm:w-1.5 rounded-full bg-[#39265E]" />
                ))}
              </div>
            </div>
          </div>

          {/* 2. CRT MONITOR (Layar Arcade Bersih - Tanpa Teks Numpuk) */}
          <div className="relative mt-4 sm:mt-6 overflow-hidden rounded-3xl border-4 sm:border-8 border-[#171224] bg-[#0A0713] p-5 sm:p-7 shadow-inner">
            {/* Clean Split Layout: 4 Menu Buttons (Left) & Focused Details (Right) */}
            <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-center">
              {/* Sisi Kiri: 4 Tombol Kategori Langsung (Tanpa Label Redundan) */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                {CATEGORIES.map((cat, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(idx)}
                      className={`group flex w-full items-center justify-between rounded-xl px-4 py-3.5 font-display text-sm tracking-wider transition-all cursor-pointer text-left ${
                        isSelected
                          ? "scale-[1.02] border-2 shadow-[2px_2px_0_#0E0A1A]"
                          : "border border-white/10 bg-[#171224]/80 text-[#FFF5E9]/75 hover:bg-[#211B35] hover:text-white"
                      }`}
                      style={{
                        backgroundColor: isSelected ? "#211B35" : undefined,
                        borderColor: isSelected ? cat.color : undefined,
                        color: isSelected ? cat.color : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>
                          ▶
                        </span>
                        <span>{cat.label}</span>
                      </div>
                      <span className={`text-xs transition-transform ${isSelected ? "translate-x-0.5 opacity-100" : "opacity-25"}`}>
                        ▶
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sisi Kanan: Kartu Detail Kategori Bersih & Bernafas */}
              <div
                className="lg:col-span-7 flex flex-col justify-between rounded-2xl border-2 p-6 sm:p-7 shadow-inner min-h-[220px] transition-colors duration-200"
                style={{
                  backgroundColor: "#171224",
                  borderColor: `${activeCategory.color}60`,
                }}
              >
                <div>
                  {/* Category Title (Clean & Prominent) */}
                  <h3
                    className="font-display text-2xl tracking-wide sm:text-3xl"
                    style={{ color: activeCategory.color }}
                  >
                    {activeCategory.title}
                  </h3>

                  {/* Clean 1-Line Description */}
                  <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-[#FFF5E9]/85">
                    {activeCategory.description}
                  </p>

                  {/* Tech Stack Pills (Langsung Tampil Tanpa Label Tambahan) */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {activeCategory.techs.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/10 bg-[#211B35] px-3 py-1 font-body text-xs text-[#FFF5E9]/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                  <Link
                    href={activeCategory.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-display text-sm font-bold text-[#0E0A1A] shadow-[3px_3px_0_#0E0A1A] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                    style={{
                      backgroundColor: activeCategory.color,
                    }}
                  >
                    <span>Lihat Detail Karya</span>
                    <span>▶</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ARCADE CONTROL PANEL (Tuas Joystick Interaktif dengan Arah Jelas) */}
          <div className="relative mt-4 sm:mt-6 rounded-2xl border-2 border-[#39265E] bg-[#211B35] p-5 shadow-[inset_0_4px_8px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center">
            {/* The Draggable Retro Joystick */}
            <div className="relative flex items-center justify-center">
              {/* Directional Indicator Labels around Collar */}
              <span
                className={`absolute -top-5 font-display text-[10px] tracking-widest transition-colors ${
                  selectedIdx === 0 ? "text-[#68D5E8] font-bold" : "text-[#FFF5E9]/40"
                }`}
              >
                ▲ WEB
              </span>
              <span
                className={`absolute -right-14 font-display text-[10px] tracking-widest transition-colors ${
                  selectedIdx === 1 ? "text-[#F276A5] font-bold" : "text-[#FFF5E9]/40"
                }`}
              >
                SOFT ▶
              </span>
              <span
                className={`absolute -bottom-5 font-display text-[10px] tracking-widest transition-colors ${
                  selectedIdx === 2 ? "text-[#02FD0C] font-bold" : "text-[#FFF5E9]/40"
                }`}
              >
                ▼ IOT
              </span>
              <span
                className={`absolute -left-14 font-display text-[10px] tracking-widest transition-colors ${
                  selectedIdx === 3 ? "text-[#9470E8] font-bold" : "text-[#FFF5E9]/40"
                }`}
              >
                ◀ ART
              </span>

              {/* Joystick Base Socket */}
              <div
                ref={joystickBaseRef}
                tabIndex={0}
                role="slider"
                aria-label="Arcade Joystick Pengontrol Kategori"
                aria-valuemin={0}
                aria-valuemax={3}
                aria-valuenow={selectedIdx}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onKeyDown={handleJoystickKeyDown}
                className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-[#0E0A1A] bg-[#120D1F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.6)] touch-none select-none cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
              >
                {/* Dust Washer */}
                <div className="absolute h-14 w-14 sm:h-16 sm:w-16 rounded-full border border-white/5 bg-[#171224] shadow-inner" />

                {/* Metallic Shaft */}
                <div
                  className="pointer-events-none absolute h-5 w-2 rounded-full bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 shadow-sm"
                  style={{
                    transform: `translate(${joystickPos.x * 0.4}px, ${joystickPos.y * 0.4}px)`,
                    transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />

                {/* The Red Ball */}
                <div
                  className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5A5A] via-[#EF4444] to-[#881313] transition-all pointer-events-none"
                  style={{
                    transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                    boxShadow: isDragging
                      ? `inset -2px -2px 6px rgba(0,0,0,0.7), inset 2px 2px 4px rgba(255,255,255,0.4)`
                      : `inset -2px -2px 6px rgba(0,0,0,0.7), inset 2px 2px 4px rgba(255,255,255,0.4), ${-joystickPos.x * 0.25}px ${3 - joystickPos.y * 0.25}px 8px rgba(0,0,0,0.7)`,
                    transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <div className="absolute top-1.5 left-1.5 h-2.5 w-2.5 rounded-full bg-white/70 blur-[0.5px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Catalog Footer Link */}
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <Link
            href="/karya"
            className="inline-flex items-center gap-2 rounded-xl border border-[#68D5E8]/40 bg-[#211B35] px-8 py-3.5 font-display text-sm sm:text-base font-bold text-[#68D5E8] shadow-[3px_3px_0_#0E0A1A] transition-all hover:bg-[#68D5E8] hover:text-[#0E0A1A] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span>Lihat Semua Karya</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
