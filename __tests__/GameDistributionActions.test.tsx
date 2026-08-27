import React from "react";
import { render, screen } from "@testing-library/react";
import KaryaDetailView from "@/components/KaryaDetailView";
import type { KaryaDetail } from "@/lib/api/types/karya";

// Mock GamePlaySession and VoteButton for isolated testing of KaryaDetailView actions
jest.mock("@/components/GamePlaySession", () => {
  return function MockGamePlaySession({ gameSlug }: { gameSlug: string }) {
    return <div data-testid="gameplay-session">GamePlaySession:{gameSlug}</div>;
  };
});

jest.mock("@/components/VoteButton", () => {
  return function MockVoteButton() {
    return <button data-testid="vote-button">Vote</button>;
  };
});

const baseKarya: KaryaDetail = {
  id: "test-game-1",
  title: "Cyber Strike 2026",
  slug: "cyber-strike-2026",
  description: "A retro cyberpunk action game.",
  creators: "Tim RPL Dev",
  category: "game",
  tech_stack: ["Godot", "WebAssembly"],
  media_urls: ["/images/game-1.png", "/images/game-1-logo.png"],
  live_url: null,
  repo_url: null,
  is_featured: true,
  status: "published",
  votes_count: 50,
  created_at: null,
  updated_at: null,
  is_voted_by_me: false,
};

describe("KaryaDetailView Game Distribution Actions", () => {
  it("renders GamePlaySession when p2r_arcade is true in capabilities", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      capabilities: { p2r_arcade: true, scores: true, leaderboard: true },
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    expect(screen.getByTestId("gameplay-session")).toBeInTheDocument();
  });

  it("renders GamePlaySession when distributions includes type p2r_arcade", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      distributions: [{ platform: "web", type: "p2r_arcade" }],
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    expect(screen.getByTestId("gameplay-session")).toBeInTheDocument();
  });

  it("does NOT render GamePlaySession when category is game but p2r_arcade is false/absent", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      category: "game",
      capabilities: { p2r_arcade: false, scores: true, leaderboard: true },
      distributions: [
        {
          platform: "web",
          type: "web_external",
          url: "https://itch.io/game",
        },
      ],
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    expect(screen.queryByTestId("gameplay-session")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mainkan web/i })).toBeInTheDocument();
  });

  it("renders web_external action with correct label, URL, target=_blank, and rel=noopener noreferrer", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      distributions: [
        {
          platform: "web",
          type: "web_external",
          url: "https://itch.io/cyber-strike",
        },
      ],
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    const webLink = screen.getByRole("link", { name: /mainkan web/i });
    expect(webLink).toBeInTheDocument();
    expect(webLink).toHaveAttribute("href", "https://itch.io/cyber-strike");
    expect(webLink).toHaveAttribute("target", "_blank");
    expect(webLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders platform-specific download labels for Windows, Android, Linux, and macOS", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      distributions: [
        {
          platform: "windows",
          type: "download",
          url: "https://downloads.example.com/game-win.zip",
        },
        {
          platform: "android",
          type: "download",
          url: "https://downloads.example.com/game.apk",
        },
        {
          platform: "linux",
          type: "download",
          url: "https://downloads.example.com/game-linux.tar.gz",
        },
        {
          platform: "macos",
          type: "download",
          url: "https://downloads.example.com/game-mac.dmg",
        },
      ],
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    const winLink = screen.getByRole("link", { name: /download windows/i });
    expect(winLink).toHaveAttribute(
      "href",
      "https://downloads.example.com/game-win.zip",
    );
    expect(winLink).toHaveAttribute("target", "_blank");
    expect(winLink).toHaveAttribute("rel", "noopener noreferrer");

    const androidLink = screen.getByRole("link", { name: /download android/i });
    expect(androidLink).toHaveAttribute(
      "href",
      "https://downloads.example.com/game.apk",
    );

    const linuxLink = screen.getByRole("link", { name: /download linux/i });
    expect(linuxLink).toHaveAttribute(
      "href",
      "https://downloads.example.com/game-linux.tar.gz",
    );

    const macLink = screen.getByRole("link", { name: /download macos/i });
    expect(macLink).toHaveAttribute(
      "href",
      "https://downloads.example.com/game-mac.dmg",
    );
  });

  it("renders multiple distributions simultaneously (web + windows + android + repo)", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      repo_url: "https://github.com/example/cyber-strike",
      distributions: [
        {
          platform: "web",
          type: "web_external",
          url: "https://play.example.com",
        },
        {
          platform: "windows",
          type: "download",
          url: "https://download.example.com/win.zip",
        },
        {
          platform: "android",
          type: "download",
          url: "https://download.example.com/app.apk",
        },
      ],
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    expect(screen.getByRole("link", { name: /mainkan web/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /download windows/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /download android/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /source code repo/i }),
    ).toBeInTheDocument();
  });

  it("preserves both GamePlaySession and download actions when p2r_arcade and download coexist", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      distributions: [
        { platform: "web", type: "p2r_arcade" },
        {
          platform: "windows",
          type: "download",
          url: "https://example.com/win.zip",
        },
      ],
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    expect(screen.getByTestId("gameplay-session")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /download windows/i }),
    ).toBeInTheDocument();
  });

  it("does not crash and renders gracefully when distributions is null or empty", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      distributions: null,
      live_url: null,
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    expect(screen.queryByTestId("gameplay-session")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /mainkan/i })).not.toBeInTheDocument();
  });

  it("falls back to legacy live_url when distributions is empty but live_url exists", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      distributions: null,
      live_url: "https://legacy.example.com",
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    const legacyLink = screen.getByRole("link", {
      name: /mainkan \/ buka live demo/i,
    });
    expect(legacyLink).toBeInTheDocument();
    expect(legacyLink).toHaveAttribute("href", "https://legacy.example.com");
  });

  it("filters out unsafe URL schemes like javascript: or data:", () => {
    const karya: KaryaDetail = {
      ...baseKarya,
      distributions: [
        {
          platform: "web",
          type: "web_external",
          url: "javascript:alert(1)",
        },
        {
          platform: "windows",
          type: "download",
          url: "data:application/zip;base64,...",
        },
      ],
    };

    render(
      <KaryaDetailView
        karya={karya}
        backHref="/games"
        backLabel="← Kembali ke Direktori Game"
      />,
    );

    expect(screen.queryByRole("link", { name: /mainkan web/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /download windows/i }),
    ).not.toBeInTheDocument();
  });
});
