"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";

type ChatAdminModalProps = {
  onClose: () => void;
};

export default function ChatAdminModal({ onClose }: ChatAdminModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const { isAuthenticated, user } = useAuth();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Informasi Helpdesk & Bantuan Pameran"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-body"
    >
      <div className="relative w-full max-w-xl bg-[#5b2be6]/95 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-white/95 px-6 py-4 flex justify-between items-center border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-arcade-violet text-arcade-yellow font-display font-bold text-lg">
              CS
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            </div>
            <div>
              <h3 className="text-arcade-ink font-display font-bold text-lg leading-tight">
                Helpdesk Pameran P2R
              </h3>
              <p className="text-xs font-semibold text-arcade-ink/70">
                Customer Service & Informasi Booth
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup helpdesk"
            className="text-arcade-ink/80 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-black/5 cursor-pointer font-mono font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-5">
          {/* Greeting */}
          <div className="bg-white/10 rounded-2xl border border-white/15 p-4">
            <p className="text-white font-semibold leading-relaxed text-sm">
              Halo{isAuthenticated && user?.name ? `, ${user.name}` : ""}! Selamat datang di pameran{" "}
              <span className="text-arcade-yellow font-display">Pixel To Reality: The Cyber Arcade</span>.
              Butuh bantuan? Temui panitia kami langsung di booth pameran.
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="rounded-xl border border-white/20 bg-black/20 p-4 flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">📍</span>
              <div>
                <div className="font-display text-xs uppercase tracking-wider text-arcade-yellow mb-0.5">
                  Booth Panitia & Helpdesk
                </div>
                <p className="text-white/90 text-sm font-medium">
                  Kunjungi booth CS Panitia di area pameran untuk pertanyaan seputar merchandise, voting karya, informasi jadwal, dan bantuan teknis.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-black/20 p-4 flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">📧</span>
              <div>
                <div className="font-display text-xs uppercase tracking-wider text-arcade-yellow mb-0.5">
                  Kontak Email Resmi Panitia
                </div>
                <a
                  href="mailto:rpl@smkn4bdg.sch.id"
                  className="text-arcade-yellow font-display text-sm font-bold hover:underline"
                >
                  rpl@smkn4bdg.sch.id
                </a>
                <p className="text-white/70 text-xs mt-0.5">
                  Untuk pertanyaan di luar jam pameran
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-black/20 p-4 flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">🎮</span>
              <div>
                <div className="font-display text-xs uppercase tracking-wider text-arcade-yellow mb-0.5">
                  Pertanyaan Seputar Game
                </div>
                <p className="text-white/90 text-sm font-medium">
                  Untuk bantuan teknis game arcade, temui tim developer game di booth masing-masing atau tanyakan kepada panitia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/15 bg-black/20">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-arcade-yellow text-arcade-ink font-display font-bold text-sm py-2.5 rounded-xl hover:bg-yellow-300 transition-colors active:scale-95 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
