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

  // Compute final destination after login
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

  // If already authenticated, redirect immediately
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
    <div className="w-full max-w-md rounded-3xl border border-white/20 bg-black/40 p-8 shadow-2xl backdrop-blur-md sm:p-10">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow">
          {action === "vote"
            ? "Otentikasi Voting Karya"
            : action === "order"
              ? "Otentikasi Pemesanan"
              : "Cyber Arcade Access"}
        </span>
        <h1 className="mt-3 font-display text-3xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-4xl">
          MASUK AKUN
        </h1>
        <p className="mt-2 text-xs font-semibold text-white/80 sm:text-sm">
          {action === "vote"
            ? "Masuk untuk memberikan vote pada karya inovasi favoritmu."
            : action === "order"
              ? "Masuk untuk melanjutkan pemesanan merchandise pilihanmu."
              : "Masuk untuk mengakses fitur voting dan pemesanan merchandise."}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-sm font-semibold text-red-200 backdrop-blur-xs"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="email"
            className="block font-display text-sm tracking-wider uppercase text-arcade-yellow"
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
            className="mt-2 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-display text-sm tracking-wider uppercase text-arcade-yellow"
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
            className="mt-2 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex w-full items-center justify-center bg-arcade-yellow py-3.5 font-display text-lg font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
        >
          {isSubmitting ? "Memproses..." : "Masuk ke Akun →"}
        </button>
      </form>

      <div className="mt-8 text-center text-xs font-semibold text-white/70 sm:text-sm">
        Belum punya akun?{" "}
        <Link
          href={registerHref}
          className="font-display tracking-wider text-arcade-yellow underline transition-opacity hover:opacity-80"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
        </header>

        <Suspense
          fallback={
            <div className="p-10 font-display text-lg text-arcade-yellow">
              Memuat form login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
