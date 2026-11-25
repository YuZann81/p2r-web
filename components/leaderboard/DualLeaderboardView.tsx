"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Gamepad2, RefreshCw, Trophy, UserCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  DEFAULT_LEADERBOARD_LIMIT,
  getGameLeaderboardData,
  getOverallLeaderboardData,
  type GameLeaderboardLoadResult,
  type OverallLeaderboardLoadResult,
} from "@/lib/leaderboard/getLeaderboard";
import type {
  LeaderboardDirection,
  LeaderboardEntry,
  LeaderboardEventSummary,
  LeaderboardGameOption,
  OverallLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

type LeaderboardTab = "overall" | "per_game";

type DisplayRow = {
  key: string;
  rank: number;
  playerName: string;
  score: number;
  subtitle: string;
  gamesPlayed?: number;
};

export type DualLeaderboardViewProps = {
  initialOverall: OverallLeaderboardLoadResult;
  games: readonly LeaderboardGameOption[];
  compact?: boolean;
};

function formatScore(score: number): string {
  return Number.isFinite(score) ? score.toLocaleString("id-ID") : "0";
}

function mapOverallToRows(
  entries: readonly OverallLeaderboardEntry[],
): DisplayRow[] {
  return entries.map((entry, index) => ({
    key: `overall-${entry.playerId ?? entry.playerName}-${entry.rank}-${index}`,
    rank: entry.rank,
    playerName: entry.playerName,
    score: entry.totalScore,
    subtitle: `${entry.gamesPlayed} Game`,
    gamesPlayed: entry.gamesPlayed,
  }));
}

function mapGameToRows(entries: readonly LeaderboardEntry[]): DisplayRow[] {
  return entries.map((entry, index) => ({
    key: `game-${entry.playerId ?? entry.playerName}-${entry.rank}-${index}`,
    rank: entry.rank,
    playerName: entry.playerName,
    score: entry.score,
    subtitle: entry.gameName,
  }));
}

function directionLabel(direction: LeaderboardDirection): string {
  return direction === "lower_is_better"
    ? "Skor Terendah Terbaik"
    : "Skor Tertinggi Terbaik";
}

function LeaderboardSkeleton({ compact }: { compact: boolean }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat data klasemen"
      data-testid="leaderboard-loading-state"
      className="space-y-6"
    >
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((slot) => (
          <div
            key={slot}
            className="h-44 animate-pulse rounded-3xl border border-[#5b2be6]/35 bg-[#171224]/80 p-5"
          >
            <div className="mx-auto mb-3 h-11 w-11 rounded-xl bg-[#2a1147]/90" />
            <div className="mx-auto h-5 w-28 rounded bg-[#2a1147]/80" />
            <div className="mx-auto mt-3 h-4 w-20 rounded bg-[#2a1147]/60" />
          </div>
        ))}
      </div>
      {!compact && (
        <div className="overflow-hidden rounded-2xl border border-[#5b2be6]/35 bg-[#171224]/80 p-5">
          <div className="space-y-3">
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                className="h-12 animate-pulse rounded-xl bg-[#2a1147]/60"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DualLeaderboardView({
  initialOverall,
  games,
  compact = false,
}: DualLeaderboardViewProps) {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState<LeaderboardTab>("overall");
  const [selectedSlug, setSelectedSlug] = useState<string>(
    games[0]?.slug ?? "",
  );

  const [overallResult, setOverallResult] =
    useState<OverallLeaderboardLoadResult>(initialOverall);
  const [overallLoading, setOverallLoading] = useState<boolean>(false);

  const [gameResults, setGameResults] = useState<
    Record<string, GameLeaderboardLoadResult>
  >({});
  const [gameLoadingSlug, setGameLoadingSlug] = useState<string | null>(null);

  const overallRequestSeqRef = useRef(0);
  const gameRequestSeqRef = useRef(0);
  const hydratedOverallTokenRef = useRef<string | null>(null);
  const hydratedGameTokensRef = useRef<Map<string, string>>(new Map());

  const activeGameOption =
    games.find((g) => g.slug === selectedSlug) ?? games[0] ?? null;
  const resolvedSlug = activeGameOption?.slug ?? "";

  const loadOverall = useCallback(
    async (opts: { forceRefresh?: boolean; authToken?: string | null } = {}) => {
      const requestId = ++overallRequestSeqRef.current;
      setOverallLoading(true);
      const result = await getOverallLeaderboardData({
        limit: DEFAULT_LEADERBOARD_LIMIT,
        token: opts.authToken ?? token,
        forceRefresh: opts.forceRefresh,
      });

      if (overallRequestSeqRef.current === requestId) {
        setOverallResult(result);
        setOverallLoading(false);
      }
    },
    [token],
  );

  const loadGame = useCallback(
    async (
      slug: string,
      opts: { forceRefresh?: boolean; authToken?: string | null } = {},
    ) => {
      if (!slug) {
        return;
      }

      const requestId = ++gameRequestSeqRef.current;
      setGameLoadingSlug(slug);
      const result = await getGameLeaderboardData(slug, {
        limit: DEFAULT_LEADERBOARD_LIMIT,
        token: opts.authToken ?? token,
        forceRefresh: opts.forceRefresh,
      });

      if (gameRequestSeqRef.current === requestId) {
        setGameResults((prev) => ({ ...prev, [slug]: result }));
        setGameLoadingSlug((current) => (current === slug ? null : current));
      }
    },
    [token],
  );

  // Hydrate authenticated my_rank once when a signed-in token becomes available.
  // Anonymous visitors trigger zero extra requests on mount.
  useEffect(() => {
    if (!token) {
      return;
    }

    if (
      activeTab === "overall" &&
      hydratedOverallTokenRef.current !== token
    ) {
      hydratedOverallTokenRef.current = token;
      const requestId = ++overallRequestSeqRef.current;
      void getOverallLeaderboardData({
        limit: DEFAULT_LEADERBOARD_LIMIT,
        token,
      }).then((result) => {
        if (overallRequestSeqRef.current === requestId) {
          setOverallResult(result);
        }
      });
      return;
    }

    if (
      activeTab === "per_game" &&
      resolvedSlug &&
      hydratedGameTokensRef.current.get(resolvedSlug) !== token
    ) {
      hydratedGameTokensRef.current.set(resolvedSlug, token);
      const requestId = ++gameRequestSeqRef.current;
      void getGameLeaderboardData(resolvedSlug, {
        limit: DEFAULT_LEADERBOARD_LIMIT,
        token,
      }).then((result) => {
        if (gameRequestSeqRef.current === requestId) {
          setGameResults((prev) => ({ ...prev, [resolvedSlug]: result }));
        }
      });
    }
  }, [activeTab, resolvedSlug, token]);

  const handleSelectTab = (tab: LeaderboardTab) => {
    setActiveTab(tab);
    if (tab === "per_game" && resolvedSlug && !gameResults[resolvedSlug]) {
      void loadGame(resolvedSlug);
    }
  };

  const handleSelectGame = (slug: string) => {
    setSelectedSlug(slug);
    void loadGame(slug);
  };

  const handleRetry = () => {
    if (activeTab === "overall") {
      void loadOverall({ forceRefresh: true });
      return;
    }
    if (resolvedSlug) {
      void loadGame(resolvedSlug, { forceRefresh: true });
    }
  };

  const activeGameResult = resolvedSlug ? gameResults[resolvedSlug] : undefined;
  const isOverall = activeTab === "overall";
  const isLoading = isOverall
    ? overallLoading
    : Boolean(resolvedSlug && gameLoadingSlug === resolvedSlug && !activeGameResult);
  const isRefreshing = isOverall
    ? overallLoading
    : Boolean(resolvedSlug && gameLoadingSlug === resolvedSlug);

  const activeStatus = isOverall
    ? overallResult.status
    : activeGameResult?.status ?? (games.length === 0 ? "empty" : "empty");

  const activeErrorMessage = isOverall
    ? overallResult.errorMessage
    : activeGameResult?.errorMessage;

  const activeEvent: LeaderboardEventSummary | null = isOverall
    ? overallResult.data.event
    : activeGameResult?.data.event ?? overallResult.data.event;

  const activeTotalPlayers = isOverall
    ? overallResult.data.totalPlayers
    : activeGameResult?.data.totalPlayers ?? 0;

  const activeDirection: LeaderboardDirection | null = isOverall
    ? null
    : activeGameResult?.data.direction ?? null;

  const allRows: DisplayRow[] = isOverall
    ? mapOverallToRows(overallResult.data.entries)
    : mapGameToRows(activeGameResult?.data.entries ?? []);

  const visibleRows = compact ? allRows.slice(0, 9) : allRows;

  // Preserve exact API ranking order without re-sorting on the client.
  const topThree = visibleRows.slice(0, 3);
  const rank1 = topThree[0];
  const rank2 = topThree[1];
  const rank3 = topThree[2];
  const podiumOrder =
    topThree.length >= 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;
  const compactOtherRows = visibleRows.slice(3, 9);

  const overallMyRank = isOverall ? overallResult.data.myRank : null;
  const gameMyRank = !isOverall ? activeGameResult?.data.myRank ?? null : null;

  const activeGameTitle =
    activeGameResult?.data.game?.title || activeGameOption?.title || "";

  return (
    <div className="w-full">
      {/* Mode Switcher: Overall Accumulated vs Per-Game */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div
          role="tablist"
          aria-label="Pilih tipe leaderboard"
          className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-[#5b2be6]/45 bg-[#171224] p-1.5 shadow-[4px_4px_0_#0E0A1A]"
        >
          <button
            type="button"
            role="tab"
            id="leaderboard-tab-overall"
            aria-selected={isOverall}
            aria-controls="leaderboard-panel"
            onClick={() => handleSelectTab("overall")}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 font-display text-sm tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500] sm:text-base ${
              isOverall
                ? "bg-[#ffe500] font-bold text-[#0E0A1A] shadow-[2px_2px_0_#B8960A]"
                : "text-[#FFF5E9]/85 hover:bg-white/5 hover:text-[#ffe500]"
            }`}
          >
            <Trophy className="h-4 w-4" aria-hidden="true" />
            <span>Leaderboard Inti (Akumulasi)</span>
          </button>

          <button
            type="button"
            role="tab"
            id="leaderboard-tab-per-game"
            aria-selected={!isOverall}
            aria-controls="leaderboard-panel"
            onClick={() => handleSelectTab("per_game")}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 font-display text-sm tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68D5E8] sm:text-base ${
              !isOverall
                ? "bg-[#68D5E8] font-bold text-[#0E0A1A] shadow-[2px_2px_0_#0E0A1A]"
                : "text-[#FFF5E9]/85 hover:bg-white/5 hover:text-[#68D5E8]"
            }`}
          >
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            <span>Leaderboard Per Game</span>
          </button>
        </div>

        {/* Active Event & Meta Context Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
          {activeEvent ? (
            <span
              data-testid="leaderboard-active-event"
              className="inline-flex items-center gap-2 rounded-full border border-[#7ac70c]/50 bg-[#7ac70c]/10 px-3.5 py-1 font-body font-medium text-[#FFF5E9]"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#7ac70c]"
              />
              <span>Event Aktif: {activeEvent.name}</span>
            </span>
          ) : activeStatus !== "error" ? (
            <span
              data-testid="leaderboard-no-event"
              className="inline-flex items-center gap-2 rounded-full border border-[#5b2be6]/40 bg-[#171224] px-3.5 py-1 font-body text-[#B7ABCE]"
            >
              <span>Belum ada event global aktif</span>
            </span>
          ) : null}

          {activeStatus === "live" && activeTotalPlayers > 0 && (
            <span className="rounded-full border border-[#5b2be6]/40 bg-[#171224] px-3.5 py-1 font-display tracking-wider text-[#B7ABCE] tabular-nums">
              {activeTotalPlayers.toLocaleString("id-ID")} PEMAIN
            </span>
          )}

          {activeDirection && activeStatus === "live" && (
            <span
              data-testid="leaderboard-score-direction"
              className="rounded-full border border-[#68D5E8]/40 bg-[#68D5E8]/10 px-3.5 py-1 font-body font-medium text-[#68D5E8]"
            >
              {directionLabel(activeDirection)}
            </span>
          )}
        </div>

        {/* Description (Overall) or Published Game Selector (Per-Game) */}
        {isOverall ? (
          <p className="max-w-xl text-center font-body text-xs text-[#B7ABCE] sm:text-sm">
            Akumulasi skor pemain dari seluruh game pameran pada event global yang sedang aktif.
          </p>
        ) : games.length > 0 ? (
          <div
            role="group"
            aria-label="Pilih game untuk klasemen"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {games.map((game) => {
              const isSelected = game.slug === resolvedSlug;
              return (
                <button
                  key={game.slug}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectGame(game.slug)}
                  className={`min-h-9 rounded-xl border px-3.5 py-1.5 font-display text-xs tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe500] sm:text-sm ${
                    isSelected
                      ? "border-[#ffe500] bg-[#ffe500]/15 text-[#ffe500] shadow-[2px_2px_0_#0E0A1A]"
                      : "border-[#5b2be6]/45 bg-[#171224] text-[#FFF5E9]/80 hover:border-[#68D5E8]/60 hover:text-[#68D5E8]"
                  }`}
                >
                  {game.title}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Signed-in Player Personal Rank Banner */}
      {!isLoading && (overallMyRank || gameMyRank) && (
        <div
          data-testid="leaderboard-my-rank"
          className="mx-auto mb-8 flex max-w-4xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#68D5E8]/55 bg-gradient-to-r from-[#2a1147]/85 via-[#171224] to-[#171224] px-5 py-3.5 shadow-[4px_4px_0_#0E0A1A]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#68D5E8]/50 bg-[#68D5E8]/15 text-[#68D5E8]">
              <UserCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-body text-[11px] font-semibold tracking-wider text-[#68D5E8] uppercase">
                Peringkat Anda
              </p>
              <p className="font-display text-lg text-[#FFF5E9]">
                #{(overallMyRank ?? gameMyRank)!.rank} &middot;{" "}
                {(overallMyRank ?? gameMyRank)!.playerName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-lg font-bold text-[#ffe500] tabular-nums">
              {formatScore(
                overallMyRank ? overallMyRank.totalScore : gameMyRank!.score,
              )}{" "}
              PTS
            </p>
            {overallMyRank && (
              <p className="font-body text-xs text-[#B7ABCE]">
                {overallMyRank.gamesPlayed} Game Dimainkan
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Tab Panel */}
      <div
        id="leaderboard-panel"
        role="tabpanel"
        aria-labelledby={
          isOverall ? "leaderboard-tab-overall" : "leaderboard-tab-per-game"
        }
      >
        {isLoading ? (
          <LeaderboardSkeleton compact={compact} />
        ) : activeStatus === "error" ? (
          <div
            role="alert"
            data-testid="leaderboard-error-state"
            className="mx-auto max-w-2xl rounded-3xl border border-red-400/40 bg-[#171224]/95 px-6 py-10 text-center shadow-[0_18px_36px_rgba(14,10,26,0.7)] sm:px-10"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/15 text-red-300">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="font-display text-2xl tracking-wide text-[#FFF5E9]">
              Gagal Memuat Klasemen
            </p>
            <p className="mt-2 font-body text-sm text-[#B7ABCE]">
              {activeErrorMessage || "Terjadi gangguan saat mengambil data klasemen dari server."}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRefreshing}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ffe500] px-6 py-2.5 font-display text-base font-bold text-[#0E0A1A] shadow-[3px_3px_0_#B8960A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span>Coba Lagi</span>
            </button>
          </div>
        ) : !isOverall && games.length === 0 ? (
          <div
            data-testid="leaderboard-empty-state"
            className="mx-auto max-w-2xl rounded-3xl border border-[#5b2be6]/40 bg-gradient-to-b from-[#2a1147]/60 via-[#171224]/95 to-[#171224] px-6 py-12 text-center shadow-[0_22px_44px_rgba(14,10,26,0.7)] sm:px-10"
          >
            <p className="font-display text-2xl tracking-wide text-[#ffe500] sm:text-3xl">
              Belum Ada Game Tersedia
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#FFF5E9]/78 sm:text-base">
              Daftar game pameran akan muncul otomatis setelah karya game dipublikasikan.
            </p>
          </div>
        ) : !isOverall && activeStatus === "unavailable" ? (
          <div
            data-testid="leaderboard-empty-state"
            className="mx-auto max-w-2xl rounded-3xl border border-[#5b2be6]/40 bg-gradient-to-b from-[#2a1147]/60 via-[#171224]/95 to-[#171224] px-6 py-12 text-center shadow-[0_22px_44px_rgba(14,10,26,0.7)] sm:px-10"
          >
            <p className="font-display text-2xl tracking-wide text-[#ffe500] sm:text-3xl">
              Leaderboard Belum Aktif
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#FFF5E9]/78 sm:text-base">
              Papan klasemen belum diaktifkan untuk {activeGameTitle || "game ini"}.
            </p>
          </div>
        ) : visibleRows.length === 0 ? (
          <div
            data-testid="leaderboard-empty-state"
            className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#5b2be6]/40 bg-gradient-to-b from-[#2a1147]/60 via-[#171224]/95 to-[#171224] px-6 py-12 text-center shadow-[0_22px_44px_rgba(14,10,26,0.7)] sm:px-10"
          >
            <span
              aria-hidden="true"
              className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-[#5b2be6]"
            />
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-[#7a1fb0]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-3 h-2 w-2 bg-[#7ac70c]/80"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 h-2 w-2 bg-[#ffe500]/80"
            />

            <p className="font-display text-2xl tracking-wide text-[#ffe500] sm:text-3xl">
              Belum Ada Skor Tercatat
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#FFF5E9]/78 sm:text-base">
              {isOverall
                ? "Belum ada data skor klasemen yang tercatat untuk event global saat ini."
                : `Belum ada skor tercatat untuk ${activeGameTitle || "game ini"}.`}
            </p>
          </div>
        ) : compact ? (
          /* Compact Homepage View (Top 9 max) */
          <>
            <div className="relative mx-auto mb-10 max-w-4xl pt-2 md:mb-12">
              <div className="grid w-full grid-cols-1 items-end gap-5 sm:grid-cols-3 md:gap-6">
                {/* Rank 2 (Left) */}
                {rank2 ? (
                  <article className="relative order-2 flex flex-col items-center sm:order-1">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-[#5b2be6]/65 bg-gradient-to-b from-[#2a1147]/70 via-[#171224]/95 to-[#171224] p-5 text-center shadow-[0_18px_36px_rgba(14,10,26,0.75)]">
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 left-2.5 h-2.5 w-2.5 border-t-2 border-l-2 border-[#5b2be6]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 right-2.5 h-2.5 w-2.5 border-t-2 border-r-2 border-[#5b2be6]"
                      />
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#68D5E8] bg-[#68D5E8]/20 font-display text-lg font-bold text-[#68D5E8] tabular-nums shadow-[2px_2px_0_#0E0A1A]">
                        #{rank2.rank}
                      </div>
                      <h3 className="truncate font-display text-xl tracking-wide text-[#FFF5E9]">
                        {rank2.playerName}
                      </h3>
                      <p className="mt-1.5 font-display text-base font-bold tracking-wider text-[#7ac70c] tabular-nums">
                        {formatScore(rank2.score)} PTS
                      </p>
                      <span className="mt-1 block truncate font-body text-xs text-[#B7ABCE]">
                        {rank2.subtitle}
                      </span>
                    </div>
                  </article>
                ) : (
                  <div className="hidden sm:order-1 sm:block" aria-hidden="true" />
                )}

                {/* Rank 1 (Center Champion) */}
                {rank1 ? (
                  <article className="relative order-1 flex flex-col items-center sm:order-2 sm:-translate-y-4">
                    <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#ffe500]/65 bg-[#0E0A1A] px-3 py-1 font-display text-xs font-bold tracking-[0.16em] text-[#ffe500] uppercase shadow-[2px_2px_0_#0E0A1A]">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 bg-[#ffe500]"
                      />
                      JUARA 1
                    </span>
                    <div className="relative w-full overflow-hidden rounded-3xl border-2 border-[#ffe500]/80 bg-gradient-to-b from-[#2a1147]/90 via-[#171224]/96 to-[#171224] p-6 text-center shadow-[0_24px_48px_rgba(14,10,26,0.88)]">
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 left-2.5 h-3 w-3 border-t-2 border-l-2 border-[#5b2be6]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 right-2.5 h-3 w-3 border-t-2 border-r-2 border-[#7a1fb0]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-2.5 left-2.5 h-2 w-2 bg-[#7ac70c]/85"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-2.5 right-2.5 h-2 w-2 bg-[#ffe500]/85"
                      />
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffe500] font-display text-2xl font-bold text-[#0E0A1A] tabular-nums shadow-[3px_3px_0_#B8960A]">
                        #{rank1.rank}
                      </div>
                      <h3
                        className="truncate font-display text-2xl font-bold tracking-wide text-[#FFF5E9]"
                        style={{ textShadow: "2px 2px 0px #0E0A1A" }}
                      >
                        {rank1.playerName}
                      </h3>
                      <p className="mt-1.5 font-display text-lg font-extrabold tracking-wider text-[#ffe500] tabular-nums">
                        {formatScore(rank1.score)} PTS
                      </p>
                      <span className="mt-1 block truncate font-body text-xs font-medium text-[#B7ABCE]">
                        {rank1.subtitle}
                      </span>
                    </div>
                  </article>
                ) : (
                  <div className="hidden sm:order-2 sm:block" aria-hidden="true" />
                )}

                {/* Rank 3 (Right) */}
                {rank3 ? (
                  <article className="relative order-3 flex flex-col items-center">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-[#F5A05E]/60 bg-gradient-to-b from-[#2a1147]/60 via-[#171224]/95 to-[#171224] p-5 text-center shadow-[0_18px_36px_rgba(14,10,26,0.75)]">
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 left-2.5 h-2.5 w-2.5 border-t-2 border-l-2 border-[#7a1fb0]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 right-2.5 h-2.5 w-2.5 border-t-2 border-r-2 border-[#7a1fb0]"
                      />
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#F5A05E] bg-[#F5A05E]/20 font-display text-lg font-bold text-[#F5A05E] tabular-nums shadow-[2px_2px_0_#0E0A1A]">
                        #{rank3.rank}
                      </div>
                      <h3 className="truncate font-display text-xl tracking-wide text-[#FFF5E9]">
                        {rank3.playerName}
                      </h3>
                      <p className="mt-1.5 font-display text-base font-bold tracking-wider text-[#B7ABCE] tabular-nums">
                        {formatScore(rank3.score)} PTS
                      </p>
                      <span className="mt-1 block truncate font-body text-xs text-[#B7ABCE]/85">
                        {rank3.subtitle}
                      </span>
                    </div>
                  </article>
                ) : (
                  <div className="hidden sm:order-3 sm:block" aria-hidden="true" />
                )}
              </div>
            </div>

            {/* Ranks 4-9 List */}
            {compactOtherRows.length > 0 && (
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                {compactOtherRows.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#5b2be6]/35 bg-[#171224]/90 px-4 py-3.5 shadow-[0_10px_22px_rgba(14,10,26,0.55)] transition-colors hover:border-[#ffe500]/55"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#5b2be6]/40 bg-[#2a1147]/80 font-display text-xs font-bold text-[#ffe500] tabular-nums">
                        #{item.rank}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-medium text-[#FFF5E9]">
                          {item.playerName}
                        </p>
                        <p className="truncate font-body text-[11px] text-[#B7ABCE]/80">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-display text-sm font-bold tracking-wide text-[#7ac70c] tabular-nums">
                      {formatScore(item.score)} PTS
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Full /leaderboard View */
          <>
            {podiumOrder.length > 0 && (
              <section aria-label="Top 3 Juara Klasemen" className="mb-14">
                <h2 className="mb-8 text-center font-display text-2xl text-[#FFD447] drop-shadow-[2px_2px_0_#0E0A1A] sm:text-3xl">
                  {isOverall
                    ? "TOP 3 CHAMPIONS"
                    : `TOP 3 · ${activeGameTitle}`}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-end">
                  {podiumOrder.map((entry) => {
                    const isFirst = entry.rank === 1;
                    const isSecond = entry.rank === 2;

                    return (
                      <div
                        key={entry.key}
                        className={`flex flex-col items-center rounded-2xl p-6 text-center shadow-[6px_6px_0_#0E0A1A] transition-transform ${
                          isFirst
                            ? "order-1 border-2 border-[#FFD447] bg-gradient-to-b from-[#FFD447]/20 via-[#211B35] to-[#171224] shadow-[0_0_20px_rgba(255,212,71,0.2)] sm:order-2 sm:-translate-y-4 sm:p-8"
                            : isSecond
                              ? "order-2 border-2 border-[#68D5E8] bg-gradient-to-b from-[#68D5E8]/15 via-[#211B35] to-[#171224] sm:order-1 sm:p-6"
                              : "order-3 border-2 border-[#F5A05E] bg-gradient-to-b from-[#F5A05E]/15 via-[#211B35] to-[#171224] sm:order-3 sm:p-6"
                        }`}
                      >
                        {isFirst && (
                          <div className="mb-2">
                            <span className="rounded-md border border-[#FFD447]/60 bg-[#0E0A1A] px-3 py-1 font-display text-xs font-bold tracking-wider text-[#FFD447] uppercase shadow-xs">
                              JUARA 1
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-xl font-bold tabular-nums shadow-md ${
                            isFirst
                              ? "bg-[#FFD447] text-[#0E0A1A] shadow-[0_0_12px_rgba(255,212,71,0.8)]"
                              : isSecond
                                ? "border border-[#68D5E8] bg-[#68D5E8]/20 text-[#68D5E8]"
                                : "border border-[#F5A05E] bg-[#F5A05E]/20 text-[#F5A05E]"
                          }`}
                        >
                          #{entry.rank}
                        </div>
                        <h3
                          className={`mt-3 w-full truncate font-display text-2xl ${
                            isFirst
                              ? "font-bold text-[#FFD447]"
                              : "text-[#FFF5E9]"
                          }`}
                        >
                          {entry.playerName}
                        </h3>
                        <span
                          className={`mt-1 w-full truncate font-display text-xs tracking-wider uppercase ${
                            isFirst
                              ? "font-semibold text-[#FFF5E9]/80"
                              : isSecond
                                ? "text-[#68D5E8]"
                                : "text-[#F5A05E]"
                          }`}
                        >
                          {entry.subtitle}
                        </span>
                        <div className="mt-4 rounded-xl border border-white/10 bg-[#0E0A1A] px-5 py-2 font-display text-lg font-bold text-[#FFD447] tabular-nums sm:text-xl">
                          {formatScore(entry.score)} PTS
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Complete Leaderboard Table */}
            <section
              aria-label="Tabel Klasemen Lengkap"
              className="overflow-hidden rounded-2xl border-2 border-[#39265E] bg-[#171224] shadow-[6px_6px_0_#0E0A1A]"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#FFF5E9] sm:text-base">
                  <thead className="border-b border-[#39265E] bg-[#211B35] font-display text-base tracking-wider text-[#FFD447] uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-4 text-center sm:px-6">
                        Rank
                      </th>
                      <th scope="col" className="px-5 py-4 sm:px-6">
                        Player
                      </th>
                      <th scope="col" className="px-5 py-4 text-right sm:px-6">
                        {isOverall ? "Total Score" : "Score"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-body">
                    {visibleRows.map((entry) => (
                      <tr
                        key={entry.key}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="px-5 py-4 text-center font-display font-bold tabular-nums sm:px-6">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                              entry.rank === 1
                                ? "bg-[#FFD447] text-[#0E0A1A]"
                                : entry.rank === 2
                                  ? "bg-[#FFF5E9] text-[#0E0A1A]"
                                  : entry.rank === 3
                                    ? "bg-[#CD7F32] text-white"
                                    : "text-[#B7ABCE]"
                            }`}
                          >
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <div className="font-semibold text-[#FFF5E9]">
                            {entry.playerName}
                          </div>
                          <div className="text-xs text-[#B7ABCE]">
                            {isOverall && entry.gamesPlayed !== undefined
                              ? `${entry.gamesPlayed} Game Dimainkan`
                              : entry.subtitle}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-display text-base font-bold text-[#FFD447] tabular-nums sm:px-6 sm:text-lg">
                          {formatScore(entry.score)} PTS
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
