"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/api/types/product';
import { fetchProducts } from '@/lib/api/products';
import Order from './Order';
import ChatAdmin from './ChatAdmin';
import MerchandiseCard, { PixelBorder } from './MerchandiseCard';

export default function MerchandiseSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const handleOpenOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section id="merchandise" className="relative w-full bg-arcade-violet font-body text-white min-h-screen pb-24">
      <PixelBorder/>
      <div
        className="w-full h-10 bg-repeat-x bg-auto"
        style={{
          backgroundImage: "url('/image_775622.png')",
          imageRendering: "pixelated"
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

        {/* KIRI: Loading State, Grid Produk, atau Empty State */}
        {isLoading ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-arcade-yellow/30 bg-black/20 text-center rounded-2xl backdrop-blur-xs min-h-[300px]">
            <div className="w-12 h-12 mb-4 border-4 border-arcade-yellow/30 border-t-arcade-yellow rounded-full animate-spin" />
            <p className="font-display text-lg tracking-wider text-arcade-yellow uppercase">
              Memuat Katalog Merchandise...
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
            {products.map((product, index) => (
              <MerchandiseCard
                key={product.id}
                product={product}
                onClick={() => handleOpenOrder(product)}
                containerClassName={index === 0 ? "md:col-span-2" : "col-span-1"}
                imageBoxClassName={index === 0 ? "aspect-[16/10]" : "aspect-square"}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-arcade-yellow/40 bg-black/20 text-center rounded-2xl backdrop-blur-xs">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.5 8.5l-3.5-5H6L2.5 8.5 2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-.5-.5zM6.8 5.5h10.4l2.1 3H4.7l2.1-3zM20 19H4V10.5h16V19z" />
              </svg>
            </div>
            <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-sm tracking-wide text-arcade-yellow mb-3">
              Koleksi Pameran
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-arcade-yellow font-bold drop-shadow-sm mb-3">
              Merchandise Segera Hadir
            </h3>
            <p className="text-white/80 font-medium text-base max-w-md leading-relaxed">
              Koleksi resmi Pixel To Reality sedang dipersiapkan. Pantau informasi terbaru melalui admin atau kunjungi booth pameran!
            </p>
          </div>
        )}

        {/* KANAN: Detail & CTA */}
        <div className="w-full lg:w-80 pt-2 lg:pt-0">
          <h2 className="text-arcade-yellow text-4xl font-display font-bold mb-5 drop-shadow-[2px_3px_0_var(--arcade-ink)] leading-tight">
            Detail<br />Merchandise
          </h2>
          <p className="text-white font-semibold text-lg leading-relaxed">
            Koleksi merchandise resmi edisi Cyber Arcade: kaos eksklusif, gantungan kunci, lanyard, stiker pack, dan aksesori resmi Pixel To Reality.
          </p>

          <div className="mt-8">
            <Link
              href="/merchandise"
              className="inline-flex items-center justify-center bg-arcade-yellow px-6 py-3 font-display text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
            >
              Lihat Semua Merchandise
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        aria-label="Buka Chat Admin"
        className="fixed bottom-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all z-40 outline-none cursor-pointer"
      >
        <svg className="w-8 h-8 text-arcade-ink" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 3.358-9 7.5 0 2.38 1.34 4.5 3.38 5.82-.18 1.76-1.19 3.51-1.28 3.66a.75.75 0 00.98 1.05c2.31-1.33 4.14-2.58 5.09-3.23.6.07 1.21.1 1.83.1 4.97 0 9-3.358 9-7.5S16.97 3 12 3z" />
        </svg>
      </button>

      {isOrderOpen && (
        <Order
          product={selectedProduct}
          onClose={handleCloseOrder}
        />
      )}
      {isChatOpen && <ChatAdmin onClose={() => setIsChatOpen(false)} />}

    </section>
  );
}