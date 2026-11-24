"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArcadeLogo from "@/components/ArcadeLogo";
import NavLink from "@/components/NavLink";
import { NAV_LINKS } from "@/lib/content";
import { useAuth } from "@/lib/auth/auth-context";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#39265E] bg-[#211B35]/95 shadow-md backdrop-blur-md">
      <nav
        aria-label="Navigasi Utama"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-10"
      >
        {/* Left: Official P2R Logo */}
        <div className="flex shrink-0 items-center">
          <ArcadeLogo />
        </div>

        {/* Center: Primary Navigation (4 core journeys) */}
        <ul className="hidden items-center gap-7 md:flex lg:gap-9">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                label={link.label}
                href={link.href}
                className="font-display text-base tracking-wide text-[#FFF5E9]/85 transition-colors hover:text-[#FFD447] focus-visible:text-[#FFD447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] rounded px-1 py-0.5"
                activeClassName="text-[#FFD447] underline underline-offset-8 decoration-2"
              />
            </li>
          ))}
        </ul>

        {/* Right: Auth / Profile & Mobile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:flex sm:items-center sm:gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#39265E] bg-[#171224] px-3.5 py-1.5 font-display text-sm text-[#68D5E8] transition-colors hover:border-[#FFD447] hover:text-[#FFD447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
                >
                  <span className="max-w-[140px] truncate">
                    {user?.name || "Profil Saya"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="min-h-10 rounded-xl border border-white/20 bg-black/30 px-3.5 py-1.5 font-display text-xs font-bold text-[#FFF5E9]/85 transition-colors hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] cursor-pointer"
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#FFD447] px-5 py-1.5 font-display text-sm font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button (44px touch target) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#39265E] bg-[#171224] text-white transition-colors hover:border-[#FFD447] hover:text-[#FFD447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] md:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-[#39265E] bg-[#0E0A1A] px-5 py-5 shadow-2xl md:hidden"
        >
          <ul className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  label={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex min-h-11 items-center rounded-xl px-4 py-2.5 font-display text-lg text-[#FFF5E9] transition-colors hover:bg-[#211B35] hover:text-[#FFD447] focus-visible:text-[#FFD447]"
                  activeClassName="bg-[#211B35] text-[#FFD447]"
                />
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-[#39265E] pt-4 sm:hidden">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex min-h-11 w-full items-center justify-center rounded-xl border border-[#68D5E8]/40 bg-[#171224] py-2.5 font-display text-base text-[#68D5E8] transition-colors hover:border-[#FFD447] hover:text-[#FFD447]"
                >
                  Profil: {user?.name || "Akun Saya"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="min-h-11 w-full rounded-xl border border-white/25 bg-black/40 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] cursor-pointer"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#FFD447] py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-transform hover:-translate-y-0.5"
              >
                Masuk ke Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
