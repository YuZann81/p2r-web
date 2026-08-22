import { fireEvent, render, screen } from "@testing-library/react";
import LeaderboardClient from "@/components/LeaderboardClient";
import type {
  LeaderboardEntry,
  KaryaLeaderboardEntry,
} from "@/lib/api/types/leaderboard";

const mockEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    playerName: "CyberKnight",
    gameName: "Cyber Runner 2099",
    score: 98500,
  },
  {
    rank: 2,
    playerName: "PixelQueen",
    gameName: "Byte Defender",
    score: 87200,
  },
  {
    rank: 3,
    playerName: "NeonRider",
    gameName: "Neon Highway",
    score: 76450,
  },
  {
    rank: 4,
    playerName: "RetroWizard",
    gameName: "Cyber Runner 2099",
    score: 65100,
  },
];

const mockKaryas: KaryaLeaderboardEntry[] = [
  {
    rank: 1,
    karyaTitle: "Smart Attendance IoT",
    category: "hardware_robotics",
    votesCount: 150,
    slug: "smart-attendance-iot",
  },
  {
    rank: 2,
    karyaTitle: "Cyber Runner 2099",
    category: "game",
    votesCount: 120,
    slug: "cyber-runner-2099",
  },
];

describe("LeaderboardClient Component", () => {
  it("renders game scores tab by default with game filter buttons", () => {
    render(
      <LeaderboardClient
        mode="live"
        initialEntries={mockEntries}
        initialKaryaRankings={mockKaryas}
      />,
    );

    expect(screen.getByText("Klasemen Game Arcade")).toBeInTheDocument();
    expect(screen.getByText("Semua Game (Global)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cyber Runner 2099" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Byte Defender" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Neon Highway" }),
    ).toBeInTheDocument();
  });

  it("filters game scores by specific game chip", () => {
    render(
      <LeaderboardClient
        mode="live"
        initialEntries={mockEntries}
        initialKaryaRankings={mockKaryas}
      />,
    );

    const byteDefenderBtn = screen.getByRole("button", {
      name: "Byte Defender",
    });
    fireEvent.click(byteDefenderBtn);

    expect(screen.getByText("Menampilkan 1 dari 4 Skor")).toBeInTheDocument();
    expect(screen.getAllByText("PixelQueen").length).toBeGreaterThan(0);
    expect(screen.queryByText("NeonRider")).not.toBeInTheDocument();
  });

  it("filters player name via search input", () => {
    render(
      <LeaderboardClient
        mode="live"
        initialEntries={mockEntries}
        initialKaryaRankings={mockKaryas}
      />,
    );

    const searchInput = screen.getByLabelText(/cari pemain arcade/i);
    fireEvent.change(searchInput, { target: { value: "Retro" } });

    expect(screen.getByText("Menampilkan 1 dari 4 Skor")).toBeInTheDocument();
    expect(screen.getAllByText("RetroWizard").length).toBeGreaterThan(0);
    expect(screen.queryByText("CyberKnight")).not.toBeInTheDocument();
  });

  it("switches to Karya Votes tab and renders karya rankings", () => {
    render(
      <LeaderboardClient
        mode="live"
        initialEntries={mockEntries}
        initialKaryaRankings={mockKaryas}
      />,
    );

    const karyaTab = screen.getByRole("tab", {
      name: /ranking voting karya/i,
    });
    fireEvent.click(karyaTab);

    expect(
      screen.getByRole("columnheader", { name: /karya inovasi/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /perolehan vote/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument();
    expect(screen.getByText("150 VOTES")).toBeInTheDocument();
  });

  it("filters karya rankings via search input on karya tab", () => {
    render(
      <LeaderboardClient
        mode="live"
        initialEntries={mockEntries}
        initialKaryaRankings={mockKaryas}
      />,
    );

    const karyaTab = screen.getByRole("tab", {
      name: /ranking voting karya/i,
    });
    fireEvent.click(karyaTab);

    const searchInput = screen.getByLabelText(/cari karya pada leaderboard/i);
    fireEvent.change(searchInput, { target: { value: "Attendance" } });

    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument();
    expect(screen.queryByText("Cyber Runner 2099")).not.toBeInTheDocument();
  });
});
