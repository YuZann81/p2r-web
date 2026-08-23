"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/api/types/product";
import MerchandiseCard from "@/components/MerchandiseCard";
import OrderModal from "@/components/Order";
import { useAuth } from "@/lib/auth/auth-context";

type MerchandiseCatalogProps = {
  products: Product[];
};

function getProductCategoryName(category: Product["category"]): string {
  if (!category) return "";
  if (typeof category === "string") return category.trim();
  return (category.name || "").trim();
}

function MerchandiseCatalogInner({ products }: MerchandiseCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories dynamically from actual products dataset
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    products.forEach((p) => {
      const catName = getProductCategoryName(p.category);
      if (catName !== "") {
        categoriesSet.add(catName);
      }
    });
    return Array.from(categoriesSet);
  }, [products]);

  // Filtered products by category & search query
  const filteredProducts = useMemo(() => {
    let list = products;

    if (selectedCategory !== "all") {
      list = list.filter(
        (p) =>
          getProductCategoryName(p.category).toLowerCase() ===
          selectedCategory.toLowerCase().trim(),
      );
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q),
      );
    }

    return list;
  }, [products, selectedCategory, searchQuery]);

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
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/merchandise";
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

  if (products.length === 0) {
    return (
      <section
        aria-label="Katalog Merchandise Kosong"
        className="w-full flex flex-col items-center justify-center p-10 md:p-16 border-2 border-dashed border-arcade-yellow/40 bg-[#1e1040] text-center rounded-2xl"
      >
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-arcade-yellow/20 text-arcade-yellow">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span className="inline-block rounded-md border border-arcade-yellow/40 bg-arcade-yellow/10 px-3.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow mb-3">
          Koleksi Pameran
        </span>
        <h2 className="font-display text-2xl md:text-3xl text-arcade-yellow font-bold drop-shadow-sm mb-3">
          Belum ada merchandise yang tersedia.
        </h2>
        <p className="text-white/80 font-medium text-sm sm:text-base max-w-md leading-relaxed">
          Koleksi cinderamata resmi pameran sedang dipersiapkan oleh tim dana usaha siswa RPL.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Daftar Merchandise Pameran" className="w-full">
      {/* Category Filter Buttons (Only shown if multiple categories exist) */}
      {availableCategories.length > 0 && (
        <div
          aria-label="Filter Kategori Merchandise"
          className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <button
            type="button"
            aria-pressed={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-bold tracking-wider transition-all duration-150 outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-white ${
              selectedCategory === "all"
                ? "bg-arcade-yellow text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] -translate-y-0.5"
                : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
            }`}
          >
            Semua Merchandise
          </button>

          {availableCategories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-150 outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-white ${
                  isActive
                    ? "bg-arcade-yellow text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] -translate-y-0.5"
                    : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white border border-white/20"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Discovery Control Bar: Search Input & Result Counter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/50">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari merchandise atau cinderamata..."
            aria-label="Cari katalog merchandise"
            className="w-full rounded-xl border border-white/20 bg-black/40 py-2.5 pl-10 pr-10 text-sm font-medium text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Hapus pencarian"
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/50 hover:text-white cursor-pointer"
            >
              <span className="font-display text-sm">✕</span>
            </button>
          )}
        </div>

        <div className="font-display text-sm tracking-wider uppercase text-arcade-yellow">
          Menampilkan {filteredProducts.length} dari {products.length} Merchandise
        </div>
      </div>

      {/* Products Grid or Empty Search State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <MerchandiseCard
              key={product.id}
              product={product}
              onClick={() => handleOpenOrder(product)}
              containerClassName="col-span-1"
              imageBoxClassName="aspect-square"
            />
          ))}
        </div>
      ) : (
        <div
          role="status"
          aria-label="Tidak ada merchandise"
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-10 text-center sm:p-14"
        >
          <h3 className="font-display text-xl text-arcade-yellow sm:text-2xl">
            Tidak Ditemukan Merchandise
          </h3>
          <p className="mt-2 max-w-md text-sm text-white/80">
            {searchQuery
              ? `Tidak ada produk yang sesuai dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.`
              : "Belum ada produk untuk kategori ini."}
          </p>
          {(selectedCategory !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Lihat Semua Merchandise
            </button>
          )}
        </div>
      )}

      {isOrderOpen && (
        <OrderModal
          product={selectedProduct}
          onClose={handleCloseOrder}
        />
      )}
    </section>
  );
}

export default function MerchandiseCatalog(props: MerchandiseCatalogProps) {
  return (
    <Suspense fallback={<div className="text-center font-display text-arcade-yellow">Memuat katalog merchandise...</div>}>
      <MerchandiseCatalogInner {...props} />
    </Suspense>
  );
}
