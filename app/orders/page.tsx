"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getOrders, type OrderData } from "@/lib/api/orders";
import { formatProductPrice } from "@/lib/utils";

type FilterTab =
  | "all"
  | "unpaid"
  | "verification"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled";

export default function OrdersPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const loadOrders = React.useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getOrders(token);
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/orders");
      } else {
        loadOrders();
      }
    }
  }, [isAuthenticated, isAuthLoading, loadOrders, router]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "unpaid") {
      return order.status !== "paid" && order.payment_status === "waiting_payment";
    }
    if (activeTab === "verification") {
      return order.payment_status === "waiting_verification";
    }
    if (activeTab === "paid") {
      return order.status === "paid";
    }
    if (activeTab === "processing") {
      return order.status === "processing";
    }
    if (activeTab === "completed") {
      return order.status === "completed";
    }
    if (activeTab === "cancelled") {
      return order.status === "cancelled";
    }
    return true;
  });

  const getStatusBadge = (order: OrderData) => {
    if (order.status === "paid") {
      return (
        <span className="rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-400 uppercase">
          Sudah Dibayar
        </span>
      );
    }
    if (order.status === "processing") {
      return (
        <span className="rounded-md border border-blue-400/40 bg-blue-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-300 uppercase">
          Sedang Diproses
        </span>
      );
    }
    if (order.status === "completed") {
      return (
        <span className="rounded-md border border-purple-400/40 bg-purple-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-purple-300 uppercase">
          Selesai
        </span>
      );
    }
    if (order.status === "cancelled") {
      return (
        <span className="rounded-md border border-red-400/40 bg-red-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-red-400 uppercase">
          Dibatalkan
        </span>
      );
    }
    if (order.payment_status === "waiting_verification") {
      return (
        <span className="rounded-md border border-blue-400/40 bg-blue-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-300 uppercase">
          Menunggu Verifikasi
        </span>
      );
    }
    return (
      <span className="rounded-md border border-amber-400/40 bg-amber-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-300 uppercase">
        Belum Dibayar
      </span>
    );
  };

  if (isAuthLoading || isLoading) {
    return (
      <main className="min-h-screen bg-[#11092a] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-arcade-yellow border-t-transparent"></div>
          <p className="mt-4 font-display text-sm tracking-wider text-arcade-yellow">
            Memuat Daftar Pesanan…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#11092a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-arcade-yellow">
              Pixel To Reality • Order History
            </span>
            <h1 className="mt-1 font-display text-2xl text-white sm:text-3xl">
              Daftar Pesanan Merchandise
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/payment"
              className="rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow"
            >
              Pembayaran QRIS
            </Link>
            <Link
              href="/receipts"
              className="rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 font-display text-xs font-bold text-white transition-colors hover:border-arcade-yellow hover:text-arcade-yellow"
            >
              Kumpulan Receipt
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-black/30 p-1.5">
            {[
              { id: "all", label: "Semua" },
              { id: "unpaid", label: "Belum Dibayar" },
              { id: "verification", label: "Menunggu Verifikasi" },
              { id: "paid", label: "Sudah Dibayar" },
              { id: "processing", label: "Diproses" },
              { id: "completed", label: "Selesai" },
              { id: "cancelled", label: "Dibatalkan" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 font-display text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-arcade-yellow text-arcade-ink shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order List Cards */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a0e3b] p-10 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-arcade-yellow/30 bg-arcade-yellow/10 text-2xl text-arcade-yellow">
              📦
            </div>
            <h3 className="font-display text-lg text-white">
              Belum Ada Pesanan
            </h3>
            <p className="mt-2 text-xs text-white/60">
              Tidak ada transaksi pesanan yang sesuai dengan filter yang dipilih.
            </p>
            <div className="mt-6">
              <Link
                href="/merchandise"
                className="inline-block rounded-xl bg-arcade-yellow px-5 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-md transition-transform hover:-translate-y-0.5"
              >
                Buka Katalog Merchandise
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-white/15 bg-[#180e3d] p-5 shadow-lg transition-all hover:border-arcade-yellow/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-arcade-yellow">
                      {order.order_code}
                    </span>
                    {getStatusBadge(order)}
                  </div>
                  <span className="text-xs text-white/50">
                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="my-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs text-white/70">
                      {order.total_items} Item ({order.total_quantity} pcs)
                    </span>
                    <ul className="mt-1 space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <li key={item.id} className="text-xs text-white/90">
                          • {item.quantity}x {item.product_name}
                        </li>
                      ))}
                      {order.items.length > 2 && (
                        <li className="text-[11px] text-arcade-yellow">
                          +{order.items.length - 2} item lainnya…
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-white/60">Total Pesanan:</span>
                    <div className="font-mono text-lg font-bold text-arcade-yellow">
                      {formatProductPrice(order.grand_total)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <div className="text-xs text-white/60">
                    {order.customer_name && (
                      <span>Pemesan: {order.customer_name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 font-display text-xs font-bold text-white transition-colors hover:bg-white/10"
                    >
                      Detail Pesanan
                    </button>
                    {order.status === "paid" && (
                      <Link
                        href="/receipts"
                        className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-3 py-1.5 font-display text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/30"
                      >
                        Lihat Receipt
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#1a0e3b] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-arcade-yellow">
                    {selectedOrder.order_code}
                  </span>
                  <h3 className="font-display text-lg text-white">
                    Detail Pesanan
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/30 text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="my-4 max-h-80 overflow-y-auto space-y-3 pr-1 text-xs">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="flex justify-between py-1">
                    <span className="text-white/60">Nama Pemesan:</span>
                    <span className="font-semibold text-white">{selectedOrder.customer_name || "-"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/60">Nomor Telepon:</span>
                    <span className="font-semibold text-white">{selectedOrder.customer_phone || "-"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/60">Status Pesanan:</span>
                    <span>{getStatusBadge(selectedOrder)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <span className="font-display text-xs font-bold text-arcade-yellow">
                    Daftar Produk
                  </span>
                  <ul className="mt-2 space-y-2">
                    {selectedOrder.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between border-b border-white/5 pb-1.5"
                      >
                        <div>
                          <span className="font-semibold text-white">
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="block text-[11px] text-white/50">
                            @{formatProductPrice(item.unit_price)}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-arcade-yellow">
                          {formatProductPrice(item.subtotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3">
                  <span className="font-display text-sm font-bold text-white">
                    Total Pembayaran
                  </span>
                  <span className="font-mono text-base font-bold text-arcade-yellow">
                    {formatProductPrice(selectedOrder.grand_total)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 font-display text-xs font-bold text-white hover:bg-white/10"
                >
                  Tutup
                </button>
                {selectedOrder.status === "paid" && (
                  <Link
                    href="/receipts"
                    className="rounded-xl bg-arcade-yellow px-4 py-2 font-display text-xs font-bold text-arcade-ink shadow-md"
                  >
                    Buka Receipt Resmi
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
