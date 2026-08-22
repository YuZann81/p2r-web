import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KaryaDetailView from "@/components/KaryaDetailView";
import { getKaryaBySlug } from "@/lib/karya/getKaryaBySlug";

type GameDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: GameDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const karya = await getKaryaBySlug(slug);

  if (!karya) {
    return {
      title: "Game Tidak Ditemukan — Pixels to Reality",
      description: "Detail game yang Anda cari tidak ditemukan di pameran Pixel To Reality.",
    };
  }

  return {
    title: `${karya.title} — Detail Game | Pixels to Reality`,
    description:
      karya.description ||
      `Eksplorasi game ${karya.title} buatan siswa RPL di pameran Pixel To Reality: The Cyber Arcade.`,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params;
  const karya = await getKaryaBySlug(slug);

  if (!karya) {
    notFound();
  }

  return (
    <KaryaDetailView
      karya={karya}
      backHref="/games"
      backLabel="← Kembali ke Direktori Game"
    />
  );
}
