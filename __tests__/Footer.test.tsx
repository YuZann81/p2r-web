import { render, screen, within } from "@testing-library/react";
import Footer from "@/components/Footer";
import { getBranding } from "@/lib/branding";
import { FOOTER_CONTENT, FOOTER_MARQUEE_TEXT } from "@/lib/content";

jest.mock("@/lib/branding", () => ({
  getBranding: jest.fn(),
}));

const mockedGetBranding = getBranding as jest.MockedFunction<typeof getBranding>;

const BRANDING = {
  name: "SMKN 1 Katapang × RPL",
  tagline: "Penyelenggara Pameran Karya Teknologi",
  description:
    "Pameran karya teknologi dan game interaktif karya siswa SMKN 1 Katapang melalui jurusan Rekayasa Perangkat Lunak (RPL).",
  logoUrl: "/brand/pixel2reality-logo.png",
  website: "https://smkn1katapang.sch.id",
  socials: "",
  visible: true,
};

async function renderFooter() {
  render(await Footer());
}

describe("Footer (institutional branding)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetBranding.mockResolvedValue(BRANDING);
  });

  it("renders the 'Penyelenggara & Mitra' heading", async () => {
    await renderFooter();
    expect(screen.getByText(FOOTER_CONTENT.heading)).toBeInTheDocument();
  });

  it("identifies the organiser as SMKN 1 Katapang x RPL", async () => {
    await renderFooter();
    expect(
      screen.getByRole("heading", { name: BRANDING.name }),
    ).toBeInTheDocument();
  });

  it("renders the institutional description", async () => {
    await renderFooter();
    expect(screen.getByText(/game interaktif karya siswa/i)).toBeInTheDocument();
  });

  it("renders the official logo asset with accessible alt text", async () => {
    await renderFooter();
    const logo = screen.getByAltText(`Logo ${BRANDING.name}`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/brand/pixel2reality-logo.png");
  });

  it("renders the ticker marquee with the final chapter label", async () => {
    await renderFooter();
    expect(screen.getAllByText(FOOTER_MARQUEE_TEXT).length).toBeGreaterThan(0);
  });

  it("renders exactly one institutional logo", async () => {
    await renderFooter();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("links to the official institution website when provided", async () => {
    await renderFooter();
    const link = screen.getByRole("link", { name: /Kunjungi Situs Sekolah/i });
    expect(link).toHaveAttribute("href", BRANDING.website);
  });

  it("omits the website link when no website is configured", async () => {
    mockedGetBranding.mockResolvedValue({ ...BRANDING, website: "" });
    await renderFooter();
    expect(
      screen.queryByRole("link", { name: /Kunjungi Situs Sekolah/i }),
    ).not.toBeInTheDocument();
  });

  it("hides the institutional identity when it is unpublished", async () => {
    mockedGetBranding.mockResolvedValue({ ...BRANDING, visible: false });
    await renderFooter();
    expect(
      screen.queryByRole("heading", { name: BRANDING.name }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  // Regression guard: the fabricated investor presentation must never return.
  it("does not render any fictional investor or sponsor content", async () => {
    await renderFooter();
    for (const term of [
      /our investors/i,
      /investor/i,
      /sponsor/i,
      /agate/i,
      /aice/i,
      /indomie/i,
      /kabayan/i,
    ]) {
      expect(screen.queryByText(term)).not.toBeInTheDocument();
    }
  });

  it("renders the copyright line", async () => {
    await renderFooter();
    expect(screen.getByText(FOOTER_CONTENT.copyright)).toBeInTheDocument();
  });

  it("exposes the footer as a landmark with an accessible name", async () => {
    await renderFooter();
    const footer = screen.getByRole("contentinfo", { name: /footer/i });
    expect(within(footer).getByText(FOOTER_CONTENT.heading)).toBeInTheDocument();
  });
});
