"use client";

import React, { useState, useEffect } from "react";

export default function P2RVoltSection() {
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes countdown simulation

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <section id="information" className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#171224]/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-display text-4xl tracking-wider text-[#FFD447] sm:text-5xl md:text-6xl drop-shadow-[3px_3px_0_#0E0A1A]">
            P2R VOLT 1
          </h2>
          <p className="mt-3 max-w-2xl font-body text-base text-[#FFF5E9]/80 sm:text-lg">
            Pameran karya inovasi dan panggung unjuk talenta siswa jurusan Rekayasa Perangkat Lunak.
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Cyber Information Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border-2 border-[#39265E] bg-[#171224] p-6 shadow-[8px_8px_0_#0E0A1A] sm:p-8">
            <div>
              {/* Terminal Title Bar */}
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
                  <span className="h-3 w-3 rounded-full bg-[#FFD447]" />
                  <span className="h-3 w-3 rounded-full bg-[#68D5E8]" />
                  <span className="ml-2 font-display text-xs tracking-wider text-[#FFD447] sm:text-sm">
                    PROFIL_EVENT.SYS
                  </span>
                </div>
                <span className="rounded-md bg-[#211B35] px-2.5 py-0.5 font-display text-[11px] text-[#68D5E8] border border-[#68D5E8]/30">
                  VOLT 1.0 AKTIF
                </span>
              </div>

              {/* Dialog Body Text */}
              <div className="space-y-4 font-body text-base leading-relaxed text-[#FFF5E9]/90 sm:text-lg">
                <p>
                  <strong className="text-[#FFD447]">Pixel To Reality (P2R)</strong>{" "}
                  merupakan pameran tahunan karya siswa jurusan{" "}
                  <strong className="text-[#68D5E8]">
                    Rekayasa Perangkat Lunak (RPL)
                  </strong>
                  . Event ini menjadi wadah apresiasi untuk memamerkan produk inovasi teknologi,
                  game retro interaktif, aplikasi web, dan sistem cerdas yang siap bersaing di industri digital.
                </p>
                <p>
                  Melalui pameran interaktif ini, pengunjung dapat mencoba langsung puluhan project,
                  memberikan dukungan voting kepada karya favorit, serta bertanding mencetak skor tertinggi
                  di turnamen arcade live.
                </p>
              </div>
            </div>

            {/* Feature Badges Row - Clean Standard Indonesian */}
            <div className="mt-8 flex flex-wrap gap-2.5 border-t border-white/10 pt-6">
              <span className="rounded-xl border border-[#39265E] bg-[#211B35] px-3.5 py-1.5 font-display text-xs text-[#68D5E8]">
                Pameran Interaktif
              </span>
              <span className="rounded-xl border border-[#39265E] bg-[#211B35] px-3.5 py-1.5 font-display text-xs text-[#FFD447]">
                Turnamen Arcade
              </span>
              <span className="rounded-xl border border-[#39265E] bg-[#211B35] px-3.5 py-1.5 font-display text-xs text-[#F276A5]">
                Voting Karya Publik
              </span>
              <span className="rounded-xl border border-[#39265E] bg-[#211B35] px-3.5 py-1.5 font-display text-xs text-[#02FD0C]">
                Demo IoT &amp; Hardware
              </span>
            </div>
          </div>

          {/* Right Column: Countdown Console (Clean & Balanced, No Cluttered Stats) */}
          <div className="lg:col-span-5 flex flex-col justify-center rounded-3xl border-2 border-[#39265E] bg-[#171224] p-6 shadow-[8px_8px_0_#0E0A1A] sm:p-8">
            {/* Live Countdown Console */}
            <div className="rounded-2xl border-2 border-[#9470E8]/50 bg-[#39265E]/40 p-6 sm:p-8 text-center flex flex-col items-center justify-center">
              <span className="font-display text-xs tracking-widest uppercase text-[#FFD447] sm:text-sm">
                SESI PAMERAN &amp; TURNAMEN
              </span>

              <div className="mt-6 flex items-center justify-center">
                <div className="rounded-2xl bg-[#0E0A1A] px-8 py-4 border border-[#68D5E8]/40 shadow-inner">
                  <span className="font-display text-4xl sm:text-6xl tracking-widest text-[#68D5E8]">
                    {formattedTime}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm font-body text-[#FFF5E9]/75 max-w-xs">
                Waktu menuju penutupan sesi pameran &amp; rekapitulasi poin turnamen
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
