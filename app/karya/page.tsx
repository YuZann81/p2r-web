import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KaryaDirectory from "@/components/KaryaDirectory";
import { getAllKaryas } from "@/lib/karya/getKaryas";

export const metadata: Metadata = {
  title: "Direktori Karya & Pameran Inovasi — Pixels to Reality",
  description:
    "Eksplorasi seluruh karya inovasi website modern, aplikasi software, sistem IoT, dan digital art buatan siswa RPL di Pixel To Reality.",
};

export default async function KaryaPage() {
  const karyas = await getAllKaryas();

  return (
    <div className="flex min-h-screen flex-col bg-[#211B35] text-[#FFF5E9]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <header className="mb-10 text-center md:mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-display text-sm tracking-wider text-[#68D5E8] transition-colors hover:text-[#FFD447]"
            >
              ← Kembali ke Beranda
            </Link>
            <h1
              className="mt-3 font-display text-4xl text-[#FFD447] sm:text-5xl md:text-6xl select-none"
              style={{
                textShadow: "3px 3px 0px #C37D29, 6px 6px 0px #0E0A1A",
              }}
            >
              SEMUA KARYA
            </h1>
          </header>

          <KaryaDirectory initialKaryas={karyas} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
