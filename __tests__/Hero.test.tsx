import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";
import { HERO_CONTENT } from "@/lib/content";

describe("Hero", () => {
  describe("rendering", () => {
    it("renders the main heading text", () => {
      render(<Hero />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(HERO_CONTENT.heading);
    });

    it("renders the supporting subheading paragraph", () => {
      render(<Hero />);
      expect(
        screen.getByText(HERO_CONTENT.subheading, { selector: "p" }),
      ).toBeInTheDocument();
    });

    it("renders the primary call-to-action link", () => {
      render(<Hero />);
      const cta = screen.getByRole("link", {
        name: new RegExp(HERO_CONTENT.ctaLabel, "i"),
      });
      expect(cta).toBeInTheDocument();
    });

    it("points the call-to-action at an existing public route", () => {
      render(<Hero />);
      const cta = screen.getByRole("link", {
        name: new RegExp(HERO_CONTENT.ctaLabel, "i"),
      });
      expect(cta).toHaveAttribute("href", "/karya");
    });
  });
});
