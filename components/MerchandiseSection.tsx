"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/api/types/product";
import { fetchProducts } from "@/lib/api/products";
import MerchandiseInfoModal from "./MerchandiseInfoModal";
import MerchandiseCard from "./MerchandiseCard";

export default function MerchandiseSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="merchandise"
      className="relative w-full bg-[#1A142A] font-body text-[#FFF5E9] py-16 md:py-24 border-t border-[#39265E]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
        {/* KIRI: Loading State, Grid Produk, atau Empty State */}
        {isLoading ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-[#FFD447]/30 bg-[#211B35]/40 text-center rounded-2xl min-h-[300px]">
            <div className="w-10 h-10 mb-4 border-4 border-[#FFD447]/30 border-t-[#FFD447] rounded-full animate-spin" />
            <p className="font-display text-base tracking-wider text-[#FFD447] uppercase">
              Memuat Katalog Merchandise...
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <MerchandiseCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
                containerClassName={index === 0 ? "md:col-span-2" : "col-span-1"}
                imageBoxClassName={index === 0 ? "aspect-[16/10]" : "aspect-square"}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-[#FFD447]/40 bg-[#211B35]/60 text-center rounded-2xl">
            <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-[#FFD447]/20 text-[#FFD447]">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.5 8.5l-3.5-5H6L2.5 8.5 2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-.5-.5zM6.8 5.5h10.4l2.1 3H4.7l2.1-3zM20 19H4V10.5h16V19z" />
              </svg>
            </div>
            <span className="inline-block rounded-full bg-[#FFD447]/20 px-3.5 py-1 font-display text-xs tracking-wider text-[#FFD447] mb-3">
              Official Merch
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-[#FFD447] font-bold mb-2">
              Merchandise Segera Hadir
            </h3>
            <p className="text-[#FFF5E9]/80 font-body text-sm max-w-md leading-relaxed">
              Koleksi resmi Pixel To Reality sedang dipersiapkan. Kunjungi booth panitia pameran untuk informasi penukaran koin!
            </p>
          </div>
        )}

        {/* KANAN: Detail & CTA */}
        <div className="w-full lg:w-80">
          <div className="rounded-2xl border-2 border-[#39265E] bg-[#211B35] p-6 shadow-[6px_6px_0_#0E0A1A]">
            <h2 className="text-[#FFD447] text-3xl font-display font-bold mb-4 drop-shadow-[2px_2px_0_#0E0A1A]">
              OFFICIAL MERCHANDISE
            </h2>
            <p className="text-[#FFF5E9]/85 font-body text-sm leading-relaxed mb-6">
              Tukarkan koin hasil bermain di pameran dengan merchandise resmi edisi terbatas di booth panitia Pixel To Reality.
            </p>

            <Link
              href="/merchandise"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#FFD447] py-3 font-display text-lg font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A]"
            >
              Lihat Semua Merchandise
            </Link>
          </div>
        </div>
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
