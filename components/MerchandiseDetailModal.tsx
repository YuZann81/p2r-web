"use client";

import React, { useEffect } from "react";
import type { Product } from "@/lib/api/types/product";
import { getProviderLabel, getAcquisitionInstruction } from "@/lib/api/products";
import { PixelImage, pixelClipPath } from "./MerchandiseCard";

type MerchandiseDetailModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function MerchandiseDetailModal({
  product,
  onClose,
}: MerchandiseDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const providerLabel =
    typeof getProviderLabel === "function"
      ? getProviderLabel(product)
      : product.source_type === "game" && product.game?.title
        ? `Made by ${product.game.title}`
        : "Made by Committee";

  const acquisitionInstruction =
    typeof getAcquisitionInstruction === "function"
      ? getAcquisitionInstruction(product)
      : product.source_type === "game" && product.game?.title
        ? `Get by playing ${product.game.title}`
        : "Redeem at the committee booth";

  const coinPrice = product.coin_price ?? product.price ?? 0;
  const isCommittee = product.source_type === "organizer";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Merchandise ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
    >
      <div className="relative w-full max-w-3xl bg-[#6712D1]/95 backdrop-blur-xl border-2 border-arcade-yellow/60 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail merchandise"
          className="absolute top-5 right-6 text-white hover:text-arcade-yellow font-bold text-2xl font-mono cursor-pointer transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Artwork Image Box */}
          <div className="w-full md:w-72 flex-shrink-0">
            <PixelImage
              imageUrl={product.image_url}
              altText={`${product.name} merchandise`}
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between text-white space-y-4">
            <div>
              {/* Provider Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full font-display text-xs tracking-wider uppercase ${
                    isCommittee
                      ? "bg-arcade-yellow/20 text-arcade-yellow border border-arcade-yellow/40"
                      : "bg-[#7C6BF5]/20 text-[#A78BFA] border border-[#7C6BF5]/40"
                  }`}
                >
                  ★ {providerLabel}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-black/40 text-white/80 font-mono text-xs border border-white/20">
                  Stok: {product.stock ?? 0} unit
                </span>
              </div>

              {/* Title */}
              <h2 className="text-arcade-yellow text-2xl sm:text-3xl font-display font-bold [text-shadow:2px_2px_0_var(--arcade-ink)]">
                {product.name}
              </h2>

              {/* Description */}
              <p className="mt-3 text-white/90 text-sm leading-relaxed font-body">
                {product.description ||
                  "Merchandise eksklusif pameran Pixel To Reality: The Cyber Arcade."}
              </p>
            </div>

            {/* Price Badge */}
            <div className="flex items-center gap-3 py-1">
              <span className="font-display text-xs text-white/70 uppercase tracking-wider">
                Harga Penukaran:
              </span>
              <span className="inline-block font-display text-lg font-bold text-arcade-yellow bg-black/40 border border-arcade-yellow/50 px-4 py-1 rounded-full">
                {coinPrice.toLocaleString("id-ID")} P2R COIN
              </span>
            </div>

            {/* Acquisition Instructions Box */}
            <div className="rounded-xl border border-white/20 bg-black/40 p-4 space-y-1.5">
              <div className="font-display text-xs uppercase tracking-wider text-arcade-yellow flex items-center gap-1.5">
                <span>📍 Cara Mendapatkan / Penukaran:</span>
              </div>
              <p className="text-xs text-white/90 font-medium leading-relaxed">
                {acquisitionInstruction}
              </p>
              <p className="text-[11px] text-white/60 italic pt-1 border-t border-white/10">
                {isCommittee
                  ? "Tunjukkan aplikasi atau akun Anda di booth kasir/panitia pameran untuk menukarkan koin dengan item fisik ini."
                  : `Mainkan ${product.game?.title || "game ini"} di arena pameran dan raih pencapaian turnamen untuk klaim merchandise.`}
              </p>
            </div>

            {/* Close / Action Button */}
            <div className="pt-2">
              <div
                style={{ filter: "drop-shadow(0px 4px 0px var(--arcade-yellow-shadow))" }}
                className="w-full sm:w-auto inline-block"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto bg-arcade-yellow text-arcade-ink font-display font-bold text-base px-8 py-2.5 transition-transform active:translate-y-1 outline-none hover:bg-[#ffe100] cursor-pointer"
                  style={{ clipPath: pixelClipPath }}
                >
                  Tutup Informasi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
