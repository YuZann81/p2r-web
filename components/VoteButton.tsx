"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
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

  // Auto-resume vote intent after authentication redirect
  useEffect(() => {
    const action = searchParams?.get ? searchParams.get("action") : null;
    const targetSlug = searchParams?.get ? searchParams.get("slug") : null;

    if (
      action === "vote" &&
      targetSlug === slug &&
      isAuthenticated &&
      !isVoted &&
      !isLoading
    ) {
      handleVote();
    }
  }, [searchParams, isAuthenticated, slug]);

  const handleVote = async () => {
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
            message: "⭐ Vote kamu berhasil dicatat! Terima kasih telah mendukung karya ini.",
          });
        } catch (err) {
          // If already voted on backend or duplicate
          setIsVoted(true);
          setFeedback({
            type: "info",
            message: "Kamu telah memberikan vote untuk karya ini.",
          });
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
        } catch {
          setIsVoted(false);
          setVotesCount((c) => Math.max(0, c - 1));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            <span className="text-lg">✓</span>
            <span>Voted ({votesCount})</span>
          </>
        ) : (
          <>
            <span className="text-lg">⭐</span>
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
