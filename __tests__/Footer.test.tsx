import { render, screen, within } from "@testing-library/react";
import Footer from "@/components/Footer";
import InvestorLogo from "@/components/InvestorLogo";
import { FOOTER_CONTENT, FOOTER_MARQUEE_TEXT } from "@/lib/content";

describe("InvestorLogo", () => {
  it("renders the logo image with accessible alt text and a src", () => {
    const investor = FOOTER_CONTENT.investors[0];
    render(
      <ul>
        <InvestorLogo investor={investor} />
      </ul>,
    );
    const logo = screen.getByAltText(investor.logoAlt);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src");
  });
});

describe("Footer", () => {
  it("renders the 'Our Investors' heading", () => {
    render(<Footer />);
    expect(screen.getByText(FOOTER_CONTENT.heading)).toBeInTheDocument();
  });

  it("renders the supporting description", () => {
    render(<Footer />);
    expect(screen.getByText(FOOTER_CONTENT.body)).toBeInTheDocument();
  });

  it("renders the ticker marquee with the final chapter label", () => {
    render(<Footer />);
    expect(screen.getAllByText(FOOTER_MARQUEE_TEXT).length).toBeGreaterThan(0);
  });

  it("renders every investor logo with accessible alt text", () => {
    render(<Footer />);
    for (const investor of FOOTER_CONTENT.investors) {
      const logo = screen.getByAltText(investor.logoAlt);
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src");
    }
  });

  it("renders exactly one logo per investor", () => {
    render(<Footer />);
    const logos = screen.getAllByRole("img");
    expect(logos).toHaveLength(FOOTER_CONTENT.investors.length);
  });

  it("renders the copyright line", () => {
    render(<Footer />);
    expect(screen.getByText(FOOTER_CONTENT.copyright)).toBeInTheDocument();
  });

  it("exposes the footer as a landmark with an accessible name", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo", { name: /footer/i });
    expect(
      within(footer).getByText(FOOTER_CONTENT.heading),
    ).toBeInTheDocument();
  });
});
