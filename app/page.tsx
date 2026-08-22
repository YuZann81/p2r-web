import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Games from "@/components/Games";
import KaryaShowcasePreview from "@/components/KaryaShowcasePreview";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import LatestFeedsPreview from "@/components/LatestFeedsPreview";
import MerchandiseSection from "@/components/MerchandiseSection";
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
      <Games />
      <KaryaShowcasePreview />
      <LeaderboardPreview />
      <LatestFeedsPreview />
      <MerchandiseSection />
      <Footer />
    </main>
  );
}
