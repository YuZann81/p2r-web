import React from "react";

export default function PartnersSection() {
  return (
    <section
      aria-labelledby="organizer-heading"
      className="relative w-full py-14 md:py-20 border-t border-[#39265E] bg-[#171224]/80"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h3
          id="organizer-heading"
          className="font-display text-2xl tracking-widest text-[#ffe500] sm:text-3xl drop-shadow-[2px_2px_0_#0E0A1A]"
        >
          PENYELENGGARA
        </h3>

        <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-[#5b2be6]/45 bg-[#211B35] p-3 shadow-md">
            <img
              src="/images/rpl-emblem.png"
              alt="Emblem Jurusan Rekayasa Perangkat Lunak (RPL)"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="text-center sm:text-left">
            <p className="font-display text-xl tracking-wide text-[#FFF5E9] sm:text-2xl">
              SMKN 1 Katapang &times; RPL
            </p>
            <p className="mt-1 max-w-md font-body text-sm leading-relaxed text-[#B7ABCE]">
              Diselenggarakan oleh Kompetensi Keahlian Rekayasa Perangkat Lunak
              (RPL) SMKN 1 Katapang.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
