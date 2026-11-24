"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";
  const action = searchParams.get("action");
  const productId = searchParams.get("productId");
  const slug = searchParams.get("slug");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDestinationUrl = () => {
    const params = new URLSearchParams();
    if (action) params.set("action", action);
    if (productId) params.set("productId", productId);
    if (slug) params.set("slug", slug);

    const queryString = params.toString();
    if (queryString) {
      const separator = redirectUrl.includes("?") ? "&" : "?";
      return `${redirectUrl}${separator}${queryString}`;
    }
    return redirectUrl;
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(getDestinationUrl());
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Silakan masukkan email dan kata sandi Anda.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({ email: email.trim(), password });
      if (result.success) {
        router.push(getDestinationUrl());
      } else {
        setErrorMessage(result.message || "Email atau kata sandi tidak valid.");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan pada server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerQuery = new URLSearchParams();
  if (redirectUrl !== "/") registerQuery.set("redirect", redirectUrl);
  if (action) registerQuery.set("action", action);
  if (productId) registerQuery.set("productId", productId);
  if (slug) registerQuery.set("slug", slug);
  const registerHref = `/register${registerQuery.toString() ? `?${registerQuery.toString()}` : ""}`;

  return (
    <div className="w-full max-w-md rounded-3xl border-2 border-[#39265E] bg-[#171224] p-8 shadow-[8px_8px_0_#0E0A1A] sm:p-10">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-lg bg-[#FFD447]/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-[#FFD447]">
          {action === "vote"
            ? "Otentikasi Voting Karya"
            : action === "order"
              ? "Otentikasi Pemesanan"
              : "Cyber Arcade Access"}
        </span>
        <h1 className="mt-3 font-display text-3xl text-[#FFD447] sm:text-4xl drop-shadow-[2px_2px_0_#0E0A1A]">
          MASUK AKUN
        </h1>
        <p className="mt-2 font-body text-xs text-[#FFF5E9]/80 sm:text-sm">
          {action === "vote"
            ? "Masuk untuk memberikan vote pada karya inovasi favoritmu."
            : action === "order"
              ? "Masuk untuk melanjutkan pemesanan merchandise pilihanmu."
              : "Masuk untuk mengakses fitur voting dan pemesanan merchandise pameran."}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center font-body text-sm text-red-200"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="email"
            className="block font-display text-sm tracking-wider uppercase text-[#FFD447]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl border border-white/20 bg-[#211B35] px-4 py-3 font-body text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#68D5E8] focus:ring-2 focus:ring-[#68D5E8]/30 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-display text-sm tracking-wider uppercase text-[#FFD447]"
          >
            Kata Sandi
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl border border-white/20 bg-[#211B35] px-4 py-3 font-body text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#68D5E8] focus:ring-2 focus:ring-[#68D5E8]/30 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#FFD447] py-3.5 font-display text-lg font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:bg-[#FFE500] hover:shadow-[5px_5px_0_#B8960A] active:translate-y-0.5 active:shadow-[2px_2px_0_#B8960A] disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {isSubmitting ? "Memproses..." : "Masuk ke Akun"}
        </button>
      </form>

      <div className="mt-8 text-center font-body text-xs text-[#FFF5E9]/70 sm:text-sm">
        Belum punya akun?{" "}
        <Link
          href={registerHref}
          className="font-display tracking-wider text-[#68D5E8] underline hover:text-[#FFD447] transition-colors"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#211B35] px-4 py-12 text-[#FFF5E9] sm:px-6 md:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-display text-sm tracking-wider text-[#68D5E8] transition-colors hover:text-[#FFD447] md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
        </header>

        <Suspense
          fallback={
            <div className="p-10 font-display text-lg text-[#FFD447]">
              Memuat form login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-[#FFF5E9]/50">
        Pixel To Reality: The Cyber Arcade &bull; Rekayasa Perangkat Lunak
      </footer>
    </main>
  );
}
