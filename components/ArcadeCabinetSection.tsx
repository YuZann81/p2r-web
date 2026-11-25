"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CategorySlot = {
  id: string;
  title: string;
  accent: string;
  thumbnail: string;
  href: string;
};

const KARYA_CATEGORY_SLOTS: readonly CategorySlot[] = [
  {
    id: "website",
    title: "Website",
    accent: "#68D5E8",
    thumbnail: "/images/karya/website.svg",
    href: "/karya?category=website",
  },
  {
    id: "game",
    title: "Game",
    accent: "#FFD447",
    thumbnail: "/images/karya/game.svg",
    href: "/games",
  },
  {
    id: "software",
    title: "Software",
    accent: "#F276A5",
    thumbnail: "/images/karya/software.svg",
    href: "/karya?category=software",
  },
  {
    id: "hardware_robotics",
    title: "IoT & Hardware",
    accent: "#02FD0C",
    thumbnail: "/images/karya/iot.svg",
    href: "/karya?category=hardware_robotics",
  },
  {
    id: "digital_art",
    title: "Digital Art",
    accent: "#9470E8",
    thumbnail: "/images/karya/digital-art.svg",
    href: "/karya?category=digital_art",
  },
  {
    id: "all",
    title: "Semua Karya",
    accent: "#F5A05E",
    thumbnail: "/images/karya/semua-karya.svg",
    href: "/karya",
  },
] as const;

const GRID_COLS = 3;

type Direction = "up" | "down" | "left" | "right";
type PhysicalButtonId = "left" | "right" | "visit" | null;

type JoystickPose = {
  rotateDeg: number;
  translateY: number;
  scaleY: number;
};

const IDLE_POSE: JoystickPose = { rotateDeg: 0, translateY: 0, scaleY: 1 };

function getPoseForDirection(dir: Direction): JoystickPose {
  switch (dir) {
    case "left":
      return { rotateDeg: -22, translateY: 0, scaleY: 1 };
    case "right":
      return { rotateDeg: 22, translateY: 0, scaleY: 1 };
    case "up":
      return { rotateDeg: 0, translateY: -4, scaleY: 0.88 };
    case "down":
      return { rotateDeg: 0, translateY: 4, scaleY: 1.08 };
  }
}

export default function ArcadeCabinetSection() {
  const router = useRouter();
  const cabinetRef = useRef<HTMLDivElement>(null);
  const joystickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [joystickPose, setJoystickPose] = useState<JoystickPose>(IDLE_POSE);
  const [pressedBtn, setPressedBtn] = useState<PhysicalButtonId>(null);

  const totalSlots = KARYA_CATEGORY_SLOTS.length;
  const activeCategory = KARYA_CATEGORY_SLOTS[activeSlot] || KARYA_CATEGORY_SLOTS[0];

  useEffect(() => {
    return () => {
      if (joystickTimerRef.current) clearTimeout(joystickTimerRef.current);
      if (buttonTimerRef.current) clearTimeout(buttonTimerRef.current);
    };
  }, []);

  const setDirectionalTilt = useCallback((dir: Direction | null, autoReset = true) => {
    if (joystickTimerRef.current) clearTimeout(joystickTimerRef.current);
    if (!dir) {
      setJoystickPose(IDLE_POSE);
      return;
    }
    setJoystickPose(getPoseForDirection(dir));
    if (autoReset) {
      joystickTimerRef.current = setTimeout(() => {
        setJoystickPose(IDLE_POSE);
      }, 240);
    }
  }, []);

  const pulseButton = (btn: Exclude<PhysicalButtonId, null>, autoReset = true) => {
    if (buttonTimerRef.current) clearTimeout(buttonTimerRef.current);
    setPressedBtn(btn);
    if (autoReset) {
      buttonTimerRef.current = setTimeout(() => {
        setPressedBtn(null);
      }, 150);
    }
  };

  const stepSlot = useCallback(
    (direction: Direction) => {
      setActiveSlot((prev) => {
        if (direction === "right") {
          return (prev + 1) % totalSlots;
        }
        if (direction === "left") {
          return (prev - 1 + totalSlots) % totalSlots;
        }
        if (direction === "down") {
          return prev + GRID_COLS < totalSlots ? prev + GRID_COLS : prev % GRID_COLS;
        }
        // direction === "up"
        return prev - GRID_COLS >= 0 ? prev - GRID_COLS : (prev % GRID_COLS) + GRID_COLS;
      });
    },
    [totalSlots],
  );

  const handleMoveLeft = () => {
    pulseButton("left");
    setDirectionalTilt("left", true);
    stepSlot("left");
  };

  const handleMoveRight = () => {
    pulseButton("right");
    setDirectionalTilt("right", true);
    stepSlot("right");
  };

  const handleVisitActive = () => {
    pulseButton("visit");
    router.push(activeCategory.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      pulseButton("left", false);
      setDirectionalTilt("left", false);
      stepSlot("left");
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      pulseButton("right", false);
      setDirectionalTilt("right", false);
      stepSlot("right");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setDirectionalTilt("up", false);
      stepSlot("up");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDirectionalTilt("down", false);
      stepSlot("down");
      return;
    }
    if (e.key === "Enter") {
      const isNativeButton = target?.tagName === "BUTTON";
      const isCardLink = target?.tagName === "A";
      if (isNativeButton) return;

      pulseButton("visit", false);
      if (!isCardLink) {
        e.preventDefault();
        router.push(activeCategory.href);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      setDirectionalTilt(null, false);
      setPressedBtn(null);
    }
    if (e.key === "Enter") {
      setPressedBtn(null);
    }
  };

  const joystickTransformStyle = `rotate(${joystickPose.rotateDeg.toFixed(1)}deg) translateY(${joystickPose.translateY.toFixed(1)}%) scaleY(${joystickPose.scaleY.toFixed(3)})`;

  return (
    <section
      id="karya-arcade"
      className="relative w-full border-t border-[#39265E] bg-[#0B0F26] py-8 sm:py-12"
    >
      {/* Container utama: position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16 / 9; overflow: hidden */}
      <div
        ref={cabinetRef}
        tabIndex={0}
        role="region"
        aria-label="Mesin Arcade Kategori Karya — Gunakan tombol kiri/kanan dan tombol Kunjungi"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className="arcade-cabinet-stage rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68D5E8]"
      >
        {/* LAYER 1 — Background (z-index: 1) */}
        <img
          src="/assets/background.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
          style={{ zIndex: 1 }}
        />

        {/* KONTEN LAYAR CRT — Grid 3x2 Kategori Karya + Scanline (z-index: 2) */}
        <div
          className="arcade-crt-screen flex flex-col justify-between bg-[#070B1E] p-[1.2%]"
          style={{ zIndex: 2 }}
        >
          {/* Grid 3x2 — 6 Kategori Karya */}
          <div
            role="grid"
            aria-label="Daftar Kategori Karya"
            className="relative z-10 grid h-full w-full grid-cols-3 grid-rows-2 gap-[1cqi]"
          >
            {KARYA_CATEGORY_SLOTS.map((cat, slotIdx) => {
              const isActive = slotIdx === activeSlot;
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onMouseEnter={() => setActiveSlot(slotIdx)}
                  onFocus={() => setActiveSlot(slotIdx)}
                  data-active={isActive ? "true" : "false"}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-lg border transition-all duration-150 focus-visible:outline-none ${
                    isActive
                      ? "z-10 scale-[1.02] border-[2px] border-[#68D5E8] shadow-[0_0_14px_rgba(104,213,232,0.85),inset_0_0_10px_rgba(104,213,232,0.3)]"
                      : "border-white/15 bg-[#0C1230] opacity-85 hover:opacity-100 hover:border-[#F276A5]/80"
                  }`}
                >
                  <img
                    src={cat.thumbnail}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050817] via-[#050817]/35 to-transparent" />

                  <div className="relative z-10 w-full px-[6%] py-[5%]">
                    <p
                      className={`line-clamp-1 font-display text-[1.25cqi] leading-tight tracking-wide transition-colors ${
                        isActive
                          ? "text-[#FFD447]"
                          : "text-[#FFF5E9]/95 group-hover:text-[#FFD447]"
                      }`}
                    >
                      {cat.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CRT Scanline & Curvature Effect Overlay */}
          <div className="arcade-crt-scanlines z-20" aria-hidden="true" />
        </div>

        {/* LAYER 2 — Cabinet Body (z-index: 3) */}
        <img
          src="/assets/cabinet-body.png"
          alt="Kabinet Mesin Arcade Pameran Karya"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-fill select-none"
          style={{ zIndex: 3 }}
        />

        {/* LAYER 4 — Screen Glare (z-index: 4) */}
        <img
          src="/assets/screen-glare.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute object-fill select-none"
          style={{
            top: "var(--screen-top)",
            left: "var(--screen-left)",
            width: "var(--screen-width)",
            height: "var(--screen-height)",
            borderRadius: "var(--screen-radius)",
            zIndex: 4,
          }}
        />

        {/* LAYER 3 — Marquee Text HTML Asli (z-index: 5) */}
        <div
          className="arcade-marquee-box pointer-events-none flex items-center justify-center px-[1.5%] py-[0.5%]"
          style={{ zIndex: 5 }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-[#EC4899] bg-[#0B122B]/95 px-[3%] shadow-[0_0_20px_rgba(236,72,153,0.6),inset_0_0_12px_rgba(104,213,232,0.22)]">
            <h2
              className="truncate text-center font-display text-[2.45cqi] font-bold uppercase leading-none tracking-[0.15em] text-[#FFD447] select-none"
              style={{
                textShadow: "0 0 12px rgba(255, 212, 71, 0.5), 2px 2px 0 #4A154B",
              }}
            >
              KARYA PAMERAN RPL
            </h2>
          </div>
        </div>

        {/* LAYER 5 — Interactive Controls: 2 Tombol Kiri, Tuas Non-Pointer di Tengah, 1 Tombol Kunjungi Kanan (z-index: 5) */}
        <div
          className="pointer-events-none absolute bottom-[12.5%] left-[17%] right-[17%] flex h-[20%] items-end justify-between px-[4%]"
          style={{ zIndex: 5 }}
        >
          {/* Left Arcade Buttons: Pindahkan Kiri / Kanan */}
          <div className="pointer-events-auto flex items-end gap-[2cqi] pb-[0.5%]">
            <button
              type="button"
              onClick={handleMoveLeft}
              data-pressed={pressedBtn === "left" ? "true" : "false"}
              aria-label="Geser Pilihan ke Kiri"
              title="Kiri"
              className="arcade-physical-btn group flex flex-col items-center gap-[0.3cqi] cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
            >
              <img
                src="/assets/button.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="pointer-events-none h-[4cqi] w-[5.3cqi] object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)] select-none"
              />
              <span className="font-display text-[0.78cqi] tracking-widest text-[#FFF5E9]/90 group-hover:text-[#FFD447]">
                ◀ KIRI
              </span>
            </button>

            <button
              type="button"
              onClick={handleMoveRight}
              data-pressed={pressedBtn === "right" ? "true" : "false"}
              aria-label="Geser Pilihan ke Kanan"
              title="Kanan"
              className="arcade-physical-btn group flex flex-col items-center gap-[0.3cqi] cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
            >
              <img
                src="/assets/button.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="pointer-events-none h-[4cqi] w-[5.3cqi] object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)] select-none"
              />
              <span className="font-display text-[0.78cqi] tracking-widest text-[#FFF5E9]/90 group-hover:text-[#FFD447]">
                KANAN ▶
              </span>
            </button>
          </div>

          {/* Center Joystick — Hanya bergerak mengikuti tombol kiri/kanan (tidak bisa digerakkan lewat mouse/touch langsung) */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative mb-[2.4%] flex h-[10.5cqi] w-[9cqi] select-none items-end justify-center"
          >
            <img
              src="/assets/joystick.png"
              alt="Joystick Arcade"
              draggable={false}
              className="arcade-joystick-img pointer-events-none h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)] select-none"
              style={{
                transformOrigin: "bottom center",
                transform: joystickTransformStyle,
                transition: "transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>

          {/* Right Arcade Button: Hanya Tombol Kunjungi */}
          <div className="pointer-events-auto flex w-[12.6cqi] items-end justify-center pb-[0.5%]">
            <button
              type="button"
              onClick={handleVisitActive}
              data-pressed={pressedBtn === "visit" ? "true" : "false"}
              aria-label={`Kunjungi Kategori ${activeCategory.title}`}
              title={`Kunjungi ${activeCategory.title} (Enter)`}
              className="arcade-physical-btn group flex flex-col items-center gap-[0.3cqi] cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68D5E8]"
            >
              <img
                src="/assets/button.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="pointer-events-none h-[4.2cqi] w-[5.6cqi] object-contain drop-shadow-[0_4px_10px_rgba(236,72,153,0.5)] select-none"
              />
              <span className="font-display text-[0.82cqi] font-bold tracking-widest text-[#FFD447]">
                KUNJUNGI
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
