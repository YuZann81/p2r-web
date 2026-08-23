"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArcadeLogo from "@/components/ArcadeLogo";
import NavLink from "@/components/NavLink";
import { NAV_LINKS } from "@/lib/content";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { CustomDialog } from "@/components/ui/CustomDialog";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutDialog(false);
      setIsMobileMenuOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/15 bg-[#180e3d]/95 shadow-md backdrop-blur-md transition-all">
      <nav
        aria-label="Navigasi Utama"
        className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 md:px-10"
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <ArcadeLogo />
        </div>

        {/* Center: Desktop Navigation Links */}
        <ul className="hidden items-center gap-3 lg:gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink label={link.label} href={link.href} />
            </li>
          ))}
        </ul>

        {/* Right: Actions (Cart, Auth, Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Icon & Item Badge */}
          <Link
            href="/checkout"
            aria-label={`Keranjang Belanja (${totalItems} item)`}
            className="relative flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/20 bg-black/40 p-2 text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow sm:p-2.5"
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
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-arcade-yellow font-display text-xs font-bold text-arcade-ink shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Desktop Auth State */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <span
                  title={user?.name ? `Hai, ${user.name}` : "Akun Terhubung"}
                  className="max-w-[130px] md:max-w-[160px] truncate font-display text-xs font-bold tracking-wider text-arcade-yellow rounded border border-arcade-yellow/30 bg-arcade-yellow/10 px-2.5 py-1"
                >
                  {user?.name ? `Hai, ${user.name}` : "Akun Terhubung"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowLogoutDialog(true)}
                  className="rounded-xl border border-white/30 bg-black/40 px-3.5 py-1.5 font-display text-xs font-bold text-white transition-colors hover:bg-white/10 hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl bg-arcade-yellow px-4 py-1.5 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="hidden lg:inline-flex rounded-xl border border-white/20 bg-black/30 px-3.5 py-1.5 font-display text-sm font-bold text-white transition-colors hover:bg-white/10 hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
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
            aria-controls="mobile-navigation-drawer"
            aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/20 bg-black/40 p-2 text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow md:hidden cursor-pointer sm:p-2.5"
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
          className="border-t border-white/10 bg-[#180e3d]/98 px-5 py-6 shadow-2xl backdrop-blur-xl md:hidden"
        >
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
          <div className="mt-6 border-t border-white/15 pt-5 sm:hidden">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <span
                  title={user?.name ? `Hai, ${user.name}` : "Akun Terhubung"}
                  className="truncate font-display text-sm font-bold text-arcade-yellow"
                >
                  {user?.name ? `Hai, ${user.name}` : "Akun Terhubung"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowLogoutDialog(true)}
                  className="w-full min-h-[44px] rounded-xl border border-white/30 bg-black/40 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-arcade-yellow py-2.5 font-display text-base font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5"
                >
                  Masuk ke Akun
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-white/30 bg-black/40 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
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
