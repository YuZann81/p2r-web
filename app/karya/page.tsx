import type { Metadata } from "next";
import Link from "next/link";
import KaryaDirectory from "@/components/KaryaDirectory";
import { getAllKaryas } from "@/lib/karya/getKaryas";

export const metadata: Metadata = {
  title: "Direktori Karya — Pixels to Reality",
  description:
    "Eksplorasi seluruh karya inovasi digital, game, software, website, IoT, dan digital art buatan siswa RPL di Pixel To Reality.",
};

export default async function KaryaPage() {
  const karyas = await getAllKaryas();

  return (
    <main
      className="flex min-h-screen flex-col justify-between px-6 py-12 md:px-12 md:py-16"
      style={{
        background:
          "linear-gradient(160deg, var(--arcade-violet) 0%, var(--arcade-purple) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-12 text-center md:mb-16">
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-wider text-arcade-yellow transition-opacity hover:opacity-80 md:text-base"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="mt-4 font-display text-4xl text-arcade-yellow [text-shadow:3px_3px_0_var(--arcade-ink)] sm:text-5xl md:text-6xl">
            SEMUA KARYA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-pretty text-white/90 sm:text-lg">
            Direktori lengkap seluruh karya pameran: Game Arcade, Web Innovation, Software Engineering, IoT &amp; Hardware, serta Digital Art karya siswa RPL.
          </p>
        </header>

        <KaryaDirectory initialKaryas={karyas} />

        <div className="mt-20 flex justify-center md:mt-28">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-arcade-yellow px-8 py-3 font-display text-lg font-bold text-arcade-ink shadow-[6px_6px_0_var(--arcade-yellow-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--arcade-yellow-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_var(--arcade-yellow-shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-center font-display text-xs text-white/50">
        Pixel To Reality: The Cyber Arcade
      </footer>
    </main>
  );
}
