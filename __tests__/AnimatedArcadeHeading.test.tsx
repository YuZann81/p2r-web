import { render, screen, act } from "@testing-library/react";
import AnimatedArcadeHeading from "@/components/AnimatedArcadeHeading";

describe("AnimatedArcadeHeading", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.clearAllTimers();
    });
    jest.useRealTimers();
  });

  it("renders the initial phrase 'PAGE NOT FOUND'", () => {
    render(<AnimatedArcadeHeading />);
    expect(
      screen.getByRole("heading", { level: 1, name: "PAGE NOT FOUND" }),
    ).toBeInTheDocument();
  });

  it("cycles to subsequent phrases after cycle interval and completes transition", () => {
    render(<AnimatedArcadeHeading />);

    // Fast-forward to next phrase trigger (3500ms) + transition completion (700ms)
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    // During transition
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "404 ERROR" }),
    ).toBeInTheDocument();

    // Advance to next phrase: LEVEL NOT FOUND
    act(() => {
      jest.advanceTimersByTime(3500 + 700);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "LEVEL NOT FOUND" }),
    ).toBeInTheDocument();
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

    expect(
      screen.getByRole("heading", { level: 1, name: "PAGE NOT FOUND" }),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Should remain on PAGE NOT FOUND without cycling
    expect(
      screen.getByRole("heading", { level: 1, name: "PAGE NOT FOUND" }),
    ).toBeInTheDocument();
  });
});
