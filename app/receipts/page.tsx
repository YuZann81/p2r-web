"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth/auth-context";
import { getReceipts, type ReceiptData } from "@/lib/api/receipts";
import { formatProductPrice } from "@/lib/utils";
import OrderReceiptModal from "@/components/OrderReceiptModal";

export default function ReceiptsPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  const loadReceipts = React.useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getReceipts(token);
      setReceipts(data);
    } catch {
      setReceipts([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/receipts");
      } else {
        loadReceipts();
      }
    }
  }, [isAuthenticated, isAuthLoading, loadReceipts, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col justify-between bg-[#11092a] text-white overflow-x-hidden">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-arcade-yellow border-t-transparent"></div>
            <p className="mt-4 font-display text-sm tracking-wider text-arcade-yellow">
              Memuat Daftar Kuitansi…
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[100dvh] flex-col justify-between overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <Navbar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 md:px-8 text-white">
        {/* Page Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl text-arcade-yellow sm:text-3xl [text-shadow:2px_2px_0_var(--arcade-ink)]">
              KUITANSI RESMI (RECEIPTS)
            </h1>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">
              Arsip dan cetak bukti transaksi pembayaran sah pesanan Dana Usaha.
            </p>
          </div>
          <Link
            href="/orders"
            className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 font-display text-xs font-bold text-arcade-yellow transition-colors hover:border-arcade-yellow hover:bg-black/60"
          >
            📦 Buka Pesanan Saya
          </Link>
        </div>

        {/* Receipt List */}
        {receipts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a0e3b] p-10 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-arcade-yellow/30 bg-arcade-yellow/10 text-2xl text-arcade-yellow">
              🧾
            </div>
            <h3 className="font-display text-lg text-white">
              Belum Ada Kuitansi Resmi
            </h3>
            <p className="mt-2 text-xs text-white/60">
              Kuitansi resmi otomatis diterbitkan setelah pembayaran pesanan diverifikasi oleh admin.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/orders"
                className="rounded-xl bg-arcade-yellow px-5 py-2.5 font-display text-xs font-bold text-arcade-ink shadow-md transition-transform hover:-translate-y-0.5"
              >
                Periksa Status Pesanan Saya
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="flex flex-col justify-between rounded-2xl border border-white/15 bg-[#180e3d] p-5 shadow-lg transition-all hover:border-arcade-yellow/50"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-sm font-bold text-arcade-yellow">
                      {receipt.receipt_number}
                    </span>
                    <span className="rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300 uppercase">
                      LUNAS
                    </span>
                  </div>

                  <div className="my-3 space-y-1 text-xs">
                    <div className="flex justify-between text-white/70">
                      <span>Kode Order:</span>
                      <span className="font-mono font-semibold text-white">
                        {receipt.order.order_code}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Tanggal Terbit:</span>
                      <span className="text-white">
                        {new Date(receipt.issued_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Nama Pemesan:</span>
                      <span className="text-white">{receipt.order.customer_name}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <span className="text-[11px] font-semibold text-arcade-yellow uppercase">
                      Item Pembelian
                    </span>
                    <ul className="mt-1 space-y-1 text-xs">
                      {receipt.order.items.slice(0, 3).map((item, idx) => (
                        <li key={item.id || idx} className="flex justify-between text-white/90">
                          <span>
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="font-mono font-semibold">
                            {formatProductPrice(item.subtotal)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-white/60">Total Lunas</span>
                      <div className="font-mono text-base font-bold text-arcade-yellow">
                        {formatProductPrice(receipt.order.grand_total)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(receipt)}
                      className="rounded-xl bg-arcade-yellow px-3.5 py-1.5 font-display text-xs font-bold text-arcade-ink shadow-sm hover:opacity-90 cursor-pointer"
                    >
                      Buka Kuitansi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Receipt Modal / Printable */}
        <OrderReceiptModal
          receipt={selectedReceipt}
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      </main>

      <Footer />
    </div>
  );
}
