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
  isMobile?: boolean;
};

export default function NavLink({
  label,
  href,
  className,
  activeClassName,
  onClick,
  isMobile = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const targetHref = href.startsWith("#") ? `/${href}` : href;

  // Determine if this link represents the currently active route
  const isActive = React.useMemo(() => {
    if (!pathname) return false;
    if (targetHref === "/") return pathname === "/";
    if (targetHref.startsWith("/#") || targetHref.startsWith("#")) {
      return pathname === "/";
    }
    return pathname === targetHref || pathname.startsWith(`${targetHref}/`);
  }, [pathname, targetHref]);

  // Default desktop classes
  const defaultDesktopClass = `relative font-display text-sm lg:text-base tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow rounded px-2 py-1 ${
    isActive
      ? "text-arcade-yellow font-bold after:content-[''] after:absolute after:-bottom-1 after:left-1 after:right-1 after:h-[2px] after:bg-arcade-yellow"
      : "text-white/80 hover:text-white"
  }`;

  // Default mobile drawer classes
  const defaultMobileClass = `block rounded-xl px-4 py-2.5 font-display text-base font-bold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-yellow ${
    isActive
      ? "bg-arcade-yellow/15 text-arcade-yellow border-l-4 border-arcade-yellow pl-4"
      : "text-white/85 hover:bg-white/10 hover:text-white"
  }`;

  const resolvedClass = className
    ? `${className} ${isActive ? activeClassName || "text-arcade-yellow font-bold" : ""}`
    : isMobile
      ? defaultMobileClass
      : defaultDesktopClass;

  return (
    <Link
      href={targetHref}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={resolvedClass}
    >
      {label}
    </Link>
  );
}
