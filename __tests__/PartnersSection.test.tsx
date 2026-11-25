import { render, screen } from "@testing-library/react";
import PartnersSection from "@/components/PartnersSection";
import { getBranding } from "@/lib/branding";
import { apiGet } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

describe("PartnersSection and operational institutional branding", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the real organizer identity and no fabricated sponsor logos or names", () => {
    render(<PartnersSection />);

    expect(screen.getByText(/SMKN 1 Katapang × RPL/i)).toBeInTheDocument();

    for (const forbidden of [
      /Agate/i,
      /Aice/i,
      /Indomie/i,
      /Kabayan/i,
      /Sponsor Knot/i,
      /Sponsor Leaf/i,
      /Sponsor Lotus/i,
      /Sponsor Slash N/i,
    ]) {
      expect(screen.queryByText(forbidden)).not.toBeInTheDocument();
      expect(screen.queryByAltText(forbidden)).not.toBeInTheDocument();
    }
  });

  it("keeps operational branding fallback when /settings is unreachable", async () => {
    mockedApiGet.mockRejectedValueOnce(new Error("Network error"));

    const branding = await getBranding();

    expect(mockedApiGet).toHaveBeenCalledWith("/settings");
    expect(branding.name).toBe("SMKN 1 Katapang × RPL");
    expect(branding.logoUrl).toBe("/brand/pixel2reality-logo.png");
    expect(branding.visible).toBe(true);
  });
});
