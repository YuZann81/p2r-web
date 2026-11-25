"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth/auth-context";
import {
  fetchPlayerProfileData,
  type PlayerProfileData,
} from "@/lib/api/player";

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ProfileFetchState = {
  token: string;
  data: PlayerProfileData | null;
  error: string | null;
};

export default function ProfilePage() {
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [profileState, setProfileState] = useState<ProfileFetchState | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    let active = true;

    fetchPlayerProfileData(token)
      .then((data) => {
        if (active) {
          setProfileState({ token, data, error: null });
        }
      })
      .catch(() => {
        if (active) {
          setProfileState({
            token,
            data: null,
            error: "Gagal memuat data profil dari server. Silakan coba lagi.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, token]);

  const hasCurrentProfile = Boolean(
    isAuthenticated && token && profileState?.token === token,
  );
  const profileData = hasCurrentProfile ? profileState?.data ?? null : null;
  const error = hasCurrentProfile ? profileState?.error ?? null : null;
  const isLoading = Boolean(isAuthenticated && token && !hasCurrentProfile);

  const activeUser = profileData?.user ?? user;

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-display text-sm tracking-wider text-[#68D5E8] transition-colors hover:text-[#FFD447]"
              >
                ← Kembali ke Beranda
              </Link>
              <h1
                className="mt-2 font-display text-4xl text-[#FFD447] sm:text-5xl select-none"
                style={{
                  textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
                }}
              >
                PROFIL PEMAIN
              </h1>
            </div>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => logout()}
                className="min-h-11 self-start sm:self-auto rounded-xl border border-white/25 bg-[#171224] px-5 py-2 font-display text-sm font-bold text-[#FFF5E9] transition-colors hover:border-[#FFD447] hover:text-[#FFD447] cursor-pointer"
              >
                Keluar dari Akun
              </button>
            )}
          </header>

          {/* Loading Auth State */}
          {authLoading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-[#39265E] bg-[#171224] p-12 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFD447]/30 border-t-[#FFD447]" />
              <p className="mt-4 font-display text-base tracking-wider text-[#FFD447]">
                Memeriksa sesi akun...
              </p>
            </div>
          ) : !isAuthenticated ? (
            /* Unauthenticated Gate */
            <section className="mx-auto max-w-lg rounded-3xl border-2 border-[#39265E] bg-[#171224] p-8 text-center shadow-[6px_6px_0_#0E0A1A] sm:p-10">
              <span className="inline-block rounded-lg bg-[#68D5E8]/15 px-3.5 py-1 font-display text-xs tracking-wider uppercase text-[#68D5E8]">
                Akses Pemain P2R
              </span>
              <h2 className="mt-3 font-display text-3xl text-[#FFD447]">
                Masuk untuk Melihat Profil
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#FFF5E9]/80">
                Masuk menggunakan akun peserta yang diberikan panitia untuk melihat saldo koin P2R, statistik skor per game, peringkat leaderboard, serta riwayat penukaran merchandise.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/login?redirect=/profile"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#FFD447] px-7 py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[4px_4px_0_#B8960A] transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  Masuk ke Akun
                </Link>
                <Link
                  href="/games"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-[#39265E] bg-[#211B35] px-6 py-2.5 font-display text-base text-[#FFF5E9] transition-colors hover:border-[#68D5E8] hover:text-[#68D5E8]"
                >
                  Jelajahi Game
                </Link>
              </div>
            </section>
          ) : (
            <div className="space-y-8">
              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-500/50 bg-red-500/15 p-4 text-sm text-red-200"
                >
                  {error}
                </div>
              )}

              {/* 1. Identity Card */}
              <section
                aria-label="Identitas Pemain"
                className="rounded-3xl border-2 border-[#39265E] bg-[#171224] p-6 shadow-[6px_6px_0_#0E0A1A] sm:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#FFD447] bg-[#211B35] font-display text-3xl font-bold text-[#FFD447] shadow-[3px_3px_0_#0E0A1A]">
                      {(activeUser?.name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-2xl sm:text-3xl text-[#FFF5E9]">
                        {activeUser?.name || "Pemain P2R"}
                      </h2>
                      <p className="truncate font-body text-sm text-[#B7ABCE]">
                        {activeUser?.email}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeUser?.role && (
                          <span className="rounded-md bg-[#68D5E8]/15 px-2.5 py-0.5 font-display text-xs uppercase tracking-wider text-[#68D5E8]">
                            {activeUser.role}
                          </span>
                        )}
                        {activeUser?.class_grade && (
                          <span className="rounded-md bg-[#211B35] border border-[#39265E] px-2.5 py-0.5 font-body text-xs text-[#FFF5E9]/85">
                            Kelas {activeUser.class_grade}
                          </span>
                        )}
                        {activeUser?.major && (
                          <span className="rounded-md bg-[#211B35] border border-[#39265E] px-2.5 py-0.5 font-body text-xs text-[#FFF5E9]/85">
                            {activeUser.major}
                          </span>
                        )}
                        {activeUser?.created_at && (
                          <span className="rounded-md bg-[#211B35] border border-[#39265E] px-2.5 py-0.5 font-body text-xs text-[#B7ABCE]">
                            Bergabung {formatDate(activeUser.created_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Coin Balance Highlight */}
                  <div className="rounded-2xl border-2 border-[#FFD447]/60 bg-[#211B35] px-5 py-4 text-left sm:text-right">
                    <p className="font-display text-xs uppercase tracking-wider text-[#B7ABCE]">
                      Saldo Koin P2R
                    </p>
                    <p className="mt-1 font-display text-3xl font-bold text-[#FFD447]">
                      {isLoading
                        ? "..."
                        : `${(profileData?.coinBalance ?? 0).toLocaleString("id-ID")} Koin`}
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Gameplay Summary Stats */}
              <section aria-label="Ringkasan Statistik Permainan">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="rounded-2xl border-2 border-[#39265E] bg-[#171224] p-5 shadow-[4px_4px_0_#0E0A1A]">
                    <p className="font-display text-xs uppercase tracking-wider text-[#68D5E8]">
                      Game Tercatat
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold text-[#FFF5E9]">
                      {isLoading ? "—" : profileData?.summary.gamesRecorded ?? 0}
                    </p>
                    <p className="mt-1 font-body text-xs text-[#B7ABCE]">
                      dari {profileData?.activeLeaderboardGamesCount ?? 0} game ber-leaderboard
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-[#39265E] bg-[#171224] p-5 shadow-[4px_4px_0_#0E0A1A]">
                    <p className="font-display text-xs uppercase tracking-wider text-[#FFD447]">
                      Total Skor Terbaik
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold text-[#FFD447]">
                      {isLoading
                        ? "—"
                        : (profileData?.summary.totalAccumulatedScore ?? 0).toLocaleString("id-ID")}
                    </p>
                    <p className="mt-1 font-body text-xs text-[#B7ABCE]">
                      Akumulasi skor leaderboard
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-[#39265E] bg-[#171224] p-5 shadow-[4px_4px_0_#0E0A1A]">
                    <p className="font-display text-xs uppercase tracking-wider text-[#F276A5]">
                      Skor Tertinggi
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold text-[#FFF5E9]">
                      {isLoading
                        ? "—"
                        : profileData?.summary.bestScore !== null &&
                            profileData?.summary.bestScore !== undefined
                          ? profileData.summary.bestScore.toLocaleString("id-ID")
                          : "—"}
                    </p>
                    <p className="mt-1 font-body text-xs text-[#B7ABCE]">
                      Rekor pribadi tertinggi
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-[#39265E] bg-[#171224] p-5 shadow-[4px_4px_0_#0E0A1A]">
                    <p className="font-display text-xs uppercase tracking-wider text-[#7AC70C]">
                      Peringkat Terbaik
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold text-[#FFF5E9]">
                      {isLoading
                        ? "—"
                        : profileData?.summary.bestRank !== null &&
                            profileData?.summary.bestRank !== undefined
                          ? `#${profileData.summary.bestRank}`
                          : "—"}
                    </p>
                    <p className="mt-1 font-body text-xs text-[#B7ABCE]">
                      Posisi tertinggi di papan skor
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Game-by-Game Statistics & Ranked History */}
              <section
                aria-label="Statistik Per Game"
                className="overflow-hidden rounded-3xl border-2 border-[#39265E] bg-[#171224] shadow-[6px_6px_0_#0E0A1A]"
              >
                <div className="flex flex-col gap-2 border-b border-[#39265E] bg-[#211B35]/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl text-[#FFD447]">
                      STATISTIK &amp; SKOR PER GAME
                    </h2>
                    <p className="mt-0.5 font-body text-xs text-[#B7ABCE]">
                      Data langsung dari leaderboard resmi game aktif di API produksi.
                    </p>
                  </div>
                  <Link
                    href="/games"
                    className="font-display text-sm text-[#68D5E8] hover:text-[#FFD447] transition-colors"
                  >
                    Lihat Direktori Game →
                  </Link>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center font-display text-sm text-[#FFD447]">
                    Memuat statistik permainan...
                  </div>
                ) : profileData && profileData.gameRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-[#39265E] bg-[#211B35]/40 font-display text-sm uppercase tracking-wider text-[#68D5E8]">
                        <tr>
                          <th scope="col" className="px-6 py-3.5">Game</th>
                          <th scope="col" className="px-6 py-3.5 text-center">Peringkat</th>
                          <th scope="col" className="px-6 py-3.5 text-right">Skor Terbaik</th>
                          <th scope="col" className="px-6 py-3.5 text-right">Tanggal Tercatat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-body">
                        {profileData.gameRecords.map((record) => (
                          <tr
                            key={record.gameSlug}
                            className="transition-colors hover:bg-white/5"
                          >
                            <td className="px-6 py-4">
                              <Link
                                href={`/games/${record.gameSlug}`}
                                className="font-display text-base text-[#FFF5E9] hover:text-[#FFD447] transition-colors"
                              >
                                {record.gameTitle}
                              </Link>
                            </td>
                            <td className="px-6 py-4 text-center font-display font-bold text-[#68D5E8]">
                              {record.rank !== null ? `#${record.rank}` : "—"}
                              {record.totalPlayers > 0 && (
                                <span className="ml-1 font-body text-xs font-normal text-[#B7ABCE]">
                                  / {record.totalPlayers}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-display text-base font-bold text-[#FFD447]">
                              {record.score.toLocaleString("id-ID")} PTS
                            </td>
                            <td className="px-6 py-4 text-right text-xs text-[#B7ABCE]">
                              {formatDateTime(record.playedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-display text-lg text-[#FFD447]">
                      Belum Ada Skor Permainan Tercatat
                    </p>
                    <p className="mx-auto mt-2 max-w-md font-body text-sm text-[#FFF5E9]/75">
                      Mainkan game arcade di arena pameran menggunakan akun Anda agar skor dan peringkat tampil otomatis di sini.
                    </p>
                  </div>
                )}

                <div className="border-t border-[#39265E]/70 bg-[#0E0A1A]/50 px-6 py-3">
                  <p className="font-body text-xs text-[#B7ABCE]">
                    Catatan API: Riwayat sesi individual per permainan (jumlah total sesi &amp; skor non-terbaik) belum disediakan oleh endpoint publik API produksi saat ini.
                  </p>
                </div>
              </section>

              {/* 4. Wallet Transactions & Merchandise Redemptions */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Coin Transactions */}
                <section
                  aria-label="Riwayat Koin P2R"
                  className="rounded-3xl border-2 border-[#39265E] bg-[#171224] p-6 shadow-[6px_6px_0_#0E0A1A]"
                >
                  <h2 className="font-display text-xl text-[#FFD447]">
                    RIWAYAT KOIN P2R
                  </h2>
                  {isLoading ? (
                    <p className="mt-4 font-body text-sm text-[#B7ABCE]">
                      Memuat transaksi koin...
                    </p>
                  ) : profileData && profileData.walletTransactions.length > 0 ? (
                    <ul className="mt-4 divide-y divide-white/10">
                      {profileData.walletTransactions.slice(0, 10).map((tx) => (
                        <li
                          key={tx.id}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-body text-sm font-medium text-[#FFF5E9]">
                              {tx.description || tx.reason || tx.type}
                            </p>
                            <p className="font-body text-xs text-[#B7ABCE]">
                              {formatDateTime(tx.created_at)}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 font-display text-base font-bold ${
                              tx.amount >= 0 ? "text-[#7AC70C]" : "text-[#F276A5]"
                            }`}
                          >
                            {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} Koin
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 font-body text-sm text-[#B7ABCE]">
                      Belum ada transaksi koin yang tercatat.
                    </p>
                  )}
                </section>

                {/* Merchandise Redemptions */}
                <section
                  aria-label="Riwayat Penukaran Merchandise"
                  className="rounded-3xl border-2 border-[#39265E] bg-[#171224] p-6 shadow-[6px_6px_0_#0E0A1A]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-xl text-[#FFD447]">
                      PENUKARAN MERCHANDISE
                    </h2>
                    <Link
                      href="/merchandise"
                      className="font-display text-xs text-[#68D5E8] hover:text-[#FFD447]"
                    >
                      Lihat Katalog →
                    </Link>
                  </div>
                  {isLoading ? (
                    <p className="mt-4 font-body text-sm text-[#B7ABCE]">
                      Memuat riwayat penukaran...
                    </p>
                  ) : profileData && profileData.redemptions.length > 0 ? (
                    <ul className="mt-4 divide-y divide-white/10">
                      {profileData.redemptions.slice(0, 10).map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-body text-sm font-medium text-[#FFF5E9]">
                              {item.merchandise?.name || "Merchandise P2R"} × {item.quantity}
                            </p>
                            <p className="font-body text-xs text-[#B7ABCE]">
                              {formatDateTime(item.created_at)}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-md border border-[#68D5E8]/40 bg-[#68D5E8]/10 px-2.5 py-0.5 font-display text-xs uppercase text-[#68D5E8]">
                            {item.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 font-body text-sm text-[#B7ABCE]">
                      Belum ada riwayat penukaran merchandise.
                    </p>
                  )}
                </section>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
