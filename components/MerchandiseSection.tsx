"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/api/types/product';
import { fetchProducts } from '@/lib/api/products';
import Order from './Order';
import ChatAdmin from './ChatAdmin';
import MerchandiseCard from './MerchandiseCard';
import { useAuth } from '@/lib/auth/auth-context';

function MerchandiseSectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

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

  // Auto-resume order when returning from auth redirect
  useEffect(() => {
    const action = searchParams?.get ? searchParams.get("action") : null;
    const productId = searchParams?.get ? searchParams.get("productId") : null;

    if (action === "order" && productId && isAuthenticated && products.length > 0) {
      const match = products.find((p) => String(p.id) === String(productId));
      if (match) {
        setSelectedProduct(match);
        setIsOrderOpen(true);
      }
    }
  }, [searchParams, isAuthenticated, products]);

  const handleOpenOrder = (product: Product) => {
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
      const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}&action=order&productId=${encodeURIComponent(product.id)}`;
      router.push(redirectUrl);
      return;
    }

    setSelectedProduct(product);
    setIsOrderOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section id="merchandise" className="relative w-full bg-[#1A142A] font-body text-[#FFF5E9] py-16 md:py-24 border-t border-[#39265E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

        {/* KIRI: Loading State, Grid Produk, atau Empty State */}
        {isLoading ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-[#FFD447]/30 bg-[#211B35]/40 text-center rounded-2xl backdrop-blur-xs min-h-[300px]">
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
                onClick={() => handleOpenOrder(product)}
                containerClassName={index === 0 ? "md:col-span-2" : "col-span-1"}
                imageBoxClassName={index === 0 ? "aspect-[16/10]" : "aspect-square"}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-10 md:p-14 border-2 border-dashed border-[#FFD447]/40 bg-[#211B35]/60 text-center rounded-2xl">
            <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-[#FFD447]/20 text-[#FFD447]">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
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
              Koleksi resmi Pixel To Reality sedang dipersiapkan. Kunjungi booth pameran atau pesan via chat admin!
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
              Dukung kreator muda dengan membeli merchandise resmi edisi terbatas: kaos eksklusif, enamel pin, lanyard, sticker pack, dan totebag official Pixel To Reality.
            </p>

            <Link
              href="/merchandise"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#FFD447] py-3 font-display text-lg font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A]"
            >
              Lihat Semua Merchandise
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        aria-label="Buka Chat Admin"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FFD447] text-[#0E0A1A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#0E0A1A] hover:scale-105 active:scale-95 transition-all z-40 outline-none cursor-pointer"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
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

export default function MerchandiseSection() {
  return (
    <Suspense fallback={<div className="text-center font-display text-[#FFD447] py-12">Memuat section merchandise...</div>}>
      <MerchandiseSectionContent />
    </Suspense>
  );
}
