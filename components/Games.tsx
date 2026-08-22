import Link from "next/link";
import GameCard from "@/components/GameCard";
import { GAMES_HEADING } from "@/lib/content";
import { getGames } from "@/lib/games/getGames";

export default async function Games() {
  const games = await getGames();

  return (
    <section
      id="games"
      aria-label={GAMES_HEADING}
      className="w-full bg-[#2b2b8f] py-20 md:py-28"
    >
      <h2 className="sr-only">{GAMES_HEADING}</h2>

      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 md:gap-28">
        {games.map((game, index) => (
          <GameCard key={game.id} game={game} reversed={index % 2 === 1} />
        ))}

        <div className="flex justify-center">
          <Link
            href="/games"
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Lihat Semua Game
          </Link>
        </div>
      </div>
    </section>
  );
}
