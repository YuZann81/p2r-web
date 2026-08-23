"use client";

import React from "react";
import type { Product } from "@/lib/api/types/product";
import { formatProductPrice } from "@/lib/utils";

export const pixelClipPath = `polygon(
  8px 0px, calc(100% - 8px) 0px, calc(100% - 8px) 4px, calc(100% - 4px) 4px, 
  calc(100% - 4px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), 
  calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%, 
  8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 
  0px calc(100% - 8px), 0px 8px, 4px 8px, 4px 4px, 8px 4px
)`;

export type MerchandiseCardProps = {
  product: Product;
  onClick: () => void;
  containerClassName?: string;
  imageBoxClassName?: string;
};

export { formatProductPrice };

export function PixelImage({
  imageUrl,
  altText = "Merchandise P2R",
}: {
  imageUrl?: string | null;
  altText?: string;
}) {
  return (
    <div className="w-full aspect-square bg-[#e5e5e5] rounded-xl overflow-hidden flex items-center justify-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover [image-rendering:pixelated]"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-arcade-ink/40">
          <svg className="w-16 h-16 opacity-40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.5 8.5l-3.5-5H6L2.5 8.5 2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-.5-.5zM6.8 5.5h10.4l2.1 3H4.7l2.1-3zM20 19H4V10.5h16V19z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function PixelButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full min-h-[44px] rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white cursor-pointer"
    >
      {children}
    </button>
  );
}

export function PixelBorder() {
  return null;
}

export default function MerchandiseCard({
  product,
  onClick,
  containerClassName = "",
  imageBoxClassName = "aspect-square",
}: MerchandiseCardProps) {
  const priceDisplay = formatProductPrice(product.price);
  const statusDisplay =
    product.status ||
    (product.stock !== undefined && product.stock !== null && product.stock > 0
      ? "Ready Stock"
      : null);

  return (
    <article
      aria-label={`Merchandise: ${product.name}`}
      className={`group flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-5 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] ${containerClassName}`}
    >
      <div>
        {/* 1. ARTWORK */}
        <button
          type="button"
          onClick={onClick}
          aria-label={`Pesan ${product.name}`}
          className={`relative mb-4 w-full overflow-hidden rounded-xl bg-black/60 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-arcade-yellow ${imageBoxClassName}`}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={`${product.name} merchandise`}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-white/50">
              <svg
                className="mb-2 h-14 w-14 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow/80">
                P2R Merchandise
              </span>
            </div>
          )}

          {/* Optional Category Overlay Badge */}
          {product.category && (
            <span className="absolute top-2.5 left-2.5 rounded-md border border-white/20 bg-black/70 px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-white">
              {typeof product.category === "object" ? product.category.name : product.category}
            </span>
          )}
        </button>

        {/* 2. STATUS & AVAILABILITY */}
        <div className="mb-2 flex items-center justify-between gap-2">
          {statusDisplay ? (
            <span className="inline-block rounded border border-arcade-green/40 bg-arcade-green/10 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-arcade-green">
              {statusDisplay}
            </span>
          ) : (
            <span className="inline-block rounded border border-white/15 bg-white/5 px-2 py-0.5 font-display text-xs uppercase tracking-wider text-white/60">
              Official Danus
            </span>
          )}

          {/* 4. PRICE */}
          <span className="font-mono text-base font-bold text-white">
            {priceDisplay}
          </span>
        </div>

        {/* 3. PRODUCT NAME */}
        <h3 className="font-display text-xl font-bold leading-snug text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)] sm:text-2xl">
          {product.name}
        </h3>

        {/* 5. SHORT DESCRIPTION */}
        <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-white/80">
          {product.description ||
            "Merchandise resmi edisi Cyber Arcade Pixel To Reality karya siswa RPL."}
        </p>
      </div>

      {/* 6. PRIMARY ORDER CTA */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onClick}
          aria-label={`Pesan ${product.name} Sekarang`}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white cursor-pointer"
        >
          Pesan Sekarang
        </button>
      </div>
    </article>
  );
}