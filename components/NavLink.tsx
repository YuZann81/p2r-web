"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  label: string;
  href: string;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

export default function NavLink({
  label,
  href,
  className = "",
  activeClassName = "text-[#FFD447]",
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname?.startsWith(`${href}/`);

  const combinedClass = `${className} ${isActive ? activeClassName : ""}`.trim();

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick} className={combinedClass}>
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={combinedClass}
    >
      {label}
    </Link>
  );
}
