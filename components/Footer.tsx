import React from "react";
import Link from "next/link";
import ArcadeLogo from "@/components/ArcadeLogo";
import InvestorLogo from "@/components/InvestorLogo";
import { FOOTER_CONTENT, FOOTER_MARQUEE_TEXT } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Footer Pixel To Reality"
      className="w-full border-t border-[#39265E] bg-[#0E0A1A] text-[#FFF5E9]"
    >
      {/* Accessible marquee text for screen readers without bright moving animation */}
      <span className="sr-only">{FOOTER_MARQUEE_TEXT}</span>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        {/* Investors / Partners section */}
        <div className="mb-14 rounded-2xl border border-[#39265E] bg-[#211B35]/60 p-6 sm:p-8 backdrop-blur-sm">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl tracking-wide text-[#FFD447]">
              {FOOTER_CONTENT.heading}
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#FFF5E9]/75">
              {FOOTER_CONTENT.body}
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {FOOTER_CONTENT.investors.map((investor) => (
              <InvestorLogo key={investor.id} investor={investor} />
            ))}
          </ul>
        </div>

        {/* Navigation & Info Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <ArcadeLogo />
            <p className="mt-4 font-body text-sm leading-relaxed text-[#FFF5E9]/75 max-w-sm">
              Pixel To Reality: The Cyber Arcade. Pameran karya teknologi, game interaktif, inovasi software, IoT, dan digital art persembahan siswa Rekayasa Perangkat Lunak (RPL).
            </p>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3">
            <h4 className="font-display text-base tracking-wider uppercase text-[#FFD447]">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5 font-body text-sm">
              <li>
                <a href="#information" className="text-[#FFF5E9]/80 hover:text-[#FFD447] transition-colors">
                  Informasi P2R
                </a>
              </li>
              <li>
                <Link href="/karya" className="text-[#FFF5E9]/80 hover:text-[#FFD447] transition-colors">
                  Karya Pameran
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-[#FFF5E9]/80 hover:text-[#FFD447] transition-colors">
                  Game Arcade
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-[#FFF5E9]/80 hover:text-[#FFD447] transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/merchandise" className="text-[#FFF5E9]/80 hover:text-[#FFD447] transition-colors">
                  Merchandise
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-4">
            <h4 className="font-display text-base tracking-wider uppercase text-[#FFD447]">
              Kategori Karya
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/karya?category=game"
                className="rounded-lg border border-white/10 bg-[#211B35] px-3 py-1 font-body text-xs text-[#FFF5E9]/80 hover:border-[#FFD447] hover:text-[#FFD447] transition-colors"
              >
                Game Arcade
              </Link>
              <Link
                href="/karya?category=website"
                className="rounded-lg border border-white/10 bg-[#211B35] px-3 py-1 font-body text-xs text-[#FFF5E9]/80 hover:border-[#68D5E8] hover:text-[#68D5E8] transition-colors"
              >
                Web Innovation
              </Link>
              <Link
                href="/karya?category=software"
                className="rounded-lg border border-white/10 bg-[#211B35] px-3 py-1 font-body text-xs text-[#FFF5E9]/80 hover:border-[#F276A5] hover:text-[#F276A5] transition-colors"
              >
                Software Engineering
              </Link>
              <Link
                href="/karya?category=hardware_robotics"
                className="rounded-lg border border-white/10 bg-[#211B35] px-3 py-1 font-body text-xs text-[#FFF5E9]/80 hover:border-[#7AC70C] hover:text-[#7AC70C] transition-colors"
              >
                Hardware & Robotics
              </Link>
              <Link
                href="/karya?category=digital_art"
                className="rounded-lg border border-white/10 bg-[#211B35] px-3 py-1 font-body text-xs text-[#FFF5E9]/80 hover:border-[#9470E8] hover:text-[#9470E8] transition-colors"
              >
                Digital Art
              </Link>
            </div>
            <p className="mt-4 font-body text-xs text-[#FFF5E9]/60">
              Mendukung inovasi dan kreativitas generasi muda teknologi Indonesia.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-body text-xs text-[#FFF5E9]/60">
            {FOOTER_CONTENT.copyright}
          </p>
          <p className="mt-2 font-display text-xs tracking-wider text-[#68D5E8] sm:mt-0">
            PIXEL TO REALITY &bull; VOLT 1
          </p>
        </div>
      </div>
    </footer>
  );
}
