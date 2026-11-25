import {
  buildCoreAccumulatedLeaderboard,
  buildPerGameLeaderboards,
} from "@/lib/leaderboard/aggregateLeaderboard";
import { GAME_SCORE_ENTRIES, LEADERBOARD_ENTRIES } from "@/lib/content";

describe("Dual Leaderboard Aggregation (Inti Akumulasi & Per Game)", () => {
  it("accumulates scores for 1 user across all played games in Leaderboard Inti", () => {
    const core = buildCoreAccumulatedLeaderboard(GAME_SCORE_ENTRIES);

    // Must match the 8 unique players in LEADERBOARD_ENTRIES and exact accumulated totals
    expect(core).toHaveLength(LEADERBOARD_ENTRIES.length);
    expect(core[0]).toMatchObject({
      rank: 1,
      playerName: "CyberKnight",
      score: 98500,
      gamesCount: 3,
    });
    expect(core[1]).toMatchObject({
      rank: 2,
      playerName: "PixelQueen",
      score: 87200,
      gamesCount: 2,
    });
  });

  it("accumulates dynamically even when raw API entries put same player with multiple game scores out of order", () => {
    const raw = [
      { rank: 1, playerName: "Budi", gameName: "Game A", score: 1500 },
      { rank: 1, playerName: "Ani", gameName: "Game A", score: 3000 },
      { rank: 2, playerName: "Budi", gameName: "Game B", score: 2500 },
      { rank: 3, playerName: "Budi", gameName: "Game C", score: 1000 },
    ];

    const core = buildCoreAccumulatedLeaderboard(raw);
    expect(core).toHaveLength(2);
    expect(core[0]).toMatchObject({
      rank: 1,
      playerName: "Budi",
      score: 5000,
      gamesCount: 3,
    });
    expect(core[1]).toMatchObject({
      rank: 2,
      playerName: "Ani",
      score: 3000,
      gamesCount: 1,
    });
  });

  it("groups and ranks players separately per game", () => {
    const perGame = buildPerGameLeaderboards(GAME_SCORE_ENTRIES);
    expect(perGame.map((g) => g.gameName)).toEqual([
      "Cyber Runner 2099",
      "Byte Defender",
      "Neon Highway",
    ]);

    const byteDefender = perGame.find((g) => g.gameName === "Byte Defender");
    expect(byteDefender?.entries[0]).toMatchObject({
      rank: 1,
      playerName: "PixelQueen",
      score: 47200,
    });

    const neonHighway = perGame.find((g) => g.gameName === "Neon Highway");
    expect(neonHighway?.entries[0]).toMatchObject({
      rank: 1,
      playerName: "NeonRider",
      score: 46450,
    });
  });
});
