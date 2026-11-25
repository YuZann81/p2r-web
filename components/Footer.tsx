import React from "react";
import Link from "next/link";
import ArcadeLogo from "@/components/ArcadeLogo";
import { FOOTER_CONTENT } from "@/lib/content";
import { KARYA_FILTERABLE_CATEGORIES } from "@/lib/karya/categories";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Footer Pixel To Reality"
      className="w-full border-t border-[#39265E] bg-[#0E0A1A] text-[#FFF5E9]"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12">
        {/* Compact Navigation & Info Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <ArcadeLogo />
            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-[#FFF5E9]/75">
              Pixel To Reality: The Cyber Arcade. Pameran karya teknologi, game
              interaktif, inovasi software, IoT, dan digital art persembahan
              siswa Rekayasa Perangkat Lunak (RPL) SMKN 1 Katapang.
            </p>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3">
            <h4 className="font-display text-base tracking-wider uppercase text-[#ffe500]">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5 font-body text-sm">
              <li>
                <Link
                  href="/#information"
                  className="text-[#FFF5E9]/80 hover:text-[#ffe500] transition-colors"
                >
                  Tentang P2R
                </Link>
              </li>
              <li>
                <Link
                  href="/karya"
                  className="text-[#FFF5E9]/80 hover:text-[#ffe500] transition-colors"
                >
                  Karya Pameran
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="text-[#FFF5E9]/80 hover:text-[#ffe500] transition-colors"
                >
                  Game Arcade
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-[#FFF5E9]/80 hover:text-[#ffe500] transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories (single source of truth matching KaryaDirectory) */}
          <div className="md:col-span-4">
            <h4 className="font-display text-base tracking-wider uppercase text-[#ffe500]">
              Kategori Karya
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {KARYA_FILTERABLE_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/karya?category=${category.id}`}
                  className="rounded-lg border border-[#5b2be6]/40 bg-[#211B35] px-3 py-1.5 font-body text-xs text-[#FFF5E9]/85 hover:border-[#ffe500] hover:text-[#ffe500] transition-colors"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-body text-xs text-[#FFF5E9]/60">
            {FOOTER_CONTENT.copyright}
          </p>
          <p className="mt-2 font-display text-xs tracking-wider text-[#B7ABCE] sm:mt-0">
            SMKN 1 KATAPANG &middot; REKAYASA PERANGKAT LUNAK
          </p>
        </div>
      </div>
    </footer>
  );
}
