"use client";

import React, { useState } from "react";
import type { Product } from "@/lib/api/types/product";
import MerchandiseCard from "@/components/MerchandiseCard";
import OrderModal from "@/components/Order";

type MerchandiseCatalogProps = {
  products: Product[];
};

export default function MerchandiseCatalog({ products }: MerchandiseCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const handleOpenOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderOpen(false);
    setSelectedProduct(null);
  };

  if (products.length === 0) {
    return (
      <section
        aria-label="Katalog Merchandise Kosong"
        className="w-full flex flex-col items-center justify-center p-10 md:p-16 border-2 border-dashed border-arcade-yellow/40 bg-black/20 text-center rounded-2xl backdrop-blur-xs"
      >
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.5 8.5l-3.5-5H6L2.5 8.5 2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-.5-.5zM6.8 5.5h10.4l2.1 3H4.7l2.1-3zM20 19H4V10.5h16V19z" />
          </svg>
        </div>
        <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-sm tracking-wide text-arcade-yellow mb-3">
          Koleksi Pameran
        </span>
        <h2 className="font-display text-2xl md:text-3xl text-arcade-yellow font-bold drop-shadow-sm mb-3">
          Merchandise Segera Hadir
        </h2>
        <p className="text-white/80 font-medium text-base max-w-md leading-relaxed">
          Koleksi resmi Pixel To Reality sedang dipersiapkan. Pantau informasi terbaru melalui admin atau kunjungi booth pameran!
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Daftar Merchandise Pameran" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <MerchandiseCard
            key={product.id}
            product={product}
            onClick={() => handleOpenOrder(product)}
            containerClassName="col-span-1"
            imageBoxClassName="aspect-square"
          />
        ))}
      </div>

      {isOrderOpen && (
        <OrderModal
          product={selectedProduct}
          onClose={handleCloseOrder}
        />
      )}
    </section>
  );
}
