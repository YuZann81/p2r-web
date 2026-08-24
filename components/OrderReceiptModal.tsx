"use client";

import React, { useEffect } from "react";
import { formatProductPrice } from "@/lib/utils";
import type { ReceiptData } from "@/lib/api/receipts";

interface OrderReceiptModalProps {
  receipt: ReceiptData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderReceiptModal({
  receipt,
  isOpen,
  onClose,
}: OrderReceiptModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-in fade-in"
      >
        <div className="relative my-auto w-full max-w-lg rounded-3xl border-2 border-white/20 bg-[#170e38] p-5 sm:p-7 text-white shadow-2xl">
          {/* Printable Receipt Container */}
          <div id="printable-receipt-card" className="space-y-4">
            {/* Header */}
            <div className="border-b border-white/15 pb-4 text-center">
              <span className="font-mono text-[11px] font-bold tracking-widest text-arcade-yellow uppercase">
                PIXEL TO REALITY EXHIBITION 2026
              </span>
              <h2 id="receipt-modal-title" className="mt-1 font-display text-2xl text-white">
                KUITANSI RESMI (RECEIPT)
              </h2>
              <div className="mt-1 font-mono text-xs font-bold text-arcade-yellow">
                No: {receipt.receipt_number}
              </div>
            </div>

            {/* Info Summary */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/60">Kode Pesanan:</span>
                <span className="font-mono font-bold text-white">
                  {receipt.order.order_code}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/60">Tanggal Terbit:</span>
                <span className="text-white">
                  {new Date(receipt.issued_at).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/60">Nama Pemesan:</span>
                <span className="font-semibold text-white">
                  {receipt.order.customer_name}
                </span>
              </div>
              {receipt.order.customer_phone && (
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-white/60">Nomor Kontak:</span>
                  <span className="font-mono text-white">
                    {receipt.order.customer_phone}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-0.5">
                <span className="text-white/60">Status Transaksi:</span>
                <span className="rounded bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300 uppercase">
                  ✓ LUNAS / TERVERIFIKASI
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <span className="block font-display text-xs font-bold text-arcade-yellow uppercase mb-2">
                Rincian Pembelian
              </span>
              <div className="divide-y divide-white/5 max-h-48 overflow-y-auto pr-1 text-xs">
                {receipt.order.items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {item.quantity}x {item.product_name}
                      </p>
                      <p className="font-mono text-[10px] text-white/50">
                        @{formatProductPrice(item.unit_price)}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-arcade-yellow">
                      {formatProductPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 p-4">
              <span className="font-display text-sm font-bold text-white">
                Total Pembayaran Lunas
              </span>
              <span className="font-mono text-xl font-bold text-arcade-yellow">
                {formatProductPrice(receipt.order.grand_total)}
              </span>
            </div>

            <p className="text-center font-mono text-[11px] text-white/50">
              Dokumen ini merupakan bukti pembayaran sah Dana Usaha Pameran Pixel To Reality 2026.
            </p>
          </div>

          {/* Action Buttons (Excluded from Print) */}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-black/40 px-4 py-2 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow cursor-pointer"
            >
              <span>🖨️</span>
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-arcade-yellow px-5 py-2 font-display text-xs font-bold text-arcade-ink shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Print Stylesheet injection */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt-card,
          #printable-receipt-card * {
            visibility: visible !important;
          }
          #printable-receipt-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            border: 1px solid #ddd !important;
            padding: 24px !important;
          }
          #printable-receipt-card span,
          #printable-receipt-card p,
          #printable-receipt-card h2,
          #printable-receipt-card div {
            color: black !important;
            background: transparent !important;
            border-color: #ccc !important;
          }
        }
      `}</style>
    </>
  );
}
