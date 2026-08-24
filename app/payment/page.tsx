"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getPendingPayment,
  createPayment,
  uploadPaymentProof,
  cancelPayment,
  getActiveQris,
  type PaymentData,
  type ActiveQris,
} from "@/lib/api/payment";
import { formatProductPrice } from "@/lib/utils";

export default function PaymentPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [activeQris, setActiveQris] = useState<ActiveQris | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = React.useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [paymentData, qrisData] = await Promise.all([
        getPendingPayment(token),
        getActiveQris(),
      ]);

      setPayment(paymentData);
      setActiveQris(qrisData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data pembayaran.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/payment");
      } else {
        loadData();
      }
    }
  }, [isAuthenticated, isAuthLoading, loadData, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleCreateQrisPayment = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const newPayment = await createPayment("qris", token);
      setPayment(newPayment);
      setSuccessMessage("Pembayaran QRIS berhasil diinisiasi.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal membuat sesi pembayaran.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
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
      setPayment(updated);
      setSelectedFile(null);
      setPreviewUrl(null);
      setSuccessMessage("Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah bukti transfer.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!payment || !token) return;
    const confirm = window.confirm("Apakah Anda yakin ingin membatalkan sesi pembayaran ini?");
    if (!confirm) return;

    try {
      setIsLoading(true);
      await cancelPayment(payment.id, token);
      setPayment(null);
      setSuccessMessage("Sesi pembayaran berhasil dibatalkan.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal membatalkan pembayaran.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <main className="min-h-screen bg-[#11092a] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-arcade-yellow border-t-transparent"></div>
          <p className="mt-4 font-display text-sm tracking-wider text-arcade-yellow">
            Memuat Data Pembayaran…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#11092a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-arcade-yellow">
              Pixel To Reality • Checkout & Billing
            </span>
            <h1 className="mt-1 font-display text-2xl text-white sm:text-3xl">
              Pembayaran & Konfirmasi QRIS
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
              href="/receipts"
              className="rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow"
            >
              Receipts
            </Link>
          </div>
        </div>

        {/* Notification Alerts */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        {/* If no active payment */}
        {!payment ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a0e3b] p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-arcade-yellow/30 bg-arcade-yellow/10 text-2xl text-arcade-yellow">
              💳
            </div>
            <h2 className="font-display text-xl text-white">
              Tidak Ada Pembayaran Aktif
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Anda tidak memiliki tagihan pembayaran yang sedang aktif saat ini.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleCreateQrisPayment}
                className="rounded-xl bg-arcade-yellow px-5 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-md transition-transform hover:-translate-y-0.5"
              >
                Inisiasi Pembayaran QRIS dari Checkout
              </button>
              <Link
                href="/merchandise"
                className="rounded-xl border border-white/20 bg-black/40 px-5 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Katalog Merchandise
              </Link>
            </div>
          </div>
        ) : (
          /* Payment Card */
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 p-4">
              <div>
                <span className="text-xs text-white/60">Status Pembayaran:</span>
                <div className="mt-0.5 flex items-center gap-2">
                  {payment.payment_status === "waiting_payment" && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/40 bg-amber-500/15 px-3 py-1 font-mono text-xs font-bold text-amber-300 uppercase">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                      Belum Dibayar
                    </span>
                  )}
                  {payment.payment_status === "waiting_verification" && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-400/40 bg-blue-500/15 px-3 py-1 font-mono text-xs font-bold text-blue-300 uppercase">
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
                      Menunggu Verifikasi Admin
                    </span>
                  )}
                  {payment.payment_status === "approved" && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 font-mono text-xs font-bold text-emerald-300 uppercase">
                      ✓ Disetujui / Lunas
                    </span>
                  )}
                  {payment.payment_status === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-red-400/40 bg-red-500/15 px-3 py-1 font-mono text-xs font-bold text-red-300 uppercase">
                      ✕ Ditolak
                    </span>
                  )}
                  {payment.payment_status === "expired" && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-400/40 bg-slate-500/15 px-3 py-1 font-mono text-xs font-bold text-slate-400 uppercase">
                      Kedaluwarsa
                    </span>
                  )}
                  <span className="font-mono text-xs text-white/70 uppercase">
                    • Metode: {payment.payment_method}
                  </span>
                </div>
              </div>

              {payment.checkout_code && (
                <div className="text-right">
                  <span className="text-xs text-white/60">Kode Checkout:</span>
                  <div className="font-mono text-sm font-bold text-arcade-yellow">
                    {payment.checkout_code}
                  </div>
                </div>
              )}
            </div>

            {/* Rejection Reason Alert */}
            {payment.payment_status === "rejected" && payment.rejection_reason && (
              <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-4">
                <h3 className="font-display text-sm font-bold text-red-300">
                  Pembayaran Ditolak oleh Admin
                </h3>
                <p className="mt-1 text-xs text-red-200">
                  Alasan: <strong>{payment.rejection_reason}</strong>
                </p>
                <p className="mt-2 text-[11px] text-red-300/80">
                  Silakan unggah ulang bukti transfer yang jelas di bawah ini.
                </p>
              </div>
            )}

            {/* Payment Amount & QRIS Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* QRIS Display Box */}
              <div className="rounded-3xl border border-white/10 bg-[#1a0e3b] p-6 text-center shadow-xl">
                <span className="inline-block rounded-md border border-arcade-yellow/30 bg-arcade-yellow/10 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-arcade-yellow">
                  Scan QRIS Resmi
                </span>
                <h3 className="mt-2 font-display text-lg text-white">
                  {activeQris?.name || "QRIS Pixel To Reality"}
                </h3>

                <div className="my-4 flex items-center justify-center">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-white p-3 shadow-md">
                    {activeQris?.qr_image_url ? (
                      <img
                        src={activeQris.qr_image_url}
                        alt="QRIS Barcode"
                        className="h-48 w-48 object-contain"
                      />
                    ) : (
                      <div className="flex h-48 w-48 flex-col items-center justify-center bg-slate-100 text-slate-700">
                        <span className="text-3xl">📱</span>
                        <span className="mt-2 font-mono text-xs font-bold">
                          QRIS P2R Active
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                  <span className="text-xs text-white/60">Total Nominal Pembayaran</span>
                  <div className="font-mono text-2xl font-bold text-arcade-yellow">
                    {formatProductPrice(payment.transfer_amount)}
                  </div>
                </div>
              </div>

              {/* Upload Proof Box */}
              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#1a0e3b] p-6 shadow-xl">
                <div>
                  <h3 className="font-display text-lg text-white">
                    Unggah Bukti Pembayaran
                  </h3>
                  <p className="mt-1 text-xs text-white/70">
                    Setelah melakukan scan dan transfer via QRIS / M-Banking, unggah tangkapan layar (screenshot) bukti transfer Anda.
                  </p>

                  <form onSubmit={handleUploadProof} className="mt-4 space-y-4">
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="proof-upload-input"
                      />
                      <label
                        htmlFor="proof-upload-input"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/30 bg-black/30 p-4 text-center transition-colors hover:border-arcade-yellow hover:bg-black/50"
                      >
                        {previewUrl ? (
                          <div className="space-y-2">
                            <img
                              src={previewUrl}
                              alt="Preview Bukti"
                              className="mx-auto max-h-32 rounded-lg object-contain"
                            />
                            <span className="block text-xs font-semibold text-arcade-yellow">
                              Ganti Gambar
                            </span>
                          </div>
                        ) : payment.proof_image ? (
                          <div className="space-y-2">
                            <div className="text-xs text-emerald-400">
                              ✓ Bukti sebelumnya telah terunggah
                            </div>
                            <span className="block text-xs font-semibold text-white/80">
                              Klik untuk mengunggah ulang bukti baru
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-2xl">📸</span>
                            <span className="block text-xs font-semibold text-white">
                              Pilih Foto Bukti Transfer
                            </span>
                            <span className="block text-[10px] text-white/50">
                              PNG, JPG, JPEG (Maks 5MB)
                            </span>
                          </div>
                        )}
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading || !selectedFile}
                      className="flex w-full min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "Mengunggah Bukti…" : "Kirim Bukti Pembayaran"}
                    </button>
                  </form>
                </div>

                <div className="mt-4 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={handleCancelPayment}
                      className="text-red-400 hover:underline"
                    >
                      Batalkan Pembayaran
                    </button>
                    <button
                      type="button"
                      onClick={loadData}
                      className="text-arcade-yellow hover:underline"
                    >
                      Refresh Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
