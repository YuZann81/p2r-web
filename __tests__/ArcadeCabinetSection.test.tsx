import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArcadeCabinetSection from "@/components/ArcadeCabinetSection";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("ArcadeCabinetSection (Hybrid Layering Categories)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders hybrid layers and the 6 category slots in 3x2 grid", () => {
    const { container } = render(<ArcadeCabinetSection />);

    // Marquee HTML title
    expect(
      screen.getByRole("heading", { level: 2, name: /karya pameran rpl/i }),
    ).toBeInTheDocument();

    // Hybrid Layering assets
    expect(container.querySelector('img[src="/assets/background.svg"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/cabinet-body.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/screen-glare.svg"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/joystick.png"]')).toBeInTheDocument();
    // 2 buttons on left + 1 Kunjungi button on right = 3 buttons
    expect(container.querySelectorAll('img[src="/assets/button.png"]')).toHaveLength(3);

    // Only category items are displayed (Website, Game, Software, IoT & Hardware, Digital Art, Semua Karya)
    expect(screen.getByRole("link", { name: "Website" })).toHaveAttribute(
      "href",
      "/karya?category=website",
    );
    expect(screen.getByRole("link", { name: "Game" })).toHaveAttribute("href", "/games");
    expect(screen.getByRole("link", { name: "Software" })).toHaveAttribute(
      "href",
      "/karya?category=software",
    );
    expect(screen.getByRole("link", { name: "IoT & Hardware" })).toHaveAttribute(
      "href",
      "/karya?category=hardware_robotics",
    );
    expect(screen.getByRole("link", { name: "Digital Art" })).toHaveAttribute(
      "href",
      "/karya?category=digital_art",
    );
    expect(screen.getByRole("link", { name: "Semua Karya" })).toHaveAttribute("href", "/karya");
  });

  it("keeps joystick non-interactive to mouse/touch and tilts only via side buttons", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ArcadeCabinetSection />);

    const joystickImg = screen.getByAltText("Joystick Arcade");
    const joystickWrapper = joystickImg.parentElement as HTMLElement;

    // Joystick has pointer-events-none and cannot be clicked or dragged directly
    expect(joystickWrapper).toHaveClass("pointer-events-none");
    fireEvent.pointerDown(joystickWrapper, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(joystickWrapper, { clientX: 150, clientY: 100 });
    expect(joystickImg).toHaveStyle({
      transform: "rotate(0.0deg) translateY(0.0%) scaleY(1.000)",
    });
    expect(screen.getByRole("link", { name: "Website" })).toHaveAttribute("data-active", "true");

    // Click right button -> tilts joystick right & selects Game (slot 1)
    await user.click(screen.getByRole("button", { name: /geser pilihan ke kanan/i }));
    expect(joystickImg).toHaveStyle({
      transform: "rotate(22.0deg) translateY(0.0%) scaleY(1.000)",
    });
    expect(screen.getByRole("link", { name: "Game" })).toHaveAttribute("data-active", "true");

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(joystickImg).toHaveStyle({
      transform: "rotate(0.0deg) translateY(0.0%) scaleY(1.000)",
    });

    // Click Kunjungi button -> navigates to /games
    await user.click(screen.getByRole("button", { name: /kunjungi kategori game/i }));
    expect(mockPush).toHaveBeenCalledWith("/games");

    // Click left button twice -> tilts left & wraps from slot 1 -> slot 0 -> slot 5 (Semua Karya)
    await user.click(screen.getByRole("button", { name: /geser pilihan ke kiri/i }));
    expect(joystickImg).toHaveStyle({
      transform: "rotate(-22.0deg) translateY(0.0%) scaleY(1.000)",
    });
    await user.click(screen.getByRole("button", { name: /geser pilihan ke kiri/i }));
    expect(screen.getByRole("link", { name: "Semua Karya" })).toHaveAttribute("data-active", "true");

    jest.useRealTimers();
  });

  it("supports keyboard navigation and Enter on cabinet stage", () => {
    render(<ArcadeCabinetSection />);

    const stage = screen.getByRole("region", { name: /mesin arcade kategori karya/i });
    const joystickImg = screen.getByAltText("Joystick Arcade");

    fireEvent.keyDown(stage, { key: "ArrowRight" });
    expect(joystickImg).toHaveStyle({
      transform: "rotate(22.0deg) translateY(0.0%) scaleY(1.000)",
    });
    expect(screen.getByRole("link", { name: "Game" })).toHaveAttribute("data-active", "true");

    fireEvent.keyUp(stage, { key: "ArrowRight" });
    expect(joystickImg).toHaveStyle({
      transform: "rotate(0.0deg) translateY(0.0%) scaleY(1.000)",
    });

    fireEvent.keyDown(stage, { key: "ArrowDown" });
    expect(screen.getByRole("link", { name: "Digital Art" })).toHaveAttribute("data-active", "true");

    fireEvent.keyDown(stage, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/karya?category=digital_art");
  });
});
