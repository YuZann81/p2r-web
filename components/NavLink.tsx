"use client";

import React from "react";
import Link from "next/link";

type NavLinkProps = {
  label: string;
  href: string;
  className?: string;
  onClick?: () => void;
};

export default function NavLink({
  label,
  href,
  className = "font-display text-base tracking-wider text-white transition-colors hover:text-arcade-yellow focus-visible:text-arcade-yellow focus-visible:outline-none",
  onClick,
}: NavLinkProps) {
  const targetHref = href.startsWith("#") ? `/${href}` : href;

  return (
    <Link
      href={targetHref}
      onClick={onClick}
      className={className}
    >
      {label}
    </Link>
  );
}
