"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArcadeLogo from "@/components/ArcadeLogo";
import NavLink from "@/components/NavLink";
import { NAV_LINKS } from "@/lib/content";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when pressing Escape
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
    <header className="sticky top-0 z-50 w-full border-b border-[#39265E] bg-[#211B35]/98 shadow-md backdrop-blur-md transition-all">
      <nav
        aria-label="Navigasi Utama"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 md:px-10"
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <ArcadeLogo />
        </div>

        {/* Center: Desktop Navigation Links */}
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                label={link.label}
                href={link.href}
                className="font-display text-base text-white transition-colors hover:text-[#FFD447] hover:underline underline-offset-4 focus-visible:text-[#FFD447] focus-visible:outline-none"
              />
            </li>
          ))}
        </ul>

        {/* Right: Actions (Cart, Auth, Mobile Hamburger) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cart Icon & Live Badge */}
          <Link
            href="/checkout"
            aria-label={`Keranjang Belanja (${totalItems} item)`}
            className="relative flex items-center justify-center rounded-xl border border-[#39265E] bg-[#39265E] p-2.5 text-white transition-colors hover:border-[#FFD447] hover:text-[#FFD447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
          >
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD447] font-display text-xs font-bold text-[#0E0A1A] shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Desktop Auth State */}
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="font-display text-xs text-[#68D5E8]">
                  {user?.name ? `Hai, ${user.name}` : "Akun Terhubung"}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-xl border border-white/30 bg-black/40 px-3.5 py-1.5 font-display text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-[#FFD447] px-4 py-1.5 font-display text-sm font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="flex items-center justify-center rounded-xl border border-white/20 bg-black/40 p-2.5 text-white transition-colors hover:border-[#FFD447] hover:text-[#FFD447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] md:hidden cursor-pointer"
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
          className="border-t border-[#39265E] bg-[#0E0A1A] px-6 py-6 shadow-2xl backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  label={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block rounded-lg py-3 px-4 font-display text-lg font-bold text-white transition-colors hover:bg-white/10 hover:text-[#FFD447] focus-visible:text-[#FFD447]"
                />
              </li>
            ))}
          </ul>

          {/* Mobile Auth Button */}
          <div className="mt-6 border-t border-[#39265E] pt-5 sm:hidden">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <span className="font-display text-sm text-[#68D5E8]">
                  {user?.name ? `Hai, ${user.name}` : "Akun Terhubung"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full rounded-xl border border-white/30 bg-black/40 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center rounded-xl bg-[#FFD447] py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-transform hover:-translate-y-0.5"
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
