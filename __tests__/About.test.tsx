import { render, screen, within } from "@testing-library/react";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import { ABOUT_CONTENT, ABOUT_MARQUEE_TEXT } from "@/lib/content";

describe("Marquee", () => {
  it("renders the provided ticker text", () => {
    render(<Marquee text="Hello Arcade" />);
    expect(screen.getAllByText("Hello Arcade").length).toBeGreaterThan(0);
  });

  it("duplicates the text so the scroll loops seamlessly", () => {
    render(<Marquee text="Repeat Me" repeat={3} />);
    expect(screen.getAllByText("Repeat Me")).toHaveLength(6);
  });
});

describe("About", () => {
  it("renders the event heading lines", () => {
    render(<About />);
    for (const line of ABOUT_CONTENT.headingLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it("renders the supporting event description", () => {
    render(<About />);
    expect(screen.getByText(ABOUT_CONTENT.body)).toBeInTheDocument();
  });

  it("renders the ticker marquee with the chapter label", () => {
    render(<About />);
    expect(screen.getAllByText(ABOUT_MARQUEE_TEXT).length).toBeGreaterThan(0);
  });

  it("renders the RPL emblem image with accessible alt text", () => {
    render(<About />);
    const emblem = screen.getByAltText(ABOUT_CONTENT.emblem.alt);
    expect(emblem).toBeInTheDocument();
    expect(emblem).toHaveAttribute("src");
  });

  it("exposes the About region as a landmark with an accessible name", () => {
    render(<About />);
    const region = screen.getByRole("region", { name: /about/i });
    expect(
      within(region).getByText(ABOUT_CONTENT.headingLines[0]),
    ).toBeInTheDocument();
  });
});
