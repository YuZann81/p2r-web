"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";

export type DialogVariant =
  | "success"
  | "error"
  | "warning"
  | "confirmation"
  | "info";

export interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: React.ReactNode;
  variant?: DialogVariant;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "warning";
  isLoading?: boolean;
}

export function CustomDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = "info",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  confirmVariant = "primary",
  isLoading = false,
}: CustomDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape key & trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    cancelBtnRef.current?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="size-6 text-emerald-400" />;
      case "error":
        return <XCircle className="size-6 text-rose-400" />;
      case "warning":
      case "confirmation":
        return <AlertTriangle className="size-6 text-amber-400" />;
      case "info":
      default:
        return <Info className="size-6 text-arcade-yellow" />;
    }
  };

  const getConfirmBtnClass = () => {
    switch (confirmVariant) {
      case "danger":
        return "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40";
      case "warning":
        return "bg-amber-500 hover:bg-amber-400 text-arcade-ink shadow-amber-900/40";
      case "primary":
      default:
        return "bg-arcade-yellow hover:bg-yellow-300 text-arcade-ink shadow-yellow-900/40";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="p2r-dialog-title"
      aria-describedby="p2r-dialog-desc"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150 font-body"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-md bg-[#1d1633] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col gap-4 text-white"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-arcade-violet via-arcade-yellow to-arcade-violet opacity-80" />

        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-2xl bg-white/10 shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="p2r-dialog-title"
              className="text-lg font-display font-bold text-white tracking-wide leading-snug"
            >
              {title}
            </h3>
            <div
              id="p2r-dialog-desc"
              className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed"
            >
              {description}
            </div>
          </div>
          {!isLoading && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup dialog"
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-white/10">
          <button
            ref={cancelBtnRef}
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/15 text-white/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>

          {onConfirm && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-4 py-2 text-xs sm:text-sm font-display font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer ${getConfirmBtnClass()}`}
            >
              {isLoading && (
                <span className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
