"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getActiveQris,
  uploadPaymentProof,
  cancelPayment,
  type ActiveQris,
  type PaymentData,
} from "@/lib/api/payment";
import { formatProductPrice } from "@/lib/utils";

interface OrderPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  grandTotal: string | number;
  paymentData?: PaymentData | null;
  onPaymentUpdated?: () => void;
}

export default function OrderPaymentModal({
  isOpen,
  onClose,
  orderCode,
  grandTotal,
  paymentData,
  onPaymentUpdated,
}: OrderPaymentModalProps) {
  const { token } = useAuth();
  const [activeQris, setActiveQris] = useState<ActiveQris | null>(null);
  const [currentPayment, setCurrentPayment] = useState<PaymentData | null>(paymentData || null);
  const [isLoadingQris, setIsLoadingQris] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (paymentData) {
      setCurrentPayment(paymentData);
    }
  }, [paymentData]);

  // Load Active QRIS
  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingQris(true);
    getActiveQris()
      .then((qris) => {
        setActiveQris(qris);
      })
      .catch(() => {
        setActiveQris(null);
      })
      .finally(() => {
        setIsLoadingQris(false);
      });
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal adalah 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !token) {
      setErrorMessage("Silakan pilih gambar bukti transfer terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await uploadPaymentProof(selectedFile, token);
      setCurrentPayment(updated);
      setSelectedFile(null);
      setPreviewUrl(null);
      setSuccessMessage("Bukti pembayaran berhasil dikirim! Menunggu verifikasi admin.");
      if (onPaymentUpdated) {
        onPaymentUpdated();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah bukti transfer.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = async () => {
    if (!currentPayment || !token) return;
    const confirm = window.confirm("Apakah Anda yakin ingin membatalkan sesi pembayaran ini?");
    if (!confirm) return;

    try {
      await cancelPayment(currentPayment.id, token);
      if (onPaymentUpdated) {
        onPaymentUpdated();
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal membatalkan pembayaran.";
      setErrorMessage(msg);
    }
  };

  if (!isOpen) return null;

  const paymentStatus = currentPayment?.payment_status || "waiting_payment";
  const displayAmount = currentPayment?.transfer_amount || grandTotal;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-in fade-in"
    >
      <div className="relative my-auto w-full max-w-xl rounded-3xl border-2 border-white/20 bg-[#190e3c] p-5 sm:p-7 text-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs font-bold tracking-wider text-arcade-yellow uppercase">
              Pembayaran QRIS • {orderCode}
            </span>
            <h2 id="payment-modal-title" className="font-display text-xl sm:text-2xl text-white">
              Bayar Pesanan
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pembayaran"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/40 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-500/50 bg-red-500/20 p-3 text-xs font-semibold text-red-200">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 rounded-xl border border-emerald-500/50 bg-emerald-500/20 p-3 text-xs font-semibold text-emerald-200">
            {successMessage}
          </div>
        )}

        {/* Main Content Body */}
        <div className="mt-4 space-y-4">
          {/* Status Badge Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/40 p-3">
            <span className="text-xs text-white/70">Status Tagihan:</span>
            {paymentStatus === "waiting_payment" && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/40 bg-amber-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-300 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Menunggu Pembayaran
              </span>
            )}
            {paymentStatus === "waiting_verification" && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-400/40 bg-blue-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-300 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping"></span>
                Menunggu Verifikasi Admin
              </span>
            )}
            {paymentStatus === "approved" && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300 uppercase">
                ✓ Pembayaran Terverifikasi (Lunas)
              </span>
            )}
            {paymentStatus === "rejected" && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-red-400/40 bg-red-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-red-300 uppercase">
                ✕ Ditolak
              </span>
            )}
          </div>

          {/* Rejection Alert */}
          {paymentStatus === "rejected" && currentPayment?.rejection_reason && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
              <p className="font-bold text-red-300">Alasan Penolakan:</p>
              <p className="mt-0.5">{currentPayment.rejection_reason}</p>
              <p className="mt-1 text-[11px] text-red-300/80">
                Silakan unggah ulang bukti transfer yang jelas di bawah ini.
              </p>
            </div>
          )}

          {/* QRIS & Amount Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: QRIS Image */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
              <span className="text-[11px] font-bold tracking-wider text-arcade-yellow uppercase">
                {activeQris?.name || "QRIS Dana Usaha P2R"}
              </span>

              <div className="my-2 overflow-hidden rounded-xl border border-white/20 bg-white p-2 shadow-inner">
                {isLoadingQris ? (
                  <div className="flex h-36 w-36 items-center justify-center text-xs text-slate-500">
                    Memuat QRIS...
                  </div>
                ) : activeQris?.qr_image_url ? (
                  <img
                    src={activeQris.qr_image_url}
                    alt="QRIS Code"
                    className="h-36 w-36 object-contain"
                  />
                ) : (
                  <div className="flex h-36 w-36 flex-col items-center justify-center bg-slate-100 text-slate-700 text-xs">
                    <span>📱</span>
                    <span className="mt-1 font-bold">QRIS Aktif</span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-white/60">
                Scan via BCA, GoPay, OVO, Dana, ShopeePay
              </span>
            </div>

            {/* Right: Total Amount & Instructions */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-4">
              <div>
                <span className="text-xs text-white/60">Total yang harus dibayar:</span>
                <div className="mt-1 font-mono text-2xl font-bold text-arcade-yellow">
                  {formatProductPrice(displayAmount)}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-white/70">
                  Pastikan nominal yang Anda transfer <strong>sama persis</strong> hingga rupiah terakhir agar verifikasi otomatis berjalan lancar.
                </p>
              </div>

              <div className="mt-3 border-t border-white/10 pt-2 text-[11px] text-arcade-yellow/90">
                ⚡ Setelah transfer, lampirkan bukti pembayaran di bawah.
              </div>
            </div>
          </div>

          {/* Upload Proof Section */}
          {paymentStatus !== "approved" && (
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <h3 className="font-display text-sm font-bold text-white mb-1">
                {paymentStatus === "waiting_verification"
                  ? "Bukti Transfer Terkirim"
                  : "Unggah Bukti Transfer"}
              </h3>
              <p className="text-xs text-white/70 mb-3">
                {paymentStatus === "waiting_verification"
                  ? "Bukti telah diterima. Admin sedang memverifikasi. Anda dapat mengunggah bukti baru jika ingin mengganti."
                  : "Unggah screenshot atau foto struk bukti pembayaran berhasil."}
              </p>

              <form onSubmit={handleUploadProof} className="space-y-3">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="modal-proof-upload-input"
                  />
                  <label
                    htmlFor="modal-proof-upload-input"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/30 bg-black/30 p-3 text-center transition-colors hover:border-arcade-yellow hover:bg-black/40"
                  >
                    {previewUrl ? (
                      <div className="space-y-1">
                        <img
                          src={previewUrl}
                          alt="Preview Bukti"
                          className="mx-auto max-h-24 rounded object-contain"
                        />
                        <span className="block text-xs font-semibold text-arcade-yellow">
                          Ganti Gambar
                        </span>
                      </div>
                    ) : currentPayment?.proof_image ? (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-emerald-400">
                          ✓ Bukti transfer telah tersimpan
                        </div>
                        <span className="block text-[11px] text-white/70 underline">
                          Klik jika ingin mengganti bukti baru
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xl">📸</span>
                        <span className="block text-xs font-semibold text-white">
                          Pilih Foto Bukti Transfer
                        </span>
                        <span className="block text-[10px] text-white/50">
                          JPG, PNG, JPEG (Maks. 5MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="flex w-full min-h-[42px] items-center justify-center rounded-xl bg-arcade-yellow py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUploading ? "Mengunggah Bukti..." : "Kirim Bukti Pembayaran"}
                </button>
              </form>
            </div>
          )}

          {/* Approved State Summary */}
          {paymentStatus === "approved" && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center space-y-2">
              <div className="text-2xl">🎉</div>
              <h3 className="font-display text-base font-bold text-emerald-300">
                Pembayaran Berhasil Diverifikasi!
              </h3>
              <p className="text-xs text-emerald-100">
                Pesanan Anda telah lunas dan sedang dipersiapkan oleh tim pameran Pixel To Reality.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          {paymentStatus === "waiting_payment" ? (
            <button
              type="button"
              onClick={handleCancel}
              className="text-red-400 hover:underline cursor-pointer"
            >
              Batalkan Pembayaran
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 font-display text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
          >
            Tutup (Bisa dibuka lagi nanti)
          </button>
        </div>
      </div>
    </div>
  );
}
