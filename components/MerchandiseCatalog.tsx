"use client";

import React, { useState } from "react";
import type { Product } from "@/lib/api/types/product";
import MerchandiseCard from "@/components/MerchandiseCard";
import MerchandiseInfoModal from "@/components/MerchandiseInfoModal";

type MerchandiseCatalogProps = {
  products: Product[];
};

export default function MerchandiseCatalog({ products }: MerchandiseCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <section
        aria-label="Katalog Merchandise Kosong"
        className="w-full flex flex-col items-center justify-center p-10 md:p-16 border-2 border-dashed border-[#FFD447]/40 bg-[#171224]/60 text-center rounded-2xl"
      >
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#FFD447]/20 text-[#FFD447]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21.5 8.5l-3.5-5H6L2.5 8.5 2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-.5-.5zM6.8 5.5h10.4l2.1 3H4.7l2.1-3zM20 19H4V10.5h16V19z" />
          </svg>
        </div>
        <span className="inline-block rounded-full bg-[#FFD447]/20 px-4 py-1 font-display text-sm tracking-wide text-[#FFD447] mb-3">
          Koleksi Pameran
        </span>
        <h2 className="font-display text-2xl md:text-3xl text-[#FFD447] font-bold mb-3">
          Merchandise Segera Hadir
        </h2>
        <p className="text-[#FFF5E9]/80 font-body text-sm sm:text-base max-w-md leading-relaxed">
          Koleksi resmi Pixel To Reality sedang dipersiapkan. Pantau informasi terbaru atau kunjungi booth panitia pameran!
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Daftar Merchandise Pameran" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product) => (
          <MerchandiseCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
            containerClassName="col-span-1"
            imageBoxClassName="aspect-square"
          />
        ))}
      </div>

      {selectedProduct && (
        <MerchandiseInfoModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
