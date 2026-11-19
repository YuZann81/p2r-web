import React from "react";
import Image from "next/image";

export default function PartnersSection() {
  return (
    <section className="relative w-full py-16 md:py-24 border-t border-[#39265E] bg-[#171224]/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Organizer Section */}
        <div className="mb-16">
          <h3 className="font-display text-2xl tracking-widest text-[#FFD447] sm:text-3xl drop-shadow-[2px_2px_0_#0E0A1A]">
            ORGANIZER :
          </h3>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {/* Organizer 1 */}
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-white/10 bg-[#211B35] p-3 shadow-md transition-transform hover:scale-105">
              <img
                src="/images/retro/logos/organizer-1.png"
                alt="SMK Organizer Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Organizer 2 */}
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-white/10 bg-[#211B35] p-3 shadow-md transition-transform hover:scale-105">
              <img
                src="/images/retro/logos/organizer-2.png"
                alt="Tech Community Organizer Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* RPL Emblem */}
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-[#FFD447]/30 bg-[#211B35] p-3 shadow-md transition-transform hover:scale-105">
              <img
                src="/images/rpl-emblem.png"
                alt="RPL Jurusan Emblem"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Sponsor Section */}
        <div>
          <h3 className="font-display text-2xl tracking-widest text-[#68D5E8] sm:text-3xl drop-shadow-[2px_2px_0_#0E0A1A]">
            SPONSOR :
          </h3>

          <div className="mt-8 mx-auto max-w-3xl rounded-3xl border-2 border-[#9470E8]/40 bg-[#39265E]/40 p-6 sm:p-8 backdrop-blur-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center">
              {/* Sponsor 1 */}
              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/retro/logos/sponsor-knot.png"
                  alt="Sponsor Knot"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>

              {/* Sponsor 2 */}
              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/retro/logos/sponsor-leaf.png"
                  alt="Sponsor Leaf"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>

              {/* Sponsor 3 */}
              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/retro/logos/sponsor-n.png"
                  alt="Sponsor Slash N"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>

              {/* Sponsor 4 */}
              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/retro/logos/sponsor-lotus.png"
                  alt="Sponsor Lotus"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>

              {/* Additional partners */}
              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/investors/agate.png"
                  alt="Agate Game Studio"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>

              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/investors/aice.png"
                  alt="Aice"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>

              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/investors/indomie.png"
                  alt="Indomie"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>

              <div className="flex h-16 w-32 items-center justify-center rounded-xl bg-white/5 p-2 transition-transform hover:scale-110">
                <img
                  src="/images/investors/kabayan.png"
                  alt="Kabayan Group"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
