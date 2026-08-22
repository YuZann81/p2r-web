import { render, screen } from "@testing-library/react";
import NavLink from "@/components/NavLink";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("NavLink Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders link with active state and aria-current='page' when on active route", () => {
    mockedUsePathname.mockReturnValue("/games");

    render(<NavLink label="Games" href="/games" />);

    const link = screen.getByRole("link", { name: "Games" });
    expect(link).toHaveAttribute("href", "/games");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.className).toContain("text-arcade-yellow");
  });

  it("renders link without aria-current when on different route", () => {
    mockedUsePathname.mockReturnValue("/karya");

    render(<NavLink label="Games" href="/games" />);

    const link = screen.getByRole("link", { name: "Games" });
    expect(link).toHaveAttribute("href", "/games");
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("renders mobile active styling when isMobile is true", () => {
    mockedUsePathname.mockReturnValue("/leaderboard");

    render(<NavLink label="Leaderboard" href="/leaderboard" isMobile={true} />);

    const link = screen.getByRole("link", { name: "Leaderboard" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.className).toContain("border-l-4 border-arcade-yellow");
  });
});
