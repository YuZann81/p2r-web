"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getReceipts, type ReceiptData } from "@/lib/api/receipts";
import { formatProductPrice } from "@/lib/utils";

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
      <main className="min-h-screen bg-[#11092a] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-arcade-yellow border-t-transparent"></div>
          <p className="mt-4 font-display text-sm tracking-wider text-arcade-yellow">
            Memuat Daftar Receipt…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#11092a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-arcade-yellow">
              Pixel To Reality • Official Invoices
            </span>
            <h1 className="mt-1 font-display text-2xl text-white sm:text-3xl">
              Bukti Transaksi & Receipt Resmi
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow"
            >
              Daftar Pesanan
            </Link>
            <Link
              href="/payment"
              className="rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow"
            >
              Pembayaran QRIS
            </Link>
          </div>
        </div>

        {/* Receipt List */}
        {receipts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a0e3b] p-10 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-arcade-yellow/30 bg-arcade-yellow/10 text-2xl text-arcade-yellow">
              🧾
            </div>
            <h3 className="font-display text-lg text-white">
              Receipt belum tersedia.
            </h3>
            <p className="mt-2 text-xs text-white/60">
              Receipt resmi otomatis diterbitkan setelah pembayaran pesanan diverifikasi oleh admin.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/orders"
                className="rounded-xl bg-arcade-yellow px-5 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-md transition-transform hover:-translate-y-0.5"
              >
                Periksa Status Pesanan
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
                      className="rounded-xl bg-arcade-yellow px-3.5 py-1.5 font-display text-xs font-bold text-arcade-ink shadow-sm hover:opacity-90"
                    >
                      Buka Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Receipt Modal / Printable */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border-2 border-white/20 bg-[#160d36] p-6 shadow-2xl">
              {/* Receipt Header */}
              <div className="border-b border-white/10 pb-4 text-center">
                <span className="font-mono text-[11px] font-bold tracking-widest text-arcade-yellow uppercase">
                  PIXEL TO REALITY EXHIBITION 2026
                </span>
                <h3 className="mt-1 font-display text-xl text-white">
                  OFFICIAL RECEIPT
                </h3>
                <div className="mt-1 font-mono text-xs font-bold text-arcade-yellow">
                  No: {selectedReceipt.receipt_number}
                </div>
              </div>

              {/* Receipt Body */}
              <div className="my-4 space-y-3 font-sans text-xs">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-white/60">Kode Order:</span>
                    <span className="font-mono font-semibold text-white">
                      {selectedReceipt.order.order_code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Tanggal & Waktu:</span>
                    <span className="text-white">
                      {new Date(selectedReceipt.issued_at).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Nama Pelanggan:</span>
                    <span className="font-semibold text-white">
                      {selectedReceipt.order.customer_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Kontak WhatsApp:</span>
                    <span className="text-white">
                      {selectedReceipt.order.customer_phone || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Status:</span>
                    <span className="font-bold text-emerald-400">LUNAS / VERIFIED</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="border-b border-white/10 pb-1 font-semibold text-arcade-yellow">
                    Rincian Item
                  </div>
                  <div className="mt-2 max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {selectedReceipt.order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-white">
                            {item.quantity}x {item.product_name}
                          </div>
                          <div className="text-[10px] text-white/50">
                            @{formatProductPrice(item.unit_price)}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-arcade-yellow">
                          {formatProductPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/50 p-3">
                  <span className="font-display text-sm font-bold text-white">
                    Total Pembayaran
                  </span>
                  <span className="font-mono text-lg font-bold text-arcade-yellow">
                    {formatProductPrice(selectedReceipt.order.grand_total)}
                  </span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 font-display text-xs font-bold text-white hover:bg-white/10"
                >
                  Cetak / Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-xl bg-arcade-yellow px-4 py-2 font-display text-xs font-bold text-arcade-ink shadow-md"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
