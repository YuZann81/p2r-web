import About from "@/components/About";
import Footer from "@/components/Footer";
import Games from "@/components/Games";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import MerchandiseSection from "@/components/MerchandiseSection";

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
      <MerchandiseSection />
      <Footer />
    </main>
  );
}
