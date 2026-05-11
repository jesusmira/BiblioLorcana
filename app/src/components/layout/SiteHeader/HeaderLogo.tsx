"use client";

import Link from "next/link";
import { clsx } from "clsx";
import LogoMark from "@/components/ui/LogoMark";
import { HEADER_STYLES, HEADER_NAV_LINKS, type NavLink } from "./index";

interface HeaderLogoProps {
  onMenuToggle: () => void;
}

export function HeaderLogo({ onMenuToggle }: HeaderLogoProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className={HEADER_STYLES.menuButton}
        aria-label="Abrir menu"
        onClick={onMenuToggle}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className={HEADER_STYLES.logoContainer}>
          <Link href="/" className="flex items-center gap-3">
            <LogoMark size={36} />
            <span className={HEADER_STYLES.title}>Archivo del Reino</span>
          </Link>
        </div>
    </div>
  );
}

interface HeaderNavProps {
  links: NavLink[];
  pathname: string;
}

export function HeaderNav({ links, pathname }: HeaderNavProps) {
  return (
    <nav className={HEADER_STYLES.navBase}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              HEADER_STYLES.navLinkBase,
              isActive ? HEADER_STYLES.navLinkActive : HEADER_STYLES.navLinkInactive
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
