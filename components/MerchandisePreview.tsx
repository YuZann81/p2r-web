import React from "react";
import Link from "next/link";
import { fetchProducts } from "@/lib/api/products";
import { formatProductPrice } from "@/components/MerchandiseCard";

export default async function MerchandisePreview() {
  const products = await fetchProducts();
  const previewProducts = products.slice(0, 3);

  return (
    <section
      id="merchandise"
      aria-label="Koleksi Merchandise Resmi"
      className="w-full bg-[#180e3d] py-14 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-12">
          <span className="inline-block rounded-full border border-arcade-yellow/40 bg-arcade-yellow/10 px-4 py-1 font-display text-xs font-bold tracking-wider uppercase text-arcade-yellow sm:text-sm">
            Cinderamata &amp; Dana Usaha
          </span>
          <h2 className="mt-3 font-display text-2xl text-arcade-yellow [text-shadow:2px_3px_0_var(--arcade-ink)] sm:text-4xl md:text-5xl">
            MERCHANDISE RESMI P2R
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-pretty text-white/90 sm:text-base md:text-lg">
            Koleksi cinderamata resmi bertema Cyber Arcade. Setiap pesanan dikelola tim dana usaha siswa RPL untuk mendukung kesuksesan pameran.
          </p>
        </div>

        {/* Preview Products Grid */}
        {previewProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {previewProducts.map((product) => (
              <article
                key={product.id}
                aria-label={`Merchandise: ${product.name}`}
                className="group flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#1e1040] p-5 transition-all duration-150 hover:-translate-y-1 hover:border-arcade-yellow hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)]"
              >
                <div>
                  {/* Artwork Preview */}
                  <div className="relative mb-3.5 aspect-square w-full overflow-hidden rounded-xl bg-black/60">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={`${product.name} merchandise`}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 [image-rendering:pixelated]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-white/40">
                        <svg
                          className="h-12 w-12 opacity-50"
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
                      </div>
                    )}
                  </div>

                  {/* Price & Name */}
                  <div className="mb-1 flex items-center justify-between">
                    <span className="inline-block rounded border border-white/15 bg-white/5 px-2 py-0.5 font-display text-xs uppercase tracking-wider text-white/60">
                      Official Danus
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {formatProductPrice(product.price)}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold leading-snug text-arcade-yellow [text-shadow:1px_1px_0_var(--arcade-ink)]">
                    {product.name}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-white/80 sm:text-sm">
                    {product.description || "Merchandise edisi resmi Cyber Arcade pameran Pixel To Reality."}
                  </p>
                </div>

                <div className="mt-4 border-t border-white/10 pt-3">
                  <Link
                    href="/merchandise"
                    className="inline-flex min-h-[40px] w-full items-center justify-center rounded-xl bg-arcade-yellow px-4 py-2 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--arcade-yellow-shadow)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Pesan Merchandise →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-arcade-yellow/30 bg-[#1e1040] p-10 text-center">
            <span className="font-display text-lg text-arcade-yellow">
              Belum ada merchandise yang tersedia.
            </span>
            <p className="mt-2 text-sm text-white/80">
              Koleksi cinderamata resmi pameran sedang dipersiapkan oleh tim dana usaha.
            </p>
          </div>
        )}

        {/* Section CTA */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/merchandise"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-8 py-3 font-display text-base font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Lihat Semua Merchandise →
          </Link>
        </div>
      </div>
    </section>
  );
}
