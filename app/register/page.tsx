"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import type { UserType } from "@/lib/api/types/auth";

const MAJORS = [
  { value: "Teknik Mesin", label: "Teknik Mesin" },
  { value: "Teknik Otomotif", label: "Teknik Otomotif" },
  { value: "Teknik Elektronika", label: "Teknik Elektronika" },
  { value: "Mekatronika", label: "Mekatronika" },
  { value: "RPL / PPLG", label: "RPL / PPLG" },
  { value: "Broadcasting & Perfilman (BP)", label: "Broadcasting & Perfilman (BP)" },
  { value: "TKJ", label: "TKJ" },
  { value: "Teknik Tekstil", label: "Teknik Tekstil" },
];

const GRADES = ["X (Kelas 10)", "XI (Kelas 11)", "XII (Kelas 12)"];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, updateProfile, isAuthenticated, user } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";
  const action = searchParams.get("action");
  const productId = searchParams.get("productId");
  const slug = searchParams.get("slug");

  // Step 1 state
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 state
  const [userType, setUserType] = useState<UserType>("siswa");
  const [phone, setPhone] = useState("");
  const [classGrade, setClassGrade] = useState("XII (Kelas 12)");
  const [major, setMajor] = useState("Rekayasa Perangkat Lunak (RPL)");
  const [teacherRole, setTeacherRole] = useState("");
  const [generalAffiliation, setGeneralAffiliation] = useState("");

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

  // If already authenticated and already has profile completed, go to destination
  React.useEffect(() => {
    if (isAuthenticated && step === 1 && user?.user_type) {
      router.replace(getDestinationUrl());
    }
  }, [isAuthenticated, step, user, router, getDestinationUrl]);

  // Handle Step 1 Submit (Account Creation)
  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Silakan lengkapi nama, email, dan kata sandi.");
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
        // Proceed smoothly to Step 2
        setStep(2);
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

  // Handle Step 2 Submit (Profile Completion)
  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = {
        user_type: userType,
      };

      if (phone.trim()) {
        payload.phone = phone.trim();
      }

      if (userType === "siswa") {
        payload.class_grade = classGrade;
        payload.major = major;
      } else if (userType === "guru") {
        payload.teacher_role = teacherRole.trim() || "Guru / Tenaga Pendidik";
      } else {
        payload.teacher_role = generalAffiliation.trim() || "Pengunjung Umum";
      }

      await updateProfile(payload);

      // Finish and redirect to destination
      router.push(getDestinationUrl());
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Gagal menyimpan data profil.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipProfile = () => {
    router.push(getDestinationUrl());
  };

  const loginQuery = new URLSearchParams();
  if (redirectUrl !== "/") loginQuery.set("redirect", redirectUrl);
  if (action) loginQuery.set("action", action);
  if (productId) loginQuery.set("productId", productId);
  if (slug) loginQuery.set("slug", slug);
  const loginHref = `/login${loginQuery.toString() ? `?${loginQuery.toString()}` : ""}`;

  return (
    <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-black/40 p-6 shadow-2xl backdrop-blur-md sm:p-10">
      {/* Stepper Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-display text-xs font-bold ${
              step === 1
                ? "bg-arcade-yellow text-arcade-ink"
                : "bg-white/20 text-white"
            }`}
          >
            1
          </span>
          <div className="h-0.5 w-8 bg-white/20" />
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-display text-xs font-bold ${
              step === 2
                ? "bg-arcade-yellow text-arcade-ink"
                : "bg-white/20 text-white"
            }`}
          >
            2
          </span>
        </div>

        <span className="inline-block rounded-full bg-arcade-yellow/20 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-arcade-yellow">
          {step === 1 ? "Tahap 1: Akun Pengguna" : "Tahap 2: Lengkapi Profil"}
        </span>

        <h1 className="mt-2 font-display text-2xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-3xl">
          {step === 1 ? "DAFTAR AKUN" : "PROFIL PENGGUNA"}
        </h1>
        <p className="mt-1 text-xs text-white/80 sm:text-sm">
          {step === 1
            ? "Masukkan nama dan email untuk membuat akun baru."
            : "Lengkapi data untuk kemudahan pemesanan & voting karya."}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-500/50 bg-red-500/20 p-3.5 text-center text-xs font-semibold text-red-200 backdrop-blur-xs"
        >
          {errorMessage}
        </div>
      )}

      {/* STEP 1: ACCOUNT DETAILS */}
      {step === 1 ? (
        <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
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
              placeholder="Contoh: Razzan Gianni"
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
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
              className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
            >
              Kata Sandi *
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 pr-11 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-white/60 hover:text-arcade-yellow transition-colors focus-visible:outline-none rounded-lg cursor-pointer"
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-arcade-yellow py-3 font-display text-base font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Memproses..." : "Lanjut ke Profil →"}
          </button>

          <div className="mt-4 text-center text-xs font-semibold text-white/70">
            Sudah memiliki akun?{" "}
            <Link
              href={loginHref}
              className="font-display tracking-wider text-arcade-yellow underline hover:opacity-80"
            >
              Masuk di Sini
            </Link>
          </div>
        </form>
      ) : (
        /* STEP 2: PROFILE COMPLETION */
        <form onSubmit={handleStep2Submit} className="flex flex-col gap-4">
          {/* Account Type Selector */}
          <div>
            <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow mb-2">
              Tipe Identitas *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["siswa", "guru", "umum"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    userType === type
                      ? "border-arcade-yellow bg-arcade-yellow text-arcade-ink shadow-sm"
                      : "border-white/20 bg-black/40 text-white/80 hover:border-white/40"
                  }`}
                >
                  {type === "siswa" ? "Siswa" : type === "guru" ? "Guru / Staf" : "Umum"}
                </button>
              ))}
            </div>
          </div>

          {/* Nomor WhatsApp / Telepon */}
          <div>
            <label
              htmlFor="phone"
              className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
            >
              Nomor WhatsApp / Telepon *
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 08123456789"
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
            />
          </div>

          {/* SISWA SPECIFIC FIELDS */}
          {userType === "siswa" && (
            <>
              <div>
                <label
                  htmlFor="classGrade"
                  className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
                >
                  Tingkat Kelas *
                </label>
                <select
                  id="classGrade"
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  disabled={isSubmitting}
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/80 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g} className="bg-arcade-ink text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="major"
                  className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
                >
                  Kompetensi Keahlian (Jurusan) *
                </label>
                <select
                  id="major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  disabled={isSubmitting}
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/80 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
                >
                  {MAJORS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-arcade-ink text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* GURU SPECIFIC FIELDS */}
          {userType === "guru" && (
            <div>
              <label
                htmlFor="teacherRole"
                className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
              >
                Jabatan / Peran Pengajar *
              </label>
              <input
                id="teacherRole"
                type="text"
                value={teacherRole}
                onChange={(e) => setTeacherRole(e.target.value)}
                placeholder="Contoh: Guru Kejuruan RPL / Wali Kelas X"
                disabled={isSubmitting}
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
              />
            </div>
          )}

          {/* UMUM SPECIFIC FIELDS */}
          {userType === "umum" && (
            <div>
              <label
                htmlFor="generalAffiliation"
                className="block font-display text-xs tracking-wider uppercase text-arcade-yellow"
              >
                Instansi / Asal Komunitas (Opsional)
              </label>
              <input
                id="generalAffiliation"
                type="text"
                value={generalAffiliation}
                onChange={(e) => setGeneralAffiliation(e.target.value)}
                placeholder="Contoh: Universitas / Pengunjung Umum"
                disabled={isSubmitting}
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50 disabled:opacity-50"
              />
            </div>
          )}

          <div className="mt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-arcade-yellow py-3 font-display text-base font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Menyimpan Profil..." : "Selesaikan Pendaftaran"}
            </button>

            <button
              type="button"
              onClick={handleSkipProfile}
              className="py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Lewati & Lengkapi Nanti →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main
      className="flex min-h-[100dvh] flex-col items-center justify-between px-4 py-8 sm:px-6 md:px-12 md:py-16 overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-6 text-center">
          <Link
            href="/"
            className="inline-block font-display text-xs uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow rounded-lg px-2 py-1"
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

      <footer className="mt-8 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
