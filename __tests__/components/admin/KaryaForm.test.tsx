import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import KaryaForm from "@/components/admin/KaryaForm";
import type { KaryaDetail } from "@/lib/api/types/karya";

const sampleKarya: KaryaDetail = {
  id: "karya-uuid-1",
  title: "Cyber Runner 2099",
  slug: "cyber-runner-2099",
  version: "1.2.0",
  description: "Retro cyberpunk runner game.",
  creators: "Tim RPL Dev",
  category: "game",
  tech_stack: ["Phaser", "TypeScript"],
  media_urls: ["/images/game-1.png", "/images/game-1-logo.png"],
  live_url: "https://demo.example.com",
  repo_url: "https://github.com/example/cyber-runner",
  distributions: [
    {
      platform: "windows",
      type: "download",
      url: "https://example.com/build.zip",
    },
  ],
  is_featured: true,
  status: "published",
  votes_count: 10,
  created_at: "2026-08-20T10:00:00Z",
  updated_at: "2026-08-20T10:00:00Z",
};

describe("KaryaForm Component", () => {
  it("renders existing karya data and distributions properly", () => {
    const onSubmit = jest.fn();

    render(<KaryaForm initialData={sampleKarya} onSubmit={onSubmit} />);

    expect(screen.getByDisplayValue("Cyber Runner 2099")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1.2.0")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tim RPL Dev")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com/build.zip")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Simpan Perubahan/i })).toBeInTheDocument();
  });

  it("submits the correct normalized payload when submitted", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<KaryaForm initialData={sampleKarya} onSubmit={onSubmit} />);

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Cyber Runner 2099",
      slug: "cyber-runner-2099",
      version: "1.2.0",
      description: "Retro cyberpunk runner game.",
      creators: "Tim RPL Dev",
      category: "game",
      tech_stack: ["Phaser", "TypeScript"],
      media_urls: ["/images/game-1.png", "/images/game-1-logo.png"],
      live_url: "https://demo.example.com",
      repo_url: "https://github.com/example/cyber-runner",
      distributions: [
        {
          platform: "windows",
          type: "download",
          url: "https://example.com/build.zip",
        },
      ],
      is_featured: true,
      status: "published",
    });
  });

  it("shows error and prevents submission when a distribution has an empty URL", async () => {
    const onSubmit = jest.fn();

    render(
      <KaryaForm
        initialData={{
          ...sampleKarya,
          distributions: [
            {
              platform: "web",
              type: "web_external",
              url: "",
            },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    const form = screen.getByRole("form", { name: /Formulir Kelola Karya/i });
    fireEvent.submit(form);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /memerlukan URL yang valid/i,
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits null distributions when all distributions are removed", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <KaryaForm
        initialData={{
          ...sampleKarya,
          distributions: [],
        }}
        onSubmit={onSubmit}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          distributions: null,
        }),
      );
    });
  });
});
