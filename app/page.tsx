import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import KaryaShowcasePreview from "@/components/KaryaShowcasePreview";
import Games from "@/components/Games";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import LatestFeedsPreview from "@/components/LatestFeedsPreview";
import MerchandisePreview from "@/components/MerchandisePreview";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main
      className="flex min-h-screen flex-col"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <Navbar />
      <Hero />
      <About />
      <KaryaShowcasePreview />
      <Games />
      <LeaderboardPreview />
      <LatestFeedsPreview />
      <MerchandisePreview />
      <Footer />
    </main>
  );
}
