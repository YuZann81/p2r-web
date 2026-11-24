import React from "react";
import type { Product } from "@/lib/api/types/product";

export type MerchandiseCardProps = {
  product: Product;
  onClick: () => void;
  containerClassName?: string;
  imageBoxClassName?: string;
};

export default function MerchandiseCard({
  product,
  onClick,
  containerClassName = "",
  imageBoxClassName = "aspect-square",
}: MerchandiseCardProps) {
  const coinPrice = product.coin_price ?? product.price;
  const formattedPrice =
    typeof coinPrice === "number" && coinPrice > 0
      ? `${coinPrice.toLocaleString("id-ID")} Koin`
      : "Info di Booth";

  return (
    <div
      className={`group flex flex-col justify-between rounded-2xl border-2 border-[#39265E] bg-[#211B35] p-4 shadow-[4px_4px_0_#0E0A1A] transition-all hover:-translate-y-1 hover:border-[#FFD447]/60 hover:shadow-[6px_6px_0_#0E0A1A] ${containerClassName}`}
    >
      <div>
        {/* Product Image Area */}
        <button
          type="button"
          onClick={onClick}
          aria-label={`Lihat detail ${product.name}`}
          className={`relative w-full overflow-hidden rounded-xl bg-[#171224] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] cursor-pointer ${imageBoxClassName}`}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={`${product.name} merchandise`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-[#B7ABCE]">
              <svg
                className="h-12 w-12 mb-2 opacity-50"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21.5 8.5l-3.5-5H6L2.5 8.5 2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-.5-.5zM6.8 5.5h10.4l2.1 3H4.7l2.1-3zM20 19H4V10.5h16V19z" />
              </svg>
              <span className="font-display text-sm font-bold text-center uppercase tracking-wide text-[#FFD447]">
                {product.name}
              </span>
            </div>
          )}

          {product.stock !== undefined && (
            <div className="absolute top-2.5 right-2.5 rounded-md bg-[#0E0A1A]/85 px-2 py-0.5 font-display text-[11px] text-[#68D5E8] backdrop-blur-xs">
              Stok: {product.stock}
            </div>
          )}
        </button>

        {/* Info */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="rounded-md bg-[#68D5E8]/15 px-2 py-0.5 font-display text-xs text-[#68D5E8]">
            OFFICIAL P2R
          </span>
          <p className="font-display text-base font-bold text-[#FFD447]">
            {formattedPrice}
          </p>
        </div>
        <h3 className="mt-2 truncate font-display text-lg text-[#FFF5E9]">
          {product.name}
        </h3>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onClick}
          aria-label={`Detail ${product.name}`}
          className="w-full min-h-11 inline-flex items-center justify-center rounded-xl bg-[#FFD447] py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[2px_2px_0_#B8960A] transition-all hover:bg-[#FFE500] hover:shadow-[3px_3px_0_#B8960A] active:translate-y-0.5 active:shadow-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
