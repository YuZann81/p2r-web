import type {
  CoreLeaderboardEntry,
  GameLeaderboardGroup,
  LeaderboardEntry,
} from "@/lib/api/types/leaderboard";

/**
 * Mengakumulasi skor 1 pemain dari seluruh game yang dimainkannya menjadi Leaderboard Inti.
 */
export function buildCoreAccumulatedLeaderboard(
  rawEntries: readonly LeaderboardEntry[],
): CoreLeaderboardEntry[] {
  const playerMap = new Map<
    string,
    {
      playerName: string;
      byGame: Map<string, number>;
    }
  >();

  for (const item of rawEntries) {
    const cleanName = item.playerName.trim();
    if (!cleanName) continue;
    const key = cleanName.toLowerCase();
    const gameLabel = item.gameName.trim() || "Arcade P2R";
    const safeScore = Number.isFinite(item.score) ? item.score : 0;

    let record = playerMap.get(key);
    if (!record) {
      record = { playerName: cleanName, byGame: new Map<string, number>() };
      playerMap.set(key, record);
    }

    const prevGameScore = record.byGame.get(gameLabel) ?? 0;
    record.byGame.set(gameLabel, Math.max(prevGameScore, safeScore));
  }

  const aggregated = Array.from(playerMap.values()).map((player) => {
    const breakdown = Array.from(player.byGame.entries())
      .map(([gameName, score]) => ({ gameName, score }))
      .sort((a, b) => b.score - a.score);

    const totalScore = breakdown.reduce((sum, g) => sum + g.score, 0);
    const gamesCount = breakdown.length;
    const summaryLabel =
      gamesCount > 1
        ? `Akumulasi ${gamesCount} Game (${breakdown.map((g) => g.gameName).join(" • ")})`
        : breakdown[0]?.gameName || "Arcade P2R";

    return {
      rank: 0,
      playerName: player.playerName,
      gameName: summaryLabel,
      score: totalScore,
      gamesCount,
      gamesBreakdown: breakdown,
    };
  });

  aggregated.sort((a, b) => b.score - a.score);
  return aggregated.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}

/**
 * Mengelompokkan dan mengurutkan klasemen skor tertinggi per masing-masing game.
 */
export function buildPerGameLeaderboards(
  rawEntries: readonly LeaderboardEntry[],
): GameLeaderboardGroup[] {
  const gamesMap = new Map<string, Map<string, LeaderboardEntry>>();

  for (const item of rawEntries) {
    const gameLabel = item.gameName.trim() || "Arcade P2R";
    const playerKey = item.playerName.trim().toLowerCase();
    if (!playerKey) continue;

    let players = gamesMap.get(gameLabel);
    if (!players) {
      players = new Map<string, LeaderboardEntry>();
      gamesMap.set(gameLabel, players);
    }

    const existing = players.get(playerKey);
    if (!existing || item.score > existing.score) {
      players.set(playerKey, {
        rank: 0,
        playerName: item.playerName.trim(),
        gameName: gameLabel,
        score: Number.isFinite(item.score) ? item.score : 0,
      });
    }
  }

  return Array.from(gamesMap.entries()).map(([gameName, playerEntries]) => {
    const sorted = Array.from(playerEntries.values()).sort(
      (a, b) => b.score - a.score,
    );
    return {
      gameName,
      entries: sorted.map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      })),
    };
  });
}
