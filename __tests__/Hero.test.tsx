import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

describe("Hero", () => {
  it("renders required eyebrow, headline, description, and single intact 3D P2R logo", () => {
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
    render(<Hero />);

    const primaryCta = screen.getByRole("link", { name: "Jelajahi Karya" });
    expect(primaryCta).toHaveAttribute("href", "#karya-arcade");

    const secondaryCta = screen.getByRole("link", { name: "Mainkan Game" });
    expect(secondaryCta).toHaveAttribute("href", "#games");
  });

  it("renders corridor exhibit links when games are provided", () => {
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
});
