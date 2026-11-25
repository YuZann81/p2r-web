"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { voteKarya, unvoteKarya } from "@/lib/api/karya";

type VoteButtonProps = {
  slug: string;
  initialVotesCount: number;
  initialIsVoted?: boolean | string;
  className?: string;
};

export default function VoteButton({
  slug,
  initialVotesCount,
  initialIsVoted = false,
  className = "",
}: VoteButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuth();

  const isInitiallyVoted =
    initialIsVoted === true ||
    initialIsVoted === "1" ||
    initialIsVoted === "true";

  const [votesCount, setVotesCount] = useState(initialVotesCount);
  const [isVoted, setIsVoted] = useState(isInitiallyVoted);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const autoResumedKeyRef = useRef<string | null>(null);

  const handleVote = useCallback(async () => {
    if (!isAuthenticated) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : `/karya/${slug}`;
      const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}&action=vote&slug=${encodeURIComponent(slug)}`;
      router.push(redirectUrl);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      if (!isVoted) {
        // Submit Vote
        try {
          const res = await voteKarya(slug, token);
          const newCount =
            typeof res.data?.votes_count === "number"
              ? res.data.votes_count
              : votesCount + 1;
          setVotesCount(newCount);
          setIsVoted(true);
          setFeedback({
            type: "success",
            message: "Vote kamu berhasil dicatat! Terima kasih telah mendukung karya ini.",
          });
        } catch (err) {
          if (err instanceof ApiError && err.status === 409) {
            setIsVoted(true);
            setFeedback({
              type: "info",
              message: "Kamu telah memberikan vote untuk karya ini.",
            });
          } else if (err instanceof ApiError && err.status === 401) {
            setFeedback({
              type: "error",
              message: "Sesi masuk berakhir. Silakan masuk kembali.",
            });
          } else {
            setFeedback({
              type: "error",
              message: "Gagal memproses vote. Silakan coba lagi.",
            });
          }
        }
      } else {
        // Cancel Vote (Unvote)
        try {
          const res = await unvoteKarya(slug, token);
          const newCount =
            typeof res.data?.votes_count === "number"
              ? res.data.votes_count
              : Math.max(0, votesCount - 1);
          setVotesCount(newCount);
          setIsVoted(false);
          setFeedback({
            type: "info",
            message: "Vote kamu telah dibatalkan.",
          });
        } catch (err) {
          if (err instanceof ApiError && err.status === 409) {
            setIsVoted(false);
            setFeedback({
              type: "info",
              message: "Vote kamu sudah dibatalkan sebelumnya.",
            });
          } else if (err instanceof ApiError && err.status === 401) {
            setFeedback({
              type: "error",
              message: "Sesi masuk berakhir. Silakan masuk kembali.",
            });
          } else {
            setFeedback({
              type: "error",
              message: "Gagal membatalkan vote. Silakan coba lagi.",
            });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading, isVoted, router, slug, token, votesCount]);

  // Auto-resume vote intent after authentication redirect
  useEffect(() => {
    const action = searchParams?.get ? searchParams.get("action") : null;
    const targetSlug = searchParams?.get ? searchParams.get("slug") : null;
    const resumeKey = `${action ?? ""}:${targetSlug ?? ""}`;

    if (
      action !== "vote" ||
      targetSlug !== slug ||
      !isAuthenticated ||
      isVoted ||
      isLoading ||
      autoResumedKeyRef.current === resumeKey
    ) {
      return;
    }

    autoResumedKeyRef.current = resumeKey;
    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        void handleVote();
      }
    });

    return () => {
      active = false;
    };
  }, [searchParams, isAuthenticated, slug, isVoted, isLoading, handleVote]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleVote}
        disabled={isLoading}
        aria-pressed={isVoted}
        aria-busy={isLoading}
        aria-label={
          isVoted
            ? `Batalkan vote untuk karya (${votesCount} votes)`
            : `Beri vote untuk karya (${votesCount} votes)`
        }
        className={`group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 font-display text-base font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 disabled:opacity-60 cursor-pointer ${
          isVoted
            ? "bg-arcade-green text-white shadow-[4px_4px_0_#1b7a3e] hover:-translate-y-0.5"
            : "bg-arcade-yellow text-arcade-ink shadow-[4px_4px_0_var(--arcade-yellow-shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Memproses...
          </span>
        ) : isVoted ? (
          <>
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Voted ({votesCount})</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Beri Vote ({votesCount})</span>
          </>
        )}
      </button>

      {feedback && (
        <p
          role="status"
          className={`text-xs font-semibold text-center transition-opacity ${
            feedback.type === "success"
              ? "text-arcade-yellow"
              : feedback.type === "error"
                ? "text-red-300"
                : "text-white/80"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
