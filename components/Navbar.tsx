import ArcadeLogo from "@/components/ArcadeLogo";
import NavLink from "@/components/NavLink";
import { NAV_LINKS } from "@/lib/content";

export default function Navbar() {
  return (
    <header className="w-full">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between sm:gap-6 md:px-10"
      >
        <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink label={link.label} href={link.href} />
            </li>
          ))}
        </ul>

        <ArcadeLogo />
      </nav>
    </header>
  );
}
