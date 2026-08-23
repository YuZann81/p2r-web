"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import {
  submitCheckout,
  fetchCheckoutById,
  type OrderResult,
} from "@/lib/api/checkout";
import { formatProductPrice } from "@/lib/utils";
import { addBackendCartItem } from "@/lib/api/cart";

const COMPLETED_ORDER_STORAGE_KEY = "p2r_last_completed_order";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCode = searchParams?.get("code");

  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    items,
    totalPrice,
    totalItems,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    className: "",
    jurusan: "",
    notes: "",
  });

  // Pre-fill user data when user logs in or auth state resolves
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderResult | null>(null);

  // Restore completed order from sessionStorage on mount (prevents receipt loss on refresh)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(COMPLETED_ORDER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as OrderResult;
        if (parsed && (parsed.checkout_code || parsed.id)) {
          setCompletedOrder(parsed);
        }
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  // Restore completed order if ?code=... is present in URL
  useEffect(() => {
    if (!queryCode || !token) return;

    fetchCheckoutById(queryCode, token)
      .then((res) => {
        if (res.data) {
          setCompletedOrder(res.data);
          try {
            sessionStorage.setItem(
              COMPLETED_ORDER_STORAGE_KEY,
              JSON.stringify(res.data),
            );
          } catch {}
        }
      })
      .catch(() => {
        // Benign lookup error
      });
  }, [queryCode, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMessage("Silakan lengkapi nama lengkap dan nomor WhatsApp pemesan.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Keranjang belanja Anda masih kosong.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Synchronize items with backend database cart
      if (token) {
        for (const item of items) {
          if (item.product?.id) {
            try {
              await addBackendCartItem(
                { product_id: item.product.id, quantity: item.quantity },
                token,
              );
            } catch {}
          }
        }
      }

      const payload = {
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        customer_class: formData.className.trim() || undefined,
        customer_major: formData.jurusan.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await submitCheckout(payload, token);

      if (response.data) {
        setCompletedOrder(response.data);
        try {
          sessionStorage.setItem(
            COMPLETED_ORDER_STORAGE_KEY,
            JSON.stringify(response.data),
          );
        } catch {}
        clearCart();
      } else {
        setErrorMessage("Respons server tidak valid. Silakan coba lagi.");
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal memproses pesanan. Silakan periksa data pesanan dan coba lagi.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetOrder = () => {
    try {
      sessionStorage.removeItem(COMPLETED_ORDER_STORAGE_KEY);
    } catch {}
    setCompletedOrder(null);
  };

  // 1. SUCCESS RECEIPT STATE
  if (completedOrder) {
    const customerDisplayName =
      completedOrder.customer?.name || completedOrder.customer_name || formData.fullName;
    const customerDisplayPhone =
      completedOrder.customer?.phone || completedOrder.customer_phone || formData.phone;
    const displayTotal =
      completedOrder.grand_total || completedOrder.subtotal || completedOrder.total_amount;
    const orderStatusText = (completedOrder.status || "pending").toUpperCase();

    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border-2 border-white/20 bg-[#1e1040] p-6 text-center shadow-2xl sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-arcade-yellow text-3xl font-bold text-arcade-ink shadow-lg">
          ✓
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="inline-block rounded-md border border-arcade-yellow/40 bg-arcade-yellow/10 px-3.5 py-0.5 font-display text-xs font-bold tracking-wider uppercase text-arcade-yellow">
            Pesanan Dikonfirmasi
          </span>
          <span className="inline-block rounded-md border border-emerald-400/40 bg-emerald-500/15 px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
            {orderStatusText}
          </span>
        </div>

        <h2 className="mt-3 font-display text-2xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-4xl">
          PESANAN BERHASIL DIBUAT!
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
          Terima kasih, <strong>{customerDisplayName}</strong>. Pesanan merchandise Anda telah tercatat di sistem pameran Pixel To Reality.
        </p>

        {/* Order Details Receipt Box */}
        <div className="my-6 rounded-2xl border border-white/10 bg-black/50 p-5 text-left font-sans">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-wider text-arcade-yellow">
            <span>Kode Checkout / ID</span>
            <span className="font-mono font-bold text-white">
              {completedOrder.checkout_code || completedOrder.id}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-white">
            <span>Nama Pemesan</span>
            <span className="font-semibold">{customerDisplayName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-white">
            <span>Nomor WhatsApp</span>
            <span className="font-semibold">{customerDisplayPhone || "-"}</span>
          </div>

          {completedOrder.items && completedOrder.items.length > 0 && (
            <div className="border-b border-white/10 py-3 text-xs text-white/90">
              <span className="mb-2 block font-semibold uppercase tracking-wider text-arcade-yellow">
                Daftar Item ({completedOrder.items.length})
              </span>
              <ul className="space-y-2">
                {completedOrder.items.map((item, idx) => {
                  const itemName =
                    item.product?.name || item.product_name || "Official Merchandise";
                  const itemPrice = item.unit_price;
                  const itemSubtotal =
                    item.subtotal ||
                    parseFloat(String(itemPrice || 0)) * (item.quantity || 1);

                  return (
                    <li
                      key={item.id || idx}
                      className="flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-medium text-white">
                          {item.quantity}x {itemName}
                        </span>
                        <span className="block text-[11px] text-white/60">
                          @{formatProductPrice(itemPrice)}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-white">
                        {formatProductPrice(itemSubtotal)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 font-display text-base font-bold text-arcade-yellow">
            <span>Total Tagihan</span>
            <span className="font-mono text-lg text-arcade-yellow">
              {formatProductPrice(displayTotal)}
            </span>
          </div>
        </div>

        <p className="mb-6 text-xs leading-relaxed text-white/70 sm:text-sm">
          Silakan konfirmasi dan selesaikan transaksi di booth kasir pameran atau tunjukkan Kode Checkout kepada panitia pameran.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/merchandise"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5"
          >
            Lihat Merchandise Lain →
          </Link>
          <button
            type="button"
            onClick={handleResetOrder}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-arcade-yellow/50 bg-arcade-yellow/10 px-6 py-2.5 font-display text-base font-bold text-arcade-yellow transition-colors hover:bg-arcade-yellow/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
          >
            + Buat Pesanan Baru
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/30 bg-black/40 px-6 py-2.5 font-display text-base font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // 2. MAIN CHECKOUT INTERFACE
  return (
    <div className="w-full">
      {/* Guest Notice if not authenticated */}
      {!isAuthenticated && !isAuthLoading && (
        <div
          role="status"
          aria-label="Pemberitahuan Masuk"
          className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-arcade-yellow/50 bg-[#1e1040] p-5 shadow-lg sm:flex-row sm:p-6"
        >
          <div>
            <h3 className="font-display text-base font-bold text-arcade-yellow sm:text-lg">
              Masuk untuk Menyelesaikan Pesanan
            </h3>
            <p className="mt-1 text-xs font-medium text-white/80 sm:text-sm">
              Anda perlu masuk ke akun Anda agar pesanan dapat diverifikasi dan diproses oleh panitia.
            </p>
          </div>
          <Link
            href="/login?redirect=/checkout"
            className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center rounded-xl bg-arcade-yellow px-5 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Masuk / Daftar Sekarang →
          </Link>
        </div>
      )}

      {/* Empty Cart State */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-arcade-yellow/40 bg-[#1e1040] p-10 text-center sm:p-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow">
            <svg
              className="h-8 w-8"
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

          <h2 className="font-display text-2xl font-bold text-arcade-yellow sm:text-3xl">
            Keranjang Belanja Kosong
          </h2>

          <p className="mt-2 max-w-md text-sm font-medium text-white/80 sm:text-base">
            Anda belum menambahkan merchandise apa pun ke keranjang. Jelajahi katalog resmi kami dan temukan item favoritmu!
          </p>

          <div className="mt-6">
            <Link
              href="/merchandise"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5"
            >
              Jelajahi Merchandise →
            </Link>
          </div>
        </div>
      ) : (
        /* Active Cart & Checkout Form Layout */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border-2 border-white/20 bg-[#1e1040] p-5 shadow-xl sm:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="font-display text-xl font-bold text-arcade-yellow sm:text-2xl">
                  Item Pesanan ({totalItems})
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="font-display text-xs font-bold tracking-wider uppercase text-white/60 hover:text-red-400 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded px-2 py-1"
                >
                  Kosongkan
                </button>
              </div>

              <div className="divide-y divide-white/10">
                {items.map(({ product, quantity }) => {
                  const itemPrice =
                    typeof product.price === "number" && product.price > 0
                      ? product.price
                      : 0;
                  const itemSubtotal = itemPrice * quantity;
                  const maxStock =
                    typeof product.stock === "number" && product.stock > 0
                      ? product.stock
                      : null;

                  return (
                    <article
                      key={product.id}
                      aria-label={`Item: ${product.name}`}
                      className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Artwork + Product Info */}
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/20 bg-black/60">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={`${product.name} thumbnail`}
                              className="h-full w-full object-cover [image-rendering:pixelated]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-display text-xs text-white/40">
                              P2R
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-display text-lg font-bold text-white">
                            {product.name}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-arcade-yellow">
                              {formatProductPrice(product.price)}
                            </span>
                            {maxStock && (
                              <span className="rounded border border-white/15 bg-black/40 px-1.5 py-0.5 font-display text-[10px] text-white/70">
                                Stok: {maxStock}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Subtotal */}
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-xl border border-white/20 bg-black/40 px-1.5 py-0.5">
                          <button
                            type="button"
                            aria-label={`Kurangi ${product.name}`}
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white transition-colors hover:text-arcade-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
                          >
                            -
                          </button>
                          <span className="min-w-[28px] text-center font-display text-sm font-bold text-arcade-yellow">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Tambah ${product.name}`}
                            disabled={maxStock !== null && quantity >= maxStock}
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white transition-colors hover:text-arcade-yellow disabled:opacity-30 disabled:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Subtotal & Remove Button */}
                        <div className="text-right">
                          <div className="font-mono text-sm font-bold text-white sm:text-base">
                            {itemSubtotal > 0
                              ? `Rp ${itemSubtotal.toLocaleString("id-ID")}`
                              : "Info via Admin"}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="mt-1 font-display text-xs font-semibold text-red-400 hover:text-red-300 underline cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-white/10 pt-4 text-center sm:text-left">
                <Link
                  href="/merchandise"
                  className="font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow rounded px-1 py-0.5"
                >
                  + Tambah Merchandise Lain
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Details Form & Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border-2 border-white/20 bg-[#1e1040] p-5 shadow-xl sm:p-7">
              <h2 className="mb-4 font-display text-xl font-bold text-arcade-yellow sm:text-2xl">
                Data Pemesan
              </h2>

              {errorMessage && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-500/50 bg-red-500/20 p-3.5 text-center text-xs font-semibold text-red-200"
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleCheckout} className="flex flex-col gap-3.5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow"
                  >
                    Nama Lengkap *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap pemesan"
                    disabled={isSubmitting}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/50 px-3.5 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow"
                  >
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    disabled={isSubmitting}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/50 px-3.5 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="className"
                      className="block font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow"
                    >
                      Kelas
                    </label>
                    <input
                      id="className"
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      placeholder="XII RPL 1"
                      disabled={isSubmitting}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-black/50 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="jurusan"
                      className="block font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow"
                    >
                      Jurusan
                    </label>
                    <input
                      id="jurusan"
                      type="text"
                      name="jurusan"
                      value={formData.jurusan}
                      onChange={handleChange}
                      placeholder="RPL"
                      disabled={isSubmitting}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-black/50 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow"
                  >
                    Catatan Tambahan
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ukuran kaos, varian, atau catatan pemesanan..."
                    disabled={isSubmitting}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/50 px-3.5 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Summary Box */}
                <div className="mt-2 rounded-2xl border border-white/10 bg-black/60 p-4">
                  <div className="flex justify-between text-xs text-white/80">
                    <span>Total Item</span>
                    <span className="font-bold text-white">{totalItems} barang</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-display text-base font-bold text-arcade-yellow sm:text-lg">
                    <span>Total Pembayaran</span>
                    <span className="font-mono">
                      {totalPrice > 0
                        ? `Rp ${totalPrice.toLocaleString("id-ID")}`
                        : "Info via Admin"}
                    </span>
                  </div>
                </div>

                <button
                  type={isAuthenticated ? "submit" : "button"}
                  onClick={
                    !isAuthenticated
                      ? () => router.push("/login?redirect=/checkout")
                      : undefined
                  }
                  disabled={isSubmitting}
                  className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-arcade-yellow py-3 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 cursor-pointer"
                >
                  {isSubmitting
                    ? "Memproses Pesanan..."
                    : isAuthenticated
                      ? "Konfirmasi Pesanan Sekarang →"
                      : "Masuk & Konfirmasi Pesanan →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between px-4 py-10 sm:px-6 sm:py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <header className="mb-8 text-center sm:mb-10">
          <Link
            href="/"
            className="inline-block rounded-lg px-2 py-1 font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-3xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            CHECKOUT PESANAN
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-pretty text-white/90 sm:text-base md:text-lg">
            Selesaikan pemesanan merchandise resmi pameran Pixel To Reality: The Cyber Arcade.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="p-10 font-display text-arcade-yellow">
              Memuat checkout...
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
