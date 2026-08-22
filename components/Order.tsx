"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/api/types/product";
import { PixelImage, PixelButton } from "./MerchandiseCard";
import { useAuth } from "@/lib/auth/auth-context";
import { submitCheckout, type OrderResult } from "@/lib/api/checkout";
import { useCart } from "@/lib/cart/cart-context";

type OrderModalProps = {
  product: Product | null;
  onClose: () => void;
  onSuccess?: (order: OrderResult) => void;
};

export default function OrderModal({
  product,
  onClose,
  onSuccess,
}: OrderModalProps) {
  const { user, token } = useAuth();
  const { addItem } = useCart();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    jurusan: "",
    className: "",
    phone: user?.phone || "",
  });

  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<OrderResult | null>(null);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAddedToCart(true);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!product) {
      setErrorMessage("Data produk tidak valid.");
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMessage("Silakan lengkapi nama lengkap dan nomor telepon WhatsApp Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await submitCheckout(
        {
          customer_name: formData.fullName.trim(),
          customer_phone: formData.phone.trim(),
          customer_class: formData.className.trim() || undefined,
          customer_major: formData.jurusan.trim() || undefined,
          items: [
            {
              product_id: product.id,
              quantity,
            },
          ],
        },
        token,
      );

      if (response.data) {
        setOrderCompleted(response.data);
        onSuccess?.(response.data);
      } else {
        setErrorMessage("Respons server tidak valid. Silakan coba lagi.");
      }
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Gagal membuat pesanan. Silakan periksa koneksi Anda dan coba lagi.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productName = product?.name ?? "Official P2R Merchandise";
  const productDesc =
    product?.description ??
    "Merchandise eksklusif edisi resmi Pixel To Reality. Pesan sekarang dan dukung karya pameran Cyber Arcade.";

  const priceDisplay =
    typeof product?.price === "number" && product.price > 0
      ? `Harga: Rp ${product.price.toLocaleString("id-ID")}`
      : "Harga: Info via Admin";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#6712D1]/95 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal pemesanan"
          className="absolute top-6 right-6 text-white hover:text-arcade-yellow font-bold text-xl font-mono cursor-pointer transition-colors"
        >
          ✕
        </button>

        {orderCompleted ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-arcade-yellow text-arcade-ink font-bold text-2xl shadow-lg">
              ✓
            </div>
            <h2
              id="order-modal-title"
              className="text-arcade-yellow text-3xl font-display font-bold mb-2 drop-shadow-md"
            >
              Pesanan Berhasil Dibuat!
            </h2>
            <p className="text-white text-base max-w-md mb-6 leading-relaxed">
              Terima kasih, <strong>{orderCompleted.customer_name}</strong>. Pesanan untuk <strong>{quantity}x {productName}</strong> telah tercatat di sistem Cyber Arcade.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="w-full md:w-64 flex-shrink-0">
                <PixelImage
                  imageUrl={product?.image_url}
                  altText={`${productName} merchandise`}
                />
              </div>

              <div className="flex flex-col justify-center text-white">
                <h2
                  id="order-modal-title"
                  className="text-arcade-yellow text-3xl md:text-4xl font-bold mb-3 drop-shadow-md font-pixel"
                >
                  {productName}
                </h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6 font-medium">
                  {productDesc}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-block border border-white/50 bg-black/30 text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
                    {priceDisplay}
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center rounded-full border border-white/40 bg-black/40 px-3 py-1 text-sm font-bold">
                    <button
                      type="button"
                      aria-label="Kurangi jumlah"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2 py-0.5 hover:text-arcade-yellow text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-arcade-yellow font-display text-base font-bold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Tambah jumlah"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-2 py-0.5 hover:text-arcade-yellow text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-blocking in-modal cart feedback toast */}
            {addedToCart && (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border-2 border-arcade-yellow/60 bg-black/60 p-4 text-center sm:text-left shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-arcade-yellow font-bold text-arcade-ink">
                    ✓
                  </span>
                  <p className="text-sm font-semibold text-white">
                    <strong className="text-arcade-yellow">{quantity}x {productName}</strong> berhasil ditambahkan ke keranjang belanja!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/checkout"
                    className="inline-flex items-center justify-center rounded-xl bg-arcade-yellow px-4 py-2 font-display text-xs font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                  >
                    Lihat Keranjang →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAddedToCart(false)}
                    className="rounded-xl border border-white/30 px-3 py-2 font-display text-xs text-white/80 transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    Lanjut Belanja
                  </button>
                </div>
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-sm font-semibold text-red-200"
              >
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="order-fullName"
                  className="text-white text-xs font-display tracking-wider uppercase font-bold text-arcade-yellow"
                >
                  Nama Lengkap *
                </label>
                <input
                  id="order-fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/40 transition-all placeholder:text-white/40 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="order-phone"
                  className="text-white text-xs font-display tracking-wider uppercase font-bold text-arcade-yellow"
                >
                  Nomor WhatsApp *
                </label>
                <input
                  id="order-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/40 transition-all placeholder:text-white/40 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="order-className"
                  className="text-white text-xs font-display tracking-wider uppercase font-bold text-arcade-yellow"
                >
                  Kelas
                </label>
                <input
                  id="order-className"
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="Contoh: XII RPL 1"
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/40 transition-all placeholder:text-white/40 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="order-jurusan"
                  className="text-white text-xs font-display tracking-wider uppercase font-bold text-arcade-yellow"
                >
                  Jurusan
                </label>
                <input
                  id="order-jurusan"
                  type="text"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  placeholder="Contoh: RPL"
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/40 transition-all placeholder:text-white/40 disabled:opacity-50"
                />
              </div>

              <div className="mt-4 md:col-span-2 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-auto min-w-[200px]">
                  <PixelButton type="submit">
                    {isSubmitting ? "Memproses..." : "Pesan Sekarang"}
                  </PixelButton>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto rounded-xl border-2 border-white/40 bg-black/40 px-6 py-3 font-display text-base font-bold text-white transition-all hover:border-arcade-yellow hover:text-arcade-yellow active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow cursor-pointer"
                >
                  + Tambah ke Keranjang
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
