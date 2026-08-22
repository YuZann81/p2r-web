import { fireEvent, render, screen } from "@testing-library/react";
import GameDirectoryClient from "@/components/GameDirectoryClient";

const mockGames = [
  {
    id: "game-1",
    name: "Cyber Runner 2099",
    description: "High speed endless cyberpunk runner.",
    image: "/images/game-1.png",
    imageAlt: "Cyber Runner 2099 artwork",
    logo: "/images/game-1-logo.png",
    logoAlt: "Cyber Runner 2099 logo",
  },
  {
    id: "game-2",
    name: "Byte Defender",
    description: "Defend your core server from malware.",
    image: "/images/game-2.png",
    imageAlt: "Byte Defender artwork",
    logo: "/images/game-2-logo.png",
    logoAlt: "Byte Defender logo",
  },
  {
    id: "game-3",
    name: "Neon Highway",
    description: "Retro synthwave racing tournament.",
    image: "/images/game-3.png",
    imageAlt: "Neon Highway artwork",
    logo: "/images/game-3-logo.png",
    logoAlt: "Neon Highway logo",
  },
];

describe("GameDirectoryClient Component", () => {
  it("renders all initial games and counter", () => {
    render(<GameDirectoryClient initialGames={mockGames} />);

    expect(
      screen.getByText("Menampilkan 3 dari 3 Game"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cyber Runner 2099")).toBeInTheDocument();
    expect(screen.getByText("Byte Defender")).toBeInTheDocument();
    expect(screen.getByText("Neon Highway")).toBeInTheDocument();
  });

  it("filters games by title in real-time", () => {
    render(<GameDirectoryClient initialGames={mockGames} />);
    const searchInput = screen.getByLabelText(/cari game arcade/i);

    fireEvent.change(searchInput, { target: { value: "Byte" } });

    expect(
      screen.getByText("Menampilkan 1 dari 3 Game"),
    ).toBeInTheDocument();
    expect(screen.getByText("Byte Defender")).toBeInTheDocument();
    expect(screen.queryByText("Cyber Runner 2099")).not.toBeInTheDocument();
    expect(screen.queryByText("Neon Highway")).not.toBeInTheDocument();
  });

  it("filters games by description keyword", () => {
    render(<GameDirectoryClient initialGames={mockGames} />);
    const searchInput = screen.getByLabelText(/cari game arcade/i);

    fireEvent.change(searchInput, { target: { value: "synthwave" } });

    expect(
      screen.getByText("Menampilkan 1 dari 3 Game"),
    ).toBeInTheDocument();
    expect(screen.getByText("Neon Highway")).toBeInTheDocument();
    expect(screen.queryByText("Cyber Runner 2099")).not.toBeInTheDocument();
  });

  it("renders empty search result state and resets search on button click", () => {
    render(<GameDirectoryClient initialGames={mockGames} />);
    const searchInput = screen.getByLabelText(/cari game arcade/i);

    fireEvent.change(searchInput, { target: { value: "NonExistentGame123" } });

    expect(
      screen.getByText(/tidak ada game yang cocok/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tidak ditemukan game dengan kata kunci/i),
    ).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset pencarian/i });
    fireEvent.click(resetButton);

    expect(
      screen.getByText("Menampilkan 3 dari 3 Game"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cyber Runner 2099")).toBeInTheDocument();
  });

  it("renders empty initial state when no games are available", () => {
    render(<GameDirectoryClient initialGames={[]} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /belum ada game yang tersedia/i,
      }),
    ).toBeInTheDocument();
  });
});
