import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PixelTransitionDivider from "@/components/PixelTransitionDivider";
import P2RVoltSection from "@/components/P2RVoltSection";
import {
  ExhibitionCountdownSection,
  PixelEnergyTrail,
  TimelineToLaunchPortal,
} from "@/components/PixelJourneySection";
import GameShowcase from "@/components/GameShowcase";
import LeaderboardSection from "@/components/LeaderboardSection";
import ArcadeCabinetSection from "@/components/ArcadeCabinetSection";
import MerchandiseSection from "@/components/MerchandiseSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";
import { getGames } from "@/lib/games/getGames";

export default async function Page() {
  const games = await getGames();

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />
      <main className="flex-1">
        <Hero games={games} />
        <PixelTransitionDivider />
        <PixelEnergyTrail />
        <P2RVoltSection />
        <TimelineToLaunchPortal />
        <ExhibitionCountdownSection />
        <GameShowcase games={games} />
        <LeaderboardSection
          games={games.map((g) => ({ slug: g.id, title: g.name }))}
        />
        <ArcadeCabinetSection />
        <PartnersSection />
        <MerchandiseSection />
      </main>
      <Footer />
    </div>
  );
}
