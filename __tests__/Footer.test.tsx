import { render, screen, within } from "@testing-library/react";
import Footer from "@/components/Footer";
import { FOOTER_CONTENT } from "@/lib/content";
import { KARYA_FILTERABLE_CATEGORIES } from "@/lib/karya/categories";

describe("Footer (Phase 1 cleaned compact footer)", () => {
  it("exposes footer landmark, brand info, and copyright", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo", { name: /footer/i });
    expect(within(footer).getByText(FOOTER_CONTENT.copyright)).toBeInTheDocument();
    expect(
      within(footer).getByText(/SMKN 1 KATAPANG · REKAYASA PERANGKAT LUNAK/i),
    ).toBeInTheDocument();
  });

  it("links all single-source-of-truth karya category links to /karya?category=...", () => {
    render(<Footer />);

    for (const category of KARYA_FILTERABLE_CATEGORIES) {
      const link = screen.getByRole("link", { name: category.label });
      expect(link).toHaveAttribute("href", `/karya?category=${category.id}`);
    }
  });

  it("does not render obsolete VOLT 1 branding, hidden chapter text, or unverified investors", () => {
    render(<Footer />);

    for (const forbidden of [
      /VOLT 1/i,
      /Final Chapter About Software Engineering/i,
      /Our Investors/i,
      /Agate/i,
      /Aice/i,
      /Indomie/i,
      /Kabayan/i,
    ]) {
      expect(screen.queryByText(forbidden)).not.toBeInTheDocument();
    }
  });
});
