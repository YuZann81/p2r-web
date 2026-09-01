"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<UserType>("siswa");
  const [classGrade, setClassGrade] = useState("XII (Kelas 12)");
  const [major, setMajor] = useState("RPL / PPLG");
  const [teacherRole, setTeacherRole] = useState("");

  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setUserType((user.user_type as UserType) || "siswa");
      setClassGrade(user.class_grade || "XII (Kelas 12)");
      setMajor(user.major || "RPL / PPLG");
      setTeacherRole(user.teacher_role || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setStatusMsg(null);
    setIsSaving(true);

    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        phone: phone.trim(),
        user_type: userType,
      };

      if (userType === "siswa") {
        payload.class_grade = classGrade;
        payload.major = major;
      } else if (userType === "guru") {
        payload.teacher_role = teacherRole.trim() || "Guru / Tenaga Pendidik";
      } else {
        payload.teacher_role = teacherRole.trim() || "Pengunjung Umum";
      }

      const res = await updateProfile(payload);
      if (res.success) {
        setStatusMsg({ type: "success", text: "Profil berhasil diperbarui!" });
      } else {
        setStatusMsg({ type: "error", text: res.message || "Gagal memperbarui profil." });
      }
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan profil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-arcade-ink font-display text-arcade-yellow">
        Memuat profil...
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[100dvh] flex-col justify-between overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <Navbar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 md:px-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider text-arcade-yellow sm:text-3xl [text-shadow:2px_2px_0_var(--arcade-ink)]">
              PROFIL SAYA
            </h1>
            <p className="text-xs text-white/70 sm:text-sm">
              Kelola data identitas dan kontak untuk pesanan merchandise dan sertifikat.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/30 px-3.5 py-2 text-xs font-bold text-arcade-yellow transition-colors hover:border-arcade-yellow hover:bg-black/50 self-start sm:self-auto"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Buka P2R Shop
          </Link>
        </div>

        {statusMsg && (
          <div
            className={`mb-6 rounded-xl border p-4 text-xs font-bold ${
              statusMsg.type === "success"
                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-200"
                : "border-red-500/50 bg-red-500/20 text-red-200"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* User Overview Card */}
          <div className="rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-arcade-yellow font-display text-2xl font-bold text-arcade-ink shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h2 className="mt-3 font-display text-base font-bold text-white">
                {user?.name || "Pengguna"}
              </h2>
              <p className="text-xs font-mono text-white/60">{user?.email}</p>

              <span className="mt-3 inline-block rounded-full bg-arcade-yellow/20 px-3 py-1 font-display text-[11px] font-bold tracking-wider uppercase text-arcade-yellow border border-arcade-yellow/30">
                {user?.user_type === "guru" ? "Guru / Pendidik" : user?.user_type === "umum" ? "Umum" : "Siswa"}
              </span>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Nomor HP:</span>
                <span className="font-mono text-white">{user?.phone || "—"}</span>
              </div>
              {user?.user_type === "siswa" && (
                <>
                  <div className="flex justify-between text-white/70">
                    <span>Kelas:</span>
                    <span className="text-white">{user?.class_grade || "—"}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Jurusan:</span>
                    <span className="text-white truncate max-w-[140px]" title={user?.major || ""}>
                      {user?.major || "—"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2 rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-md sm:p-8">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow"
                />
              </div>

              <div>
                <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow">
                  Email (Akun)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow">
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow"
                />
              </div>

              <div>
                <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow mb-1.5">
                  Tipe Identitas
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

              {userType === "siswa" && (
                <>
                  <div>
                    <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow">
                      Tingkat Kelas
                    </label>
                    <select
                      value={classGrade}
                      onChange={(e) => setClassGrade(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/80 px-3 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g} className="bg-arcade-ink text-white">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow">
                      Jurusan
                    </label>
                    <select
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/80 px-3 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow"
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

              {userType === "guru" && (
                <div>
                  <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow">
                    Jabatan / Peran Pengajar
                  </label>
                  <input
                    type="text"
                    value={teacherRole}
                    onChange={(e) => setTeacherRole(e.target.value)}
                    placeholder="Contoh: Guru Kejuruan RPL"
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow"
                  />
                </div>
              )}

              {userType === "umum" && (
                <div>
                  <label className="block font-display text-xs tracking-wider uppercase text-arcade-yellow">
                    Instansi / Keterangan
                  </label>
                  <input
                    type="text"
                    value={teacherRole}
                    onChange={(e) => setTeacherRole(e.target.value)}
                    placeholder="Contoh: Universitas / Pengunjung Umum"
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-arcade-yellow"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-arcade-yellow py-3 font-display text-base font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan Profil"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
