"use client";

import React, { useEffect } from "react";
import type { Product } from "@/lib/api/types/product";
import { getAcquisitionInstruction, getProviderLabel } from "@/lib/api/products";

type MerchandiseInfoModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function MerchandiseInfoModal({
  product,
  onClose,
}: MerchandiseInfoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const coinPrice = product.coin_price ?? product.price ?? 0;
  const providerLabel = getProviderLabel(product);
  const acquisitionInstruction = getAcquisitionInstruction(product);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-body"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-[#39265E] bg-[#171224] p-6 md:p-8 shadow-[8px_8px_0_#0E0A1A] max-h-[90vh] overflow-y-auto text-[#FFF5E9]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail merchandise"
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-xl text-[#FFF5E9]/70 hover:bg-white/10 hover:text-[#FFD447] font-display text-xl cursor-pointer transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-40 h-40 shrink-0 overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#211B35]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={`${product.name} merchandise`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[#68D5E8] font-display text-xs tracking-wider uppercase">
                Official Merch
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="rounded-md bg-[#68D5E8]/15 px-2.5 py-0.5 font-display text-xs text-[#68D5E8]">
                {providerLabel}
              </span>
              {product.stock !== undefined && (
                <span className="rounded-md bg-[#211B35] border border-[#39265E] px-2.5 py-0.5 font-display text-xs text-[#FFF5E9]/80">
                  Stok: {product.stock}
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFD447]">
              {product.name}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#FFF5E9]/85">
              {product.description ||
                "Merchandise eksklusif resmi pameran Pixel To Reality: The Cyber Arcade."}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#FFD447]/40 bg-[#211B35] px-4 py-2">
              <span className="font-display text-xs uppercase tracking-wider text-[#FFF5E9]/70">
                Penukaran:
              </span>
              <span className="font-display text-lg font-bold text-[#FFD447]">
                {coinPrice > 0 ? `${coinPrice.toLocaleString("id-ID")} P2R Koin` : "Info di Booth"}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-[#39265E] bg-[#211B35]/70 p-4 text-left">
              <p className="font-display text-xs uppercase tracking-wider text-[#68D5E8]">
                Cara Mendapatkan
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#FFF5E9]/85">
                {acquisitionInstruction}. Penukaran merchandise fisik dilakukan langsung di booth panitia pameran.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 w-full sm:w-auto rounded-xl bg-[#FFD447] px-8 py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
