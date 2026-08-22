import { fireEvent, render, screen } from "@testing-library/react";
import KaryaDirectory from "@/components/KaryaDirectory";
import type { KaryaDetail } from "@/lib/api/types/karya";

const mockKaryas: KaryaDetail[] = [
  {
    id: "karya-1",
    title: "Cyber Runner 2099",
    slug: "cyber-runner-2099",
    description: "Fast paced endless runner game.",
    creators: "Tim Game RPL",
    category: "game",
    tech_stack: ["Phaser.js", "WebAudio"],
    media_urls: ["/images/game-1.png"],
    live_url: "https://play.example.com",
    repo_url: null,
    is_featured: true,
    status: "published",
    votes_count: 99,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
  {
    id: "karya-2",
    title: "Smart Attendance IoT",
    slug: "smart-attendance-iot",
    description: "Sistem presensi berbasis RFID dan sensor ESP32.",
    creators: "Tim IoT RPL",
    category: "hardware_robotics",
    tech_stack: ["ESP32", "C++", "MQTT"],
    media_urls: ["/images/game-2.png"],
    live_url: null,
    repo_url: "https://github.com/example/iot",
    is_featured: false,
    status: "published",
    votes_count: 42,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
  {
    id: "karya-3",
    title: "Virtual Pixel Gallery",
    slug: "virtual-pixel-gallery",
    description: "Galeri seni digital 3D berbasis WebGL.",
    creators: "Studio Seni Digital",
    category: "digital_art",
    tech_stack: ["Three.js", "WebGL"],
    media_urls: ["/images/game-1.png"],
    live_url: "https://art.example.com",
    repo_url: null,
    is_featured: true,
    status: "published",
    votes_count: 55,
    created_at: null,
    updated_at: null,
    is_voted_by_me: "0",
  },
];

describe("KaryaDirectory Component", () => {
  it("renders all initial karyas and dynamic counter", () => {
    render(<KaryaDirectory initialKaryas={mockKaryas} />);

    expect(screen.getByText("Menampilkan 3 dari 3 Karya")).toBeInTheDocument();
    expect(screen.getByText("Cyber Runner 2099")).toBeInTheDocument();
    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument();
    expect(screen.getByText("Virtual Pixel Gallery")).toBeInTheDocument();
  });

  it("filters karya list by category tab", () => {
    render(<KaryaDirectory initialKaryas={mockKaryas} />);

    const iotTab = screen.getByRole("tab", { name: "IoT & Hardware" });
    fireEvent.click(iotTab);

    expect(screen.getByText("Menampilkan 1 dari 3 Karya")).toBeInTheDocument();
    expect(screen.getByText("Smart Attendance IoT")).toBeInTheDocument();
    expect(screen.queryByText("Cyber Runner 2099")).not.toBeInTheDocument();
  });

  it("filters karya list by search keyword in real-time", () => {
    render(<KaryaDirectory initialKaryas={mockKaryas} />);
    const searchInput = screen.getByLabelText(/cari karya inovasi/i);

    fireEvent.change(searchInput, { target: { value: "WebGL" } });

    expect(screen.getByText("Menampilkan 1 dari 3 Karya")).toBeInTheDocument();
    expect(screen.getByText("Virtual Pixel Gallery")).toBeInTheDocument();
    expect(screen.queryByText("Cyber Runner 2099")).not.toBeInTheDocument();
  });

  it("shows empty search state and resets search correctly", () => {
    render(<KaryaDirectory initialKaryas={mockKaryas} />);
    const searchInput = screen.getByLabelText(/cari karya inovasi/i);

    fireEvent.change(searchInput, { target: { value: "UnknownTech99" } });

    expect(screen.getByText(/tidak ada karya yang cocok/i)).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset pencarian/i });
    fireEvent.click(resetButton);

    expect(screen.getByText("Menampilkan 3 dari 3 Karya")).toBeInTheDocument();
    expect(screen.getByText("Cyber Runner 2099")).toBeInTheDocument();
  });

  it("renders empty state when initial karyas array is empty", () => {
    render(<KaryaDirectory initialKaryas={[]} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /belum ada karya yang tersedia/i,
      }),
    ).toBeInTheDocument();
  });
});
