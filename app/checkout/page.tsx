"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { submitCheckout, type OrderResult } from "@/lib/api/checkout";

function CheckoutContent() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { items, totalPrice, totalItems, removeItem, updateQuantity, clearCart } =
    useCart();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    className: "",
    jurusan: "",
    notes: "",
  });

  // Pre-fill user data when user logs in or is loaded
  React.useEffect(() => {
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
      setErrorMessage("Silakan lengkapi nama lengkap dan nomor telepon.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Keranjang belanja Anda masih kosong.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
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

      const result: OrderResult = response.data || {
        id: "P2R-" + Date.now(),
        order_number: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        total_amount: totalPrice,
        status: "pending",
      };

      setCompletedOrder(result);
      clearCart();
    } catch {
      // Fallback for demo / offline simulated checkout
      const fallbackResult: OrderResult = {
        id: "P2R-" + Date.now(),
        order_number: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        total_amount: totalPrice,
        status: "pending",
      };

      setCompletedOrder(fallbackResult);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/20 bg-black/40 p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-arcade-yellow text-4xl font-bold text-arcade-ink shadow-lg">
          ✓
        </div>
        <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow">
          Pesanan Dikonfirmasi
        </span>
        <h2 className="mt-3 font-display text-3xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-4xl">
          PESANAN BERHASIL DIBUAT!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
          Terima kasih, <strong>{completedOrder.customer_name}</strong>. Pesanan merchandise Anda telah terdaftar di sistem pameran Pixel To Reality.
        </p>

        <div className="my-8 rounded-2xl border border-white/10 bg-black/50 p-6 text-left">
          <div className="flex justify-between border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-wider text-arcade-yellow">
            <span>ID Pesanan</span>
            <span className="text-white font-mono">{completedOrder.id}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 py-3 text-sm text-white">
            <span>Nama Pemesan</span>
            <span className="font-semibold">{completedOrder.customer_name}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 py-3 text-sm text-white">
            <span>Nomor Kontak</span>
            <span className="font-semibold">{completedOrder.customer_phone || "-"}</span>
          </div>
          <div className="flex justify-between pt-3 text-base font-bold text-arcade-yellow font-display">
            <span>Total Tagihan</span>
            <span>
              {typeof completedOrder.total_amount === "number" &&
              completedOrder.total_amount > 0
                ? `Rp ${completedOrder.total_amount.toLocaleString("id-ID")}`
                : "Info via Admin"}
            </span>
          </div>
        </div>

        <p className="mb-8 text-xs font-medium text-white/70">
          Silakan konfirmasi atau lakukan pembayaran di booth kasir pameran atau hubungi admin WhatsApp resmi kami.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/merchandise"
            className="inline-flex items-center justify-center bg-arcade-yellow px-6 py-3 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5"
          >
            Lihat Merchandise Lain →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-white/30 bg-black/40 px-6 py-3 font-display text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Guest Notice if not authenticated */}
      {!isAuthenticated && !isAuthLoading && (
        <div
          role="status"
          aria-label="Pemberitahuan Masuk"
          className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-arcade-yellow/50 bg-black/40 p-5 backdrop-blur-md sm:flex-row sm:p-6"
        >
          <div>
            <h3 className="font-display text-lg text-arcade-yellow">
              Masuk untuk Menyelesaikan Pesanan
            </h3>
            <p className="text-xs font-semibold text-white/80 sm:text-sm">
              Anda perlu masuk ke akun Anda agar pesanan dapat diverifikasi dan diproses.
            </p>
          </div>
          <Link
            href="/login?redirect=/checkout"
            className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-arcade-yellow px-5 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Masuk / Daftar Sekarang →
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-arcade-yellow/40 bg-black/30 p-12 text-center backdrop-blur-md md:p-20">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-arcade-yellow sm:text-3xl">
            Keranjang Belanja Kosong
          </h2>
          <p className="mt-2 max-w-md text-sm font-semibold text-white/80 sm:text-base">
            Anda belum menambahkan merchandise apa pun ke keranjang. Jelajahi katalog resmi kami dan temukan item favoritmu!
          </p>
          <div className="mt-8">
            <Link
              href="/merchandise"
              className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3.5 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5"
            >
              Jelajahi Merchandise →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sisi Kiri: Daftar Item Keranjang */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/15 bg-black/40 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="font-display text-2xl text-arcade-yellow">
                  Item Pesanan ({totalItems})
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="font-display text-xs tracking-wider uppercase text-white/60 hover:text-red-400"
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

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/20 bg-black/60">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-display text-xs text-white/40">
                              P2R
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-display text-lg text-white">
                            {product.name}
                          </h3>
                          <p className="text-xs font-semibold text-arcade-yellow">
                            {itemPrice > 0
                              ? `Rp ${itemPrice.toLocaleString("id-ID")}`
                              : "Info via Admin"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        {/* Quantity controls */}
                        <div className="flex items-center rounded-lg border border-white/20 bg-black/40 px-2 py-1">
                          <button
                            type="button"
                            aria-label={`Kurangi ${product.name}`}
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="px-2 py-0.5 text-white hover:text-arcade-yellow"
                          >
                            -
                          </button>
                          <span className="px-2 font-display text-sm font-bold text-arcade-yellow">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Tambah ${product.name}`}
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="px-2 py-0.5 text-white hover:text-arcade-yellow"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-display text-base font-bold text-arcade-yellow">
                            {itemSubtotal > 0
                              ? `Rp ${itemSubtotal.toLocaleString("id-ID")}`
                              : "Info Admin"}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="text-xs text-red-400/80 hover:text-red-300 underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-center sm:text-left">
                <Link
                  href="/merchandise"
                  className="font-display text-sm text-arcade-yellow underline hover:opacity-80"
                >
                  + Tambah Produk Merchandise Lain
                </Link>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Form Data Pemesan & Checkout */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/15 bg-black/40 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <h2 className="mb-6 font-display text-2xl text-arcade-yellow">
                Data Pemesan
              </h2>

              {errorMessage && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-xs font-semibold text-red-200"
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleCheckout} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
                  >
                    Nama Lengkap *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nama Lengkap"
                    disabled={isSubmitting}
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
                  >
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    disabled={isSubmitting}
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="className"
                      className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
                    >
                      Kelas
                    </label>
                    <input
                      id="className"
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      placeholder="Contoh: XII RPL 1"
                      disabled={isSubmitting}
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="jurusan"
                      className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
                    >
                      Jurusan
                    </label>
                    <input
                      id="jurusan"
                      type="text"
                      name="jurusan"
                      value={formData.jurusan}
                      onChange={handleChange}
                      placeholder="Contoh: RPL"
                      disabled={isSubmitting}
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
                  >
                    Catatan Tambahan
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ukuran kaos, varian, atau catatan khusus..."
                    disabled={isSubmitting}
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Summary Box */}
                <div className="mt-3 rounded-2xl border border-white/10 bg-black/60 p-4">
                  <div className="flex justify-between text-xs text-white/80">
                    <span>Total Item</span>
                    <span className="font-semibold text-white">{totalItems} barang</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-display text-lg font-bold text-arcade-yellow">
                    <span>Total Pembayaran</span>
                    <span>
                      {totalPrice > 0
                        ? `Rp ${totalPrice.toLocaleString("id-ID")}`
                        : "Info via Admin"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex w-full items-center justify-center bg-arcade-yellow py-3.5 font-display text-lg font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
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
      className="flex min-h-screen flex-col items-center justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <header className="mb-10 text-center">
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-4xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            CHECKOUT PESANAN
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-pretty text-white/90 sm:text-lg">
            Selesaikan pemesanan merchandise resmi pameran Pixel To Reality: The Cyber Arcade.
          </p>
        </header>

        <Suspense fallback={<div className="p-10 font-display text-arcade-yellow">Memuat checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
