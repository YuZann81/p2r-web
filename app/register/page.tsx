"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";
  const action = searchParams.get("action");
  const productId = searchParams.get("productId");
  const slug = searchParams.get("slug");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDestinationUrl = React.useCallback(() => {
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
  }, [action, productId, slug, redirectUrl]);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(getDestinationUrl());
    }
  }, [isAuthenticated, router, getDestinationUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Silakan lengkapi seluruh kolom formulir pendaftaran.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        router.push(getDestinationUrl());
      } else {
        setErrorMessage(
          result.message || "Pendaftaran akun tidak dapat diproses. Silakan coba lagi.",
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Terjadi gangguan saat menghubungkan ke server. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginQuery = new URLSearchParams();
  if (redirectUrl !== "/") loginQuery.set("redirect", redirectUrl);
  if (action) loginQuery.set("action", action);
  if (productId) loginQuery.set("productId", productId);
  if (slug) loginQuery.set("slug", slug);
  const loginHref = `/login${loginQuery.toString() ? `?${loginQuery.toString()}` : ""}`;

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/20 bg-black/40 p-8 shadow-2xl backdrop-blur-md sm:p-10">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-arcade-yellow/20 px-4 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow">
          Registrasi Akun Baru
        </span>
        <h1 className="mt-3 font-display text-3xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-4xl">
          DAFTAR AKUN
        </h1>
        <p className="mt-2 text-xs font-semibold text-white/80 sm:text-sm">
          Buat akun untuk memesan merchandise dan ikut voting karya pameran Pixel To Reality.
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
            htmlFor="name"
            className="block font-display text-sm tracking-wider uppercase text-arcade-yellow"
          >
            Nama Lengkap *
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap Anda"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-display text-sm tracking-wider uppercase text-arcade-yellow"
          >
            Email *
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
            Kata Sandi *
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 pr-12 text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/60 hover:text-arcade-yellow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow rounded-lg cursor-pointer"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex w-full items-center justify-center bg-arcade-yellow py-3.5 font-display text-lg font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 cursor-pointer"
        >
          {isSubmitting ? "Mendaftarkan..." : "Buat Akun Sekarang →"}
        </button>
      </form>

      <div className="mt-8 text-center text-xs font-semibold text-white/70 sm:text-sm">
        Sudah memiliki akun?{" "}
        <Link
          href={loginHref}
          className="font-display tracking-wider text-arcade-yellow underline transition-opacity hover:opacity-80"
        >
          Masuk di Sini
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
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
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow rounded-lg px-2 py-1"
          >
            ← Kembali ke Beranda
          </Link>
        </header>

        <Suspense
          fallback={
            <div className="p-10 font-display text-lg text-arcade-yellow">
              Memuat form registrasi...
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
