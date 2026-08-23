import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KaryaDetailView from "@/components/KaryaDetailView";
import { getKaryaBySlug } from "@/lib/karya/getKaryaBySlug";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type KaryaDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: KaryaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const karya = await getKaryaBySlug(slug);

  if (!karya) {
    return {
      title: "Karya Tidak Ditemukan — Pixels to Reality",
      description: "Detail karya yang Anda cari tidak ditemukan di pameran Pixel To Reality.",
    };
  }

  return {
    title: `${karya.title} — Detail Karya | Pixels to Reality`,
    description:
      karya.description ||
      `Eksplorasi karya ${karya.title} buatan siswa RPL di pameran Pixel To Reality: The Cyber Arcade.`,
  };
}

export default async function KaryaDetailPage({
  params,
}: KaryaDetailPageProps) {
  const { slug } = await params;
  const karya = await getKaryaBySlug(slug);

  if (!karya) {
    notFound();
  }

  return (
    <KaryaDetailView
      karya={karya}
      backHref="/karya"
      backLabel="← Kembali ke Semua Karya"
    />
  );
}
