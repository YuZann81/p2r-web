import { render, screen } from "@testing-library/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Hero from "@/components/Hero";

function mockMatchMedia(matchesByQuery: Record<string, boolean>) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: Boolean(matchesByQuery[query]),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

describe("Hero", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders required eyebrow, headline, description, and single intact 3D P2R logo", () => {
    mockMatchMedia({});
    render(<Hero />);

    expect(
      screen.getByText(
        /SMKN 1 KATAPANG · REKAYASA PERANGKAT LUNAK · EXHIBITION VOL\. 01/i,
      ),
    ).toBeInTheDocument();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/FROM PIXEL/i);
    expect(heading).toHaveTextContent(/TO REALITY\./i);

    expect(
      screen.getByText(
        /Pameran karya siswa Rekayasa Perangkat Lunak yang menghadirkan game, aplikasi, dan inovasi digital interaktif\./i,
      ),
    ).toBeInTheDocument();

    const logo = screen.getByAltText("Pixel To Reality 3D Logo");
    expect(logo).toBeInTheDocument();
  });

  it("wires Primary CTA to #karya-arcade and Secondary CTA to #games", () => {
    mockMatchMedia({});
    render(<Hero />);

    const primaryCta = screen.getByRole("link", { name: "Jelajahi Karya" });
    expect(primaryCta).toHaveAttribute("href", "#karya-arcade");

    const secondaryCta = screen.getByRole("link", { name: "Mainkan Game" });
    expect(secondaryCta).toHaveAttribute("href", "#games");
  });

  it("renders corridor exhibit links when games are provided", () => {
    mockMatchMedia({});
    render(
      <Hero
        games={[
          {
            id: "pixeltype",
            name: "PixelType",
            description: "Typing arcade game",
            image: "/images/game-1.png",
            imageAlt: "PixelType",
            logo: "/images/game-1-logo.png",
            logoAlt: "PixelType",
          },
          {
            id: "save-the-savanna",
            name: "Save The Savanna",
            description: "Godot adventure game",
            image: "/images/game-1.png",
            imageAlt: "Save The Savanna",
            logo: "/images/game-1-logo.png",
            logoAlt: "Save The Savanna",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Lihat karya game PixelType" }),
    ).toHaveAttribute("href", "/games/pixeltype");
    expect(
      screen.getByRole("link", { name: "Lihat karya game Save The Savanna" }),
    ).toHaveAttribute("href", "/games/save-the-savanna");
  });

  it("skips GSAP timeline and SplitText when prefers-reduced-motion is enabled", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    const timelineSpy = jest.spyOn(gsap, "timeline");
    const splitSpy = jest.spyOn(SplitText, "create");

    render(<Hero />);

    expect(timelineSpy).not.toHaveBeenCalled();
    expect(splitSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(screen.getByRole("link", { name: "Jelajahi Karya" })).toBeVisible();
  });

  it("splits both headline lines with accessible aria and reverts cleanly on unmount", () => {
    mockMatchMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(hover: hover) and (pointer: fine)": true,
    });
    const splitSpy = jest.spyOn(SplitText, "create");

    const { container, unmount } = render(<Hero />);

    expect(splitSpy).toHaveBeenCalledTimes(2);
    expect(splitSpy).toHaveBeenNthCalledWith(
      1,
      expect.any(HTMLElement),
      expect.objectContaining({ type: "words,chars", aria: "auto" }),
    );
    expect(splitSpy).toHaveBeenNthCalledWith(
      2,
      expect.any(HTMLElement),
      expect.objectContaining({ type: "words,chars", aria: "auto" }),
    );

    const line1 = container.querySelector('[data-hero-headline-line="1"]');
    const line2 = container.querySelector('[data-hero-headline-line="2"]');
    expect(line1).toHaveAttribute("aria-label", "FROM PIXEL");
    expect(line2).toHaveAttribute("aria-label", "TO REALITY.");
    expect(line1?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(line2?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();

    unmount();
  });

  it("initializes GSAP matchMedia on mount and reverts cleanly on unmount", () => {
    mockMatchMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(hover: hover) and (pointer: fine)": true,
    });
    const revertSpy = jest.fn();
    const addSpy = jest.fn();
    const mmSpy = jest.spyOn(gsap, "matchMedia").mockReturnValue({
      add: addSpy,
      revert: revertSpy,
    } as unknown as gsap.MatchMedia);

    const { unmount } = render(<Hero />);
    expect(mmSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledTimes(1);

    unmount();
    expect(revertSpy).toHaveBeenCalledTimes(1);
  });

  it("disables pointer quickTo parallax on touch devices", () => {
    mockMatchMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(hover: hover) and (pointer: fine)": false,
    });
    const quickToSpy = jest.spyOn(gsap, "quickTo");

    render(<Hero />);

    expect(quickToSpy).not.toHaveBeenCalled();
  });
});
