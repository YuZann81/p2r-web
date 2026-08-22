"use client";

type NavLinkProps = {
  label: string;
  href: string;
};

export default function NavLink({ label, href }: NavLinkProps) {
  const handleClick = () => {
    console.log("Navbar link clicked:", label);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-lg font-semibold tracking-wide text-white transition-colors hover:text-arcade-yellow focus-visible:text-arcade-yellow focus-visible:outline-none"
    >
      {label}
    </a>
  );
}
