"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { getOrders, type OrderData } from "@/lib/api/orders";
import { formatProductPrice } from "@/lib/utils";

export default function ShopHubPage() {
  const { items, totalItems, totalPrice } = useCart();
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [activeOrdersCount, setActiveOrdersCount] = useState<number | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated && token) {
      setIsLoadingOrders(true);
      getOrders(token)
        .then((orders: OrderData[]) => {
          if (isMounted) {
            const active = orders.filter(
              (o) => o.status !== "completed" && o.status !== "cancelled",
            );
            setActiveOrdersCount(active.length);
          }
        })
        .catch(() => {
          if (isMounted) setActiveOrdersCount(0);
        })
        .finally(() => {
          if (isMounted) setIsLoadingOrders(false);
        });
    } else {
      setActiveOrdersCount(null);
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  return (
    <div
      className="flex min-h-[100dvh] flex-col justify-between overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 md:px-10">
        {/* Header Section */}
        <header className="mb-8 text-center sm:mb-10">
          <Link
            href="/"
            className="inline-block rounded-lg px-2 py-1 font-display text-xs uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow sm:text-sm"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-wider text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-4xl md:text-5xl">
            P2R COMMERCE
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs font-semibold text-white/85 sm:text-sm md:text-base">
            Pusat transaksi merchandise resmi dan dana usaha pameran Pixel To Reality: The Cyber Arcade.
          </p>
        </header>

        {/* Commerce Hub Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: Keranjang Belanja (Cart) */}
          <section
            aria-label="Keranjang Belanja"
            className="flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#180e3d] p-6 shadow-xl transition-all hover:border-arcade-yellow/60"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-arcade-yellow/20 text-arcade-yellow">
                  <svg
                    className="h-6 w-6"
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
                </div>
                {totalItems > 0 ? (
                  <span className="rounded-full bg-arcade-yellow px-3 py-1 font-display text-xs font-bold text-arcade-ink">
                    {totalItems} Item
                  </span>
                ) : (
                  <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 font-display text-[11px] text-white/60">
                    Kosong
                  </span>
                )}
              </div>

              <h2 className="mt-4 font-display text-xl font-bold text-white">
                Keranjang Belanja
              </h2>
              <p className="mt-1 text-xs text-white/70">
                Lihat item merchandise yang telah Anda pilih dan lanjutkan ke pembayaran checkout.
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Total Estimasi:</span>
                  <span className="font-mono text-sm font-bold text-arcade-yellow">
                    {totalPrice > 0 ? `Rp ${totalPrice.toLocaleString("id-ID")}` : "Rp 0"}
                  </span>
                </div>
                {items.length > 0 && (
                  <p className="mt-1 text-[11px] text-white/50 truncate">
                    Item terbaru: {items[items.length - 1].product.name}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="inline-flex w-full items-center justify-center rounded-xl bg-arcade-yellow px-4 py-2.5 font-display text-xs font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                {totalItems > 0 ? "Buka Keranjang & Checkout →" : "Buka Keranjang →"}
              </Link>
            </div>
          </section>

          {/* Card 2: Pesanan Saya (Orders) */}
          <section
            aria-label="Pesanan Saya"
            className="flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#180e3d] p-6 shadow-xl transition-all hover:border-arcade-yellow/60"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                {isAuthenticated && activeOrdersCount !== null && (
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-0.5 font-display text-[11px] font-bold text-blue-300">
                    {activeOrdersCount} Aktif
                  </span>
                )}
              </div>

              <h2 className="mt-4 font-display text-xl font-bold text-white">
                Pesanan Saya
              </h2>
              <p className="mt-1 text-xs text-white/70">
                Pantau status pemesanan, konfirmasi pembayaran QRIS, dan unduh kuitansi resmi pameran.
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                <div className="text-xs text-white/80">
                  {isAuthenticated ? (
                    isLoadingOrders ? (
                      <span className="text-white/50">Memuat status pesanan...</span>
                    ) : activeOrdersCount !== null && activeOrdersCount > 0 ? (
                      <span className="text-emerald-300 font-semibold">
                        Ada {activeOrdersCount} pesanan yang sedang diproses.
                      </span>
                    ) : (
                      <span className="text-white/60">Tidak ada pesanan aktif.</span>
                    )
                  ) : (
                    <span className="text-white/50">Masuk untuk melihat riwayat pesanan Anda.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/orders"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-black/40 px-4 py-2.5 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:bg-black/60 hover:text-arcade-yellow"
              >
                Lihat Semua Pesanan →
              </Link>
            </div>
          </section>

          {/* Card 3: Katalog Merchandise */}
          <section
            aria-label="Katalog Merchandise"
            className="flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#180e3d] p-6 shadow-xl transition-all hover:border-arcade-yellow/60"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-2.5 py-0.5 font-display text-[11px] font-bold text-purple-300">
                  Dana Usaha
                </span>
              </div>

              <h2 className="mt-4 font-display text-xl font-bold text-white">
                Katalog Merchandise
              </h2>
              <p className="mt-1 text-xs text-white/70">
                Eksplorasi koleksi merchandise Cyber Arcade: kaos, gantungan kunci, lanyard, dan stiker.
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-[11px] text-white/65 leading-relaxed">
                  Dukung penyelenggaraan pameran dan karya siswa RPL melalui pembelian merchandise resmi.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/merchandise"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-black/40 px-4 py-2.5 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:bg-black/60 hover:text-arcade-yellow"
              >
                Jelajahi Katalog →
              </Link>
            </div>
          </section>
        </div>

        {/* Quick Links & Info */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-black/25 p-5 text-center sm:p-6">
          <p className="text-xs text-white/60 sm:text-sm">
            Butuh bantuan terkait pesanan atau pembayaran? Hubungi tim panitia melalui saluran bantuan resmi pameran.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
