import { render, screen } from "@testing-library/react";
import PixelTransitionDivider, {
  buildStaticPixelBorder,
} from "@/components/PixelTransitionDivider";

describe("PixelTransitionDivider", () => {
  it("renders a static aria-hidden SVG divider with square pixel blocks", () => {
    render(<PixelTransitionDivider />);

    const divider = screen.getByTestId("static-pixel-divider");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider.querySelector("canvas")).not.toBeInTheDocument();

    const rects = divider.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(100);
    rects.forEach((rect) => {
      expect(rect.getAttribute("width")).toBe(rect.getAttribute("height"));
    });
  });

  it("generates deterministic square blocks strictly using P2R palette", () => {
    const a = buildStaticPixelBorder(32, 6, 42);
    const b = buildStaticPixelBorder(32, 6, 42);

    expect(a).toEqual(b);
    for (const block of a) {
      expect([
        "#1C172D",
        "#39265E",
        "#5b2be6",
        "#7a1fb0",
        "#7ac70c",
        "#ffe500",
      ]).toContain(block.color);
    }
  });
});
