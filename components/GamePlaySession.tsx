"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  createGameSession,
  submitScore,
  type ScoreResult,
} from "@/lib/api/scores";
import { useAuth } from "@/lib/auth/auth-context";

type GamePlaySessionProps = {
  gameSlug: string;
  gameTitle: string;
};

const CHALLENGE_TEXT = "PIXEL TO REALITY CYBER ARCADE 2026";

export default function GamePlaySession({
  gameSlug,
  gameTitle,
}: GamePlaySessionProps) {
  const { user, token } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState(user?.name || "");
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [submittedScore, setSubmittedScore] = useState<ScoreResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name && !playerName) {
      setPlayerName(user.name);
    }
  }, [user, playerName]);

  const handleStartGame = async () => {
    setIsStartingSession(true);
    setErrorMessage(null);
    setCalculatedScore(null);
    setSubmittedScore(null);
    setTypedText("");
    setSessionToken(null);

    try {
      const sessionRes = await createGameSession(gameSlug, token);

      if (!sessionRes.data?.session_token) {
        setErrorMessage(
          sessionRes.message || "Gagal membuat sesi permainan. Silakan coba lagi.",
        );
        return;
      }

      setSessionToken(sessionRes.data.session_token);
      setIsPlaying(true);
      setStartTime(Date.now());
    } catch (err) {
      console.error("Failed to create game session:", err);
      setErrorMessage(
        "Gagal memulai sesi arcade. Pastikan koneksi internet stabil lalu coba lagi.",
      );
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedText(val);

    if (val.trim().toUpperCase() === CHALLENGE_TEXT) {
      const elapsedSeconds = Math.max(
        1,
        (Date.now() - (startTime || Date.now())) / 1000,
      );
      const score = Math.max(10, Math.round(500 - elapsedSeconds * 20));
      setCalculatedScore(score);
      setIsPlaying(false);
    }
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatedScore || isSubmitting) return;

    if (!sessionToken) {
      setErrorMessage(
        "Sesi permainan tidak valid atau sudah kedaluwarsa. Silakan mulai main lagi.",
      );
      return;
    }

    const trimmedName = playerName.trim() || "Arcade Player";
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitScore(
        gameSlug,
        {
          session_token: sessionToken,
          player_name: trimmedName,
          final_score: calculatedScore,
          platform: "web",
          meta: {
            challenge: "speed_typing",
            game_title: gameTitle,
          },
        },
        token,
      );

      if (res.data) {
        setSubmittedScore(res.data);
        setSessionToken(null);
      } else {
        setErrorMessage(
          res.message || "Gagal mencatat skor ke leaderboard. Silakan coba lagi.",
        );
      }
    } catch (err) {
      console.error("Failed to submit score:", err);
      setErrorMessage(
        "Terjadi kendala saat mengirim skor. Pastikan sesi masih berlaku dan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-label="Arcade Game Station"
      className="mt-8 rounded-2xl border-2 border-arcade-yellow/40 bg-[#160b33] p-6 shadow-xl sm:p-8"
    >
      <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row">
        <div>
          <span className="inline-block rounded-md border border-arcade-yellow/50 bg-arcade-yellow/15 px-3 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-arcade-yellow">
            ARCADE STATION INTERAKTIF
          </span>
          <h2 className="mt-1 font-display text-2xl text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-3xl">
            Tantangan Skor: {gameTitle}
          </h2>
        </div>

        {!isPlaying && !calculatedScore && (
          <button
            type="button"
            onClick={handleStartGame}
            disabled={isStartingSession}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-base font-bold text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60 cursor-pointer"
          >
            {isStartingSession ? "Menyiapkan Sesi..." : "Mulai Main Arcade!"}
          </button>
        )}
      </div>

      {/* Startup error if session creation failed before play */}
      {!isPlaying && !calculatedScore && errorMessage && (
        <p className="mt-4 text-center text-sm font-semibold text-red-300" role="alert">
          {errorMessage}
        </p>
      )}

      {/* Game State: In Progress */}
      {isPlaying && (
        <div className="mt-6 flex flex-col items-center text-center">
          <p className="font-display text-sm uppercase tracking-wider text-white/80">
            Ketik kalimat target di bawah secepat mungkin:
          </p>
          <div className="mt-3 rounded-xl border border-arcade-yellow/40 bg-black/60 px-5 py-3 font-mono text-lg font-bold text-arcade-yellow sm:text-xl tracking-wider">
            {CHALLENGE_TEXT}
          </div>

          <div className="mt-5 w-full max-w-md">
            <input
              type="text"
              autoFocus
              value={typedText}
              onChange={handleTyping}
              placeholder="Ketik di sini..."
              aria-label="Input tantangan game"
              className="w-full rounded-xl border-2 border-arcade-yellow bg-black/80 px-4 py-3 text-center font-mono text-lg font-bold text-white uppercase placeholder-white/40 outline-none focus:ring-4 focus:ring-arcade-yellow/50"
            />
          </div>
        </div>
      )}

      {/* Game State: Score Calculated / Submit Form */}
      {calculatedScore && !submittedScore && (
        <form onSubmit={handleSubmitScore} className="mt-6 flex flex-col items-center text-center">
          <span className="font-display text-xs uppercase tracking-wider text-emerald-400">
            Tantangan Selesai!
          </span>
          <div className="mt-1 font-mono text-4xl font-black text-arcade-yellow [text-shadow:2px_2px_0_var(--arcade-ink)] sm:text-5xl">
            {calculatedScore.toLocaleString("id-ID")} PTS
          </div>

          <p className="mt-2 text-sm text-white/80">
            Kirim skor Anda ke Leaderboard Pameran Pixel To Reality!
          </p>

          <div className="mt-5 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="text"
              required
              maxLength={30}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nama / Nickname Anda"
              aria-label="Nama pemain"
              className="flex-1 rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-medium text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-arcade-yellow px-6 py-2.5 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Skor →"}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-3 text-xs font-semibold text-red-300" role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      )}

      {/* Game State: Submitted */}
      {submittedScore && (
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400">
            ✓
          </div>
          <h3 className="mt-2 font-display text-xl font-bold text-arcade-yellow sm:text-2xl">
            Skor Berhasil Tercatat di Leaderboard!
          </h3>
          <p className="mt-1 font-mono text-sm text-white/80">
            Pemain: <strong className="text-white">{submittedScore.player_name}</strong> | Skor: <strong className="text-arcade-yellow">{submittedScore.final_score} PTS</strong>
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/leaderboard"
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-arcade-yellow px-5 py-2 font-display text-sm font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] hover:-translate-y-0.5"
            >
              Buka Leaderboard Resmi →
            </Link>
            <button
              type="button"
              onClick={handleStartGame}
              disabled={isStartingSession}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-white/30 bg-black/40 px-5 py-2 font-display text-sm font-bold text-white hover:bg-white/10 disabled:opacity-60 cursor-pointer"
            >
              {isStartingSession ? "Menyiapkan..." : "Main Lagi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
