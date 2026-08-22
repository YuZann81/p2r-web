import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "@/components/Hero";
import { HERO_CONTENT } from "@/lib/content";

describe("Hero Component — Digital Exhibition Entrance", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe("rendering", () => {
    it("renders the main heading text dominant and clear", () => {
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

    it("renders the primary call-to-action button", () => {
      render(<Hero />);
      const cta = screen.getByRole("button", {
        name: new RegExp(HERO_CONTENT.ctaLabel, "i"),
      });
      expect(cta).toBeInTheDocument();
    });
  });

  describe("CTA interaction", () => {
    it("calls the onExplore handler when the CTA is clicked", async () => {
      const user = userEvent.setup();
      const onExplore = jest.fn();

      render(<Hero onExplore={onExplore} />);
      await user.click(
        screen.getByRole("button", {
          name: new RegExp(HERO_CONTENT.ctaLabel, "i"),
        }),
      );

      expect(onExplore).toHaveBeenCalledTimes(1);
    });

    it("logs the CTA interaction to the console for tracking", async () => {
      const user = userEvent.setup();

      render(<Hero />);
      await user.click(
        screen.getByRole("button", {
          name: new RegExp(HERO_CONTENT.ctaLabel, "i"),
        }),
      );

      expect(logSpy).toHaveBeenCalledWith(
        "Hero CTA clicked:",
        HERO_CONTENT.ctaLabel,
      );
    });

    it("does not throw when clicked without an onExplore handler", async () => {
      const user = userEvent.setup();

      render(<Hero />);
      const cta = screen.getByRole("button", {
        name: new RegExp(HERO_CONTENT.ctaLabel, "i"),
      });

      await expect(user.click(cta)).resolves.not.toThrow();
    });
  });
});
