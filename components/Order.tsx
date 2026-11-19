"use client";

import React, { useState } from "react";
import type { Product } from "@/lib/api/types/product";
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
  const [orderCompleted, setOrderCompleted] = useState<OrderResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      alert(`Berhasil menambahkan ${quantity}x ${product.name} ke keranjang!`);
      onClose();
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
      setErrorMessage("Silakan lengkapi nama dan nomor telepon Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderData = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        className: formData.className.trim() || undefined,
        jurusan: formData.jurusan.trim() || undefined,
        items: [
          {
            product_id: product.id,
            quantity,
            price: Number(product.price) || 0,
            product_name: product.name,
          },
        ],
      };

      const result = await submitCheckout(orderData, token);

      if (result.success && result.order) {
        setOrderCompleted(result.order);
        onSuccess?.(result.order);
      } else {
        setErrorMessage(
          result.message || "Gagal memproses pesanan. Silakan coba lagi.",
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memproses pesanan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const productName = product?.name || "Official P2R Merchandise";
  const productDesc =
    product?.description ||
    "Merchandise eksklusif edisi resmi Pixel To Reality. Pesan sekarang dan dukung karya pameran Cyber Arcade.";

  const priceDisplay =
    typeof product?.price === "number" && product.price > 0
      ? `Price : Rp ${product.price.toLocaleString("id-ID")}`
      : "Price : Info via Admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-body">
      <div className="relative w-full max-w-2xl bg-[#171224] border-2 border-[#39265E] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#0E0A1A] max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal pemesanan"
          className="absolute top-6 right-6 text-[#FFF5E9]/70 hover:text-[#FFD447] font-display text-xl cursor-pointer"
        >
          ✕
        </button>

        {orderCompleted ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-[#7AC70C] text-white font-bold text-2xl shadow-md">
              ✓
            </div>
            <h2 className="text-[#FFD447] text-3xl font-display font-bold mb-2">
              Pesanan Berhasil Dibuat!
            </h2>
            <p className="text-[#FFF5E9]/85 text-base max-w-md mb-6 leading-relaxed">
              Terima kasih, <strong>{orderCompleted.customer_name}</strong>. Pesanan untuk <strong>{quantity}x {productName}</strong> telah tercatat di sistem Pixel To Reality.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#FFD447] px-8 py-3 font-display text-base font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] hover:-translate-y-0.5 cursor-pointer"
            >
              Selesai
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center sm:items-start">
              {/* Product Visual */}
              <div className="w-36 h-36 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#211B35]">
                {product?.image_url ? (
                  <img
                    src={product.image_url}
                    alt={productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[#B7ABCE]">
                    <span className="font-display text-xs text-[#FFD447]">MERCH</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block rounded-md bg-[#68D5E8]/20 px-2.5 py-0.5 font-display text-xs text-[#68D5E8] mb-1">
                  OFFICIAL P2R
                </span>
                <h2 className="text-[#FFD447] text-2xl sm:text-3xl font-display font-bold drop-shadow-[1px_1px_0_#0E0A1A]">
                  {productName}
                </h2>
                <p className="text-[#FFF5E9]/80 text-sm mt-1 line-clamp-2">
                  {productDesc}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <span className="font-display text-xl text-[#FFD447] font-bold">
                    {priceDisplay}
                  </span>

                  {/* Quantity selector */}
                  <div className="flex items-center rounded-xl border border-white/20 bg-[#211B35] px-3 py-1 text-sm">
                    <button
                      type="button"
                      aria-label="Kurangi jumlah"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2 font-display text-lg hover:text-[#FFD447] text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 font-display text-base text-[#FFD447] font-bold">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Tambah jumlah"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-2 font-display text-lg hover:text-[#FFD447] text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-500/50 bg-red-500/20 p-3 text-center text-sm font-semibold text-red-200"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-display text-xs uppercase tracking-wider text-[#FFD447] mb-1">
                  Nama Lengkap Pemesan
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full rounded-xl border border-[#39265E] bg-[#211B35] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#68D5E8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-xs uppercase tracking-wider text-[#FFD447] mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="w-full rounded-xl border border-[#39265E] bg-[#211B35] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#68D5E8]"
                  />
                </div>

                <div>
                  <label className="block font-display text-xs uppercase tracking-wider text-[#FFD447] mb-1">
                    Kelas &bull; Jurusan (Opsional)
                  </label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    placeholder="Contoh: XII RPL 1"
                    className="w-full rounded-xl border border-[#39265E] bg-[#211B35] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#68D5E8]"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl border-2 border-[#68D5E8] bg-[#211B35] py-3 font-display text-base font-bold text-[#68D5E8] hover:bg-[#39265E] transition-all cursor-pointer"
                >
                  + Tambah ke Keranjang
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#FFD447] py-3 font-display text-base font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Memproses..." : "Pesan Langsung"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
