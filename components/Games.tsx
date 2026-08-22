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
      </div>
    </section>
  );
}
