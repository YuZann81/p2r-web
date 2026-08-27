"use client";

import React, { useState } from "react";
import DistributionEditor from "@/components/admin/DistributionEditor";
import type {
  KaryaCategory,
  KaryaDetail,
  StoreKaryaPayload,
  Distribution,
} from "@/lib/api/types/karya";

export type KaryaFormProps = {
  initialData?: KaryaDetail | null;
  onSubmit: (payload: StoreKaryaPayload) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const CATEGORIES: { value: KaryaCategory; label: string }[] = [
  { value: "game", label: "Game Arcade" },
  { value: "website", label: "Web Innovation" },
  { value: "software", label: "Software Engineering" },
  { value: "hardware_robotics", label: "IoT & Hardware" },
  { value: "digital_art", label: "Digital Art" },
];

export default function KaryaForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: KaryaFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [version, setVersion] = useState(initialData?.version || "");
  const [category, setCategory] = useState<KaryaCategory>(
    (initialData?.category as KaryaCategory) || "game",
  );
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [creators, setCreators] = useState(initialData?.creators || "");
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url || "");
  const [techStackText, setTechStackText] = useState(
    Array.isArray(initialData?.tech_stack)
      ? initialData!.tech_stack
          .map((item) =>
            typeof item === "string" ? item : (item as { name?: string })?.name,
          )
          .filter(Boolean)
          .join(", ")
      : "",
  );
  const [mediaUrlsText, setMediaUrlsText] = useState(
    Array.isArray(initialData?.media_urls)
      ? initialData!.media_urls
          .map((item) =>
            typeof item === "string" ? item : (item as { url?: string })?.url,
          )
          .filter(Boolean)
          .join("\n")
      : "",
  );
  const [distributions, setDistributions] = useState<Distribution[]>(
    Array.isArray(initialData?.distributions)
      ? initialData!.distributions
      : [],
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    Boolean(initialData?.is_featured),
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status === "draft" ? "draft" : "published",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate client-side distribution URLs
    for (const [idx, dist] of distributions.entries()) {
      if (dist.type !== "p2r_arcade") {
        if (!dist.url || !dist.url.trim()) {
          setErrorMessage(
            `Distribusi #${idx + 1} (${dist.type}) memerlukan URL yang valid.`,
          );
          return;
        }
        if (
          !dist.url.startsWith("http://") &&
          !dist.url.startsWith("https://")
        ) {
          setErrorMessage(
            `Distribusi #${idx + 1} harus diawali dengan http:// atau https://`,
          );
          return;
        }
      }
    }

    const tech_stack = techStackText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const media_urls = mediaUrlsText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const payload: StoreKaryaPayload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      version: version.trim() || null,
      description: description.trim() || null,
      creators: creators.trim() || null,
      category,
      tech_stack: tech_stack.length > 0 ? tech_stack : undefined,
      media_urls: media_urls.length > 0 ? media_urls : undefined,
      live_url: liveUrl.trim() || null,
      repo_url: repoUrl.trim() || null,
      distributions: distributions.length > 0 ? distributions : null,
      is_featured: isFeatured,
      status,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Gagal menyimpan karya.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Formulir Kelola Karya"
      className="space-y-6 rounded-2xl border-2 border-white/20 bg-[#190d38] p-5 sm:p-7 text-white"
    >
      <div className="border-b border-white/15 pb-4">
        <h3 className="font-display text-xl uppercase tracking-wider text-arcade-yellow">
          {initialData ? "Edit Karya & Game" : "Tambah Karya Baru"}
        </h3>
        <p className="mt-1 text-xs text-white/70">
          Lengkapi informasi profil karya, media, serta jalur distribusi akses game.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/50 bg-red-950/60 p-3.5 text-xs font-semibold text-red-200"
        >
          {errorMessage}
        </div>
      )}

      {/* Main Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="karya-title" className="block font-display text-xs text-white/80">
            Judul Karya <span className="text-red-400">*</span>
          </label>
          <input
            id="karya-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="contoh: Cyber Runner 2099"
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-medium text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>

        <div>
          <label htmlFor="karya-slug" className="block font-display text-xs text-white/80">
            Slug Kustom (Opsional)
          </label>
          <input
            id="karya-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="cyber-runner-2099"
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-mono text-xs text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>

        <div>
          <label htmlFor="karya-version" className="block font-display text-xs text-white/80">
            Versi Game / Release (Opsional)
          </label>
          <input
            id="karya-version"
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="contoh: 1.0.0"
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-mono text-xs text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>

        <div>
          <label htmlFor="karya-category" className="block font-display text-xs text-white/80">
            Kategori Karya <span className="text-red-400">*</span>
          </label>
          <select
            id="karya-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as KaryaCategory)}
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-medium text-white outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="karya-creators" className="block font-display text-xs text-white/80">
            Nama Kreator / Tim Siswa
          </label>
          <input
            id="karya-creators"
            type="text"
            value={creators}
            onChange={(e) => setCreators(e.target.value)}
            placeholder="contoh: Tim RPL Cyber"
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-medium text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="karya-desc" className="block font-display text-xs text-white/80">
          Deskripsi Karya
        </label>
        <textarea
          id="karya-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan konsep, fitur utama, dan gameplay karya..."
          className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
        />
      </div>

      {/* Legacy live_url and repo_url */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="karya-live-url" className="block font-display text-xs text-white/80">
            Live URL Demo (Legacy Fallback)
          </label>
          <input
            id="karya-live-url"
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://demo.example.com"
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-mono text-xs text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>

        <div>
          <label htmlFor="karya-repo-url" className="block font-display text-xs text-white/80">
            Repository Source Code
          </label>
          <input
            id="karya-repo-url"
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-mono text-xs text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>
      </div>

      {/* Tech Stack & Media */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="karya-tech-stack" className="block font-display text-xs text-white/80">
            Tech Stack (Pisahkan dengan koma)
          </label>
          <input
            id="karya-tech-stack"
            type="text"
            value={techStackText}
            onChange={(e) => setTechStackText(e.target.value)}
            placeholder="Next.js, Godot, TypeScript"
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>

        <div>
          <label htmlFor="karya-media-urls" className="block font-display text-xs text-white/80">
            Media URLs (1 URL per baris; #1 Artwork, #2 Logo)
          </label>
          <textarea
            id="karya-media-urls"
            rows={2}
            value={mediaUrlsText}
            onChange={(e) => setMediaUrlsText(e.target.value)}
            placeholder="/images/game-1.png&#10;/images/game-1-logo.png"
            className="mt-1 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 font-mono text-xs text-white placeholder-white/40 outline-none focus:border-arcade-yellow focus:ring-2 focus:ring-arcade-yellow/50"
          />
        </div>
      </div>

      {/* Multi-Distribution Editor */}
      <DistributionEditor
        distributions={distributions}
        onChange={setDistributions}
        disabled={isSubmitting}
      />

      {/* Status & Featured Checkbox */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-white/30 bg-black/60 text-arcade-yellow focus:ring-arcade-yellow"
          />
          <span className="font-display text-xs font-semibold text-white uppercase">
            Tampilkan sebagai Featured Showcase
          </span>
        </label>

        <div className="flex items-center gap-2">
          <label htmlFor="karya-status" className="font-display text-xs text-white/80">
            Status:
          </label>
          <select
            id="karya-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="rounded-lg border border-white/20 bg-black/60 px-3 py-1.5 font-body text-xs text-white outline-none focus:border-arcade-yellow"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-white/30 bg-black/40 px-5 py-2 font-display text-xs font-bold text-white hover:bg-white/10 disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-arcade-yellow px-7 py-2 font-display text-sm font-bold text-arcade-ink shadow-[3px_3px_0_var(--arcade-yellow-shadow)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Menyimpan..." : initialData ? "Simpan Perubahan →" : "Buat Karya →"}
        </button>
      </div>
    </form>
  );
}
