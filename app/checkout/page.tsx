"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { submitCheckout, type OrderResult } from "@/lib/api/checkout";
import {
  createPayment,
  getActiveQris,
  uploadPaymentProof,
  type ActiveQris,
  type PaymentData,
} from "@/lib/api/payment";
import { formatProductPrice } from "@/lib/utils";
import { addBackendCartItem } from "@/lib/api/cart";

function CheckoutContent() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    items,
    totalPrice,
    totalItems,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  // Form State initialized from User Profile (No redundant typing!)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    className: "",
    jurusan: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        phone: user.phone || "",
        className: user.class_grade || "",
        jurusan: user.major || (user.teacher_role ? `Peran: ${user.teacher_role}` : ""),
        notes: "",
      });
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Seamless in-place Payment State after checkout created
  const [createdOrder, setCreatedOrder] = useState<OrderResult | null>(null);
  const [createdPayment, setCreatedPayment] = useState<PaymentData | null>(null);
  const [activeQris, setActiveQris] = useState<ActiveQris | null>(null);
  const [selectedProofFile, setSelectedProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const proofInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Automated Checkout -> Payment flow
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
      // Sync items to backend cart
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

      // 1. Submit Checkout
      const checkoutRes = await submitCheckout(payload, token);
      const orderData = checkoutRes.data;

      if (!orderData) {
        throw new Error("Gagal membuat pesanan.");
      }

      setCreatedOrder(orderData);
      clearCart();

      // 2. Automatically initiate QRIS Payment and load Active QRIS
      try {
        const [paymentRes, qrisData] = await Promise.all([
          createPayment("qris", token),
          getActiveQris(),
        ]);
        setCreatedPayment(paymentRes);
        setActiveQris(qrisData);
      } catch {
        // Fallback: load active QRIS alone
        const qrisData = await getActiveQris().catch(() => null);
        setActiveQris(qrisData);
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

  // Proof File Change Handler
  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal 5MB.");
        return;
      }
      setSelectedProofFile(file);
      setProofPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  // Upload Proof Directly
  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProofFile || !token) {
      setErrorMessage("Silakan pilih file bukti transfer terlebih dahulu.");
      return;
    }

    setIsUploadingProof(true);
    setErrorMessage(null);
    setUploadSuccessMsg(null);

    try {
      const updated = await uploadPaymentProof(selectedProofFile, token);
      setCreatedPayment(updated);
      setSelectedProofFile(null);
      setProofPreviewUrl(null);
      setUploadSuccessMsg("Bukti pembayaran berhasil dikirim! Menunggu verifikasi admin.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah bukti transfer.";
      setErrorMessage(msg);
    } finally {
      setIsUploadingProof(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // 1. AUTOMATIC PAYMENT COMPONENT (ORDER CREATED IN-PLACE VIEW)
  // ════════════════════════════════════════════════════════════════
  if (createdOrder) {
    const customerDisplayName =
      createdOrder.customer?.name ||
      createdOrder.customer_name ||
      formData.fullName ||
      "Pelanggan";
    const orderCode =
      createdOrder.checkout_code ||
      (createdOrder as unknown as { order_code?: string }).order_code ||
      String(createdOrder.id);
    const displayTotal =
      createdPayment?.transfer_amount ||
      createdOrder.grand_total ||
      createdOrder.subtotal ||
      totalPrice;
    const paymentStatus = createdPayment?.payment_status || "waiting_payment";

    return (
      <div className="mx-auto w-full max-w-3xl rounded-3xl border-2 border-white/20 bg-[#1e1040] p-5 sm:p-8 text-center shadow-2xl animate-in fade-in">
        {/* Order Header */}
        <div className="mb-4 flex flex-col items-center">
          <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1 font-mono text-xs font-bold text-emerald-400 uppercase">
            ✓ Pesanan Berhasil Dibuat
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)]">
            PEMBAYARAN QRIS
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-white/80">
            Pesanan <strong>{orderCode}</strong> untuk <strong>{customerDisplayName}</strong>.
          </p>
        </div>

        {/* Status Alert */}
        {uploadSuccessMsg && (
          <div className="mb-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/20 p-3.5 text-xs font-bold text-emerald-200">
            {uploadSuccessMsg}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/20 p-3.5 text-xs font-bold text-red-200">
            {errorMessage}
          </div>
        )}

        {/* Unified Payment Block */}
        <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* Left: QRIS Display */}
          <div className="flex flex-col items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-5 text-center">
            <div>
              <span className="inline-block rounded-md bg-arcade-yellow/20 border border-arcade-yellow/30 px-2.5 py-0.5 font-display text-[10px] font-bold tracking-wider uppercase text-arcade-yellow">
                {activeQris?.name || "QRIS Dana Usaha P2R"}
              </span>
              <p className="mt-1 text-xs text-white/70">
                Scan QRIS dengan aplikasi M-Banking / E-Wallet Anda
              </p>
            </div>

            <div className="my-3 overflow-hidden rounded-2xl border-2 border-white/20 bg-white p-2.5 shadow-md">
              {activeQris?.qr_image_url ? (
                <img
                  src={activeQris.qr_image_url}
                  alt="QRIS Barcode"
                  className="h-44 w-44 object-contain"
                />
              ) : (
                <div className="flex h-44 w-44 flex-col items-center justify-center bg-slate-100 text-slate-700">
                  <span className="text-3xl">📱</span>
                  <span className="mt-1 font-mono text-xs font-bold">QRIS P2R</span>
                </div>
              )}
            </div>

            <div className="w-full rounded-xl border border-white/10 bg-black/60 p-2.5">
              <span className="text-[11px] text-white/60 block">Nominal Tagihan:</span>
              <span className="font-mono text-xl font-bold text-arcade-yellow">
                {formatProductPrice(displayTotal)}
              </span>
            </div>
          </div>

          {/* Right: Upload Proof Form */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/50 p-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="font-display text-sm font-bold text-white">
                  Bukti Pembayaran
                </span>
                {paymentStatus === "waiting_verification" ? (
                  <span className="rounded bg-blue-500/20 border border-blue-400/40 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-300 uppercase">
                    Menunggu Verifikasi
                  </span>
                ) : (
                  <span className="rounded bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase">
                    Belum Dibayar
                  </span>
                )}
              </div>

              {paymentStatus === "waiting_verification" ? (
                <div className="rounded-xl border border-blue-500/30 bg-blue-950/40 p-3 text-xs text-blue-200 space-y-2">
                  <p className="font-semibold">
                    ✓ Bukti pembayaran Anda telah terkirim ke panitia!
                  </p>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Admin sedang memverifikasi transfer Anda. Anda dapat menutup halaman ini kapan saja dan memantau status pesanan di <strong>Pesanan Saya</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadProof} className="space-y-3">
                  <div>
                    <input
                      type="file"
                      ref={proofInputRef}
                      accept="image/*"
                      onChange={handleProofChange}
                      className="hidden"
                      id="proof-upload-input"
                    />
                    <label
                      htmlFor="proof-upload-input"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/30 bg-black/30 p-3.5 text-center transition-colors hover:border-arcade-yellow hover:bg-black/40"
                    >
                      {proofPreviewUrl ? (
                        <div className="space-y-1">
                          <img
                            src={proofPreviewUrl}
                            alt="Preview Bukti"
                            className="mx-auto max-h-28 rounded object-contain"
                          />
                          <span className="block text-xs font-semibold text-arcade-yellow">
                            Ganti Foto
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-2xl">📸</span>
                          <span className="block text-xs font-semibold text-white">
                            Pilih Foto / Screenshot Transfer
                          </span>
                          <span className="block text-[10px] text-white/50">
                            Format JPG, PNG (Maks 5MB)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingProof || !selectedProofFile}
                    className="flex w-full min-h-[42px] items-center justify-center rounded-xl bg-arcade-yellow py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isUploadingProof ? "Mengunggah Bukti..." : "Kirim Bukti Pembayaran"}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Helper Links */}
            <div className="mt-4 border-t border-white/10 pt-3 text-center">
              <Link
                href="/orders"
                className="font-display text-xs font-bold text-arcade-yellow underline hover:opacity-80"
              >
                Lihat di Pesanan Saya →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/orders"
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-md transition-transform hover:-translate-y-0.5"
          >
            📦 Buka Pesanan Saya
          </Link>
          <Link
            href="/merchandise"
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-white/20 bg-black/40 px-6 py-2.5 font-display text-sm font-bold text-white hover:bg-white/10"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 2. MAIN CHECKOUT FORM
  // ════════════════════════════════════════════════════════════════
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
              Masuk ke akun Anda agar pesanan langsung tersimpan di profil dan kuitansi dapat diterbitkan.
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
                          <span
                            aria-label={`Jumlah: ${quantity}`}
                            className="min-w-[28px] text-center font-display text-sm font-bold text-arcade-yellow"
                          >
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-arcade-yellow sm:text-2xl">
                  Data Pemesan
                </h2>
                {user && (
                  <Link
                    href="/profile"
                    className="text-[11px] font-bold text-arcade-yellow underline hover:opacity-80"
                  >
                    Edit Profil
                  </Link>
                )}
              </div>

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
                      Jurusan / Peran
                    </label>
                    <input
                      id="jurusan"
                      type="text"
                      name="jurusan"
                      value={formData.jurusan}
                      onChange={handleChange}
                      placeholder="RPL / Guru"
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
                    Catatan Tambahan (Opsional)
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
                      ? "Pesan & Bayar QRIS Sekarang →"
                      : "Masuk & Bayar Sekarang →"}
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
      className="flex min-h-[100dvh] flex-col items-center justify-between px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16 overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <header className="mb-6 text-center sm:mb-8">
          <Link
            href="/"
            className="inline-block rounded-lg px-2 py-1 font-display text-xs uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow sm:text-sm"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-3 font-display text-3xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl">
            CHECKOUT PESANAN
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs font-semibold leading-relaxed text-white/90 sm:text-sm">
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

      <footer className="mt-12 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
