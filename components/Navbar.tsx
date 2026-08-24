"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ArcadeLogo from "@/components/ArcadeLogo";
import NavLink from "@/components/NavLink";
import { NAV_LINKS } from "@/lib/content";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { CustomDialog } from "@/components/ui/CustomDialog";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutDialog(false);
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/15 bg-[#180e3d]/95 shadow-md backdrop-blur-md transition-all">
        <nav
          aria-label="Navigasi Utama"
          className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 md:px-8"
        >
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <ArcadeLogo />
          </div>

          {/* Center: Desktop Navigation Links */}
          <ul className="hidden items-center gap-2 lg:gap-4 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink label={link.label} href={link.href} />
              </li>
            ))}
          </ul>

          {/* Right: Actions (Cart & User Center) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Icon */}
            <Link
              href="/checkout"
              aria-label={`Keranjang Belanja (${totalItems} item)`}
              className="relative flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl border border-white/20 bg-black/40 p-2 text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
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
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-arcade-yellow font-display text-xs font-bold text-arcade-ink shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop User Center (Tokopedia-style Dropdown) */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-expanded={isUserMenuOpen}
                    aria-label="Menu Pengguna"
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-bold text-white transition-all hover:border-arcade-yellow hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-arcade-yellow font-display text-xs font-bold text-arcade-ink">
                      {userInitials}
                    </span>
                    <span className="max-w-[110px] md:max-w-[140px] truncate font-display tracking-wide text-white">
                      {user?.name || "Akun Saya"}
                    </span>
                    <svg
                      className={`h-4 w-4 text-arcade-yellow transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Tokopedia-Style User Center Popover */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/20 bg-[#180e3d]/98 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 z-50">
                      {/* User Header Profile */}
                      <div className="border-b border-white/10 pb-3 px-2">
                        <p className="font-display text-sm font-bold text-arcade-yellow truncate">
                          {user?.name || "Pengguna"}
                        </p>
                        <p className="font-mono text-[11px] text-white/60 truncate">
                          {user?.email}
                        </p>
                        {user?.user_type && (
                          <span className="mt-1 inline-block rounded-md bg-arcade-yellow/20 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-arcade-yellow border border-arcade-yellow/30">
                            {user.user_type === "guru"
                              ? "Guru / Staf"
                              : user.user_type === "umum"
                              ? "Umum"
                              : "Siswa"}
                          </span>
                        )}
                      </div>

                      {/* Unified Navigation Links */}
                      <div className="py-2 space-y-1">
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-white/90 transition-colors hover:bg-white/10 hover:text-arcade-yellow"
                        >
                          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>Pesanan Saya</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-white/90 transition-colors hover:bg-white/10 hover:text-arcade-yellow"
                        >
                          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profil Saya</span>
                        </Link>
                      </div>

                      {/* Logout Action */}
                      <div className="border-t border-white/10 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setShowLogoutDialog(true);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200 cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Keluar dari Akun</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl bg-arcade-yellow px-3.5 py-1.5 font-display text-xs font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="hidden lg:inline-flex rounded-xl border border-white/20 bg-black/30 px-3 py-1.5 font-display text-xs font-bold text-white transition-colors hover:bg-white/10 hover:border-white/50"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl border border-white/20 bg-black/40 p-2 text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="border-t border-white/10 bg-[#180e3d]/98 px-5 py-5 shadow-2xl backdrop-blur-xl md:hidden animate-in fade-in"
          >
            {/* Mobile User Summary if Authenticated */}
            {isAuthenticated && (
              <div className="mb-4 rounded-xl border border-white/15 bg-black/30 p-3">
                <p className="font-display text-sm font-bold text-arcade-yellow">
                  {user?.name || "Pengguna"}
                </p>
                <p className="font-mono text-xs text-white/60 truncate">{user?.email}</p>
                <div className="mt-2.5 flex items-center gap-2 border-t border-white/10 pt-2 text-xs">
                  <Link
                    href="/orders"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center gap-1 font-bold text-arcade-yellow underline"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Pesanan Saya
                  </Link>
                  <span className="text-white/40">•</span>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center gap-1 font-bold text-white/80 hover:text-arcade-yellow"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profil
                  </Link>
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <NavLink
                    label={link.label}
                    href={link.href}
                    onClick={closeMobileMenu}
                    isMobile={true}
                  />
                </li>
              ))}
            </ul>

            {/* Mobile Auth Section */}
            <div className="mt-5 border-t border-white/15 pt-4 sm:hidden">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    setShowLogoutDialog(true);
                  }}
                  className="w-full rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 font-display text-xs font-bold text-red-200 transition-colors hover:bg-red-500/20 cursor-pointer"
                >
                  Keluar dari Akun
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-center rounded-xl bg-arcade-yellow py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)]"
                  >
                    Masuk ke Akun
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-center rounded-xl border border-white/30 bg-black/40 py-2.5 font-display text-xs font-bold text-white"
                  >
                    Daftar Akun Baru
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Custom Dialog */}
      <CustomDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari akun Anda?"
        variant="confirmation"
        confirmText="Keluar"
        cancelText="Batal"
        confirmVariant="danger"
        isLoading={isLoggingOut}
      />
    </>
  );
}
