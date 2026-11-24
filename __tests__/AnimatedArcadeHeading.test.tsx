import { render, screen, act } from "@testing-library/react";
import AnimatedArcadeHeading from "@/components/AnimatedArcadeHeading";

describe("AnimatedArcadeHeading", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    jest.useFakeTimers();
    window.matchMedia = originalMatchMedia;
  });

  afterEach(() => {
    act(() => {
      jest.clearAllTimers();
    });
    jest.useRealTimers();
    window.matchMedia = originalMatchMedia;
  });

  it("renders a stable screen-reader heading without aria-live and an aria-hidden visual span", () => {
    render(<AnimatedArcadeHeading />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "PAGE NOT FOUND",
    });
    expect(heading).toBeInTheDocument();
    expect(heading).not.toHaveAttribute("aria-live");

    const visual = screen.getByTestId("animated-arcade-heading-visual");
    expect(visual).toHaveAttribute("aria-hidden", "true");
    expect(visual).toHaveTextContent("PAGE NOT FOUND");
  });

  it("cycles the visual phrase while keeping the accessible heading name stable", () => {
    render(<AnimatedArcadeHeading />);

    act(() => {
      jest.advanceTimersByTime(3500);
    });
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(screen.getByTestId("animated-arcade-heading-visual")).toHaveTextContent(
      "404 ERROR",
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "PAGE NOT FOUND" }),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3500 + 700);
    });

    expect(screen.getByTestId("animated-arcade-heading-visual")).toHaveTextContent(
      "LEVEL NOT FOUND",
    );
  });

  it("respects prefers-reduced-motion and stays static", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<AnimatedArcadeHeading />);

    expect(screen.getByTestId("animated-arcade-heading-visual")).toHaveTextContent(
      "PAGE NOT FOUND",
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByTestId("animated-arcade-heading-visual")).toHaveTextContent(
      "PAGE NOT FOUND",
    );
  });

  it("clears both cycle and scramble timers cleanly on unmount", () => {
    const { unmount } = render(<AnimatedArcadeHeading />);

    // Enter mid-scramble state
    act(() => {
      jest.advanceTimersByTime(3500 + 90);
    });

    unmount();

    // Advancing timers after unmount should not throw or leave active timers
    expect(jest.getTimerCount()).toBe(0);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
  });
});
