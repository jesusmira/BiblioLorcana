"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { useAuth } from "@/lib/auth";
import { HEADER_STYLES, HEADER_NAV_LINKS, UserMenuContent } from "./index";

interface HeaderMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeaderMobileNav({ isOpen, onClose }: HeaderMobileNavProps) {
  const { user, isLoading, logout } = useAuth();

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <nav className={HEADER_STYLES.mobileNavContainer}>
      {HEADER_NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(HEADER_STYLES.mobileLinkBase, HEADER_STYLES.mobileLinkInactive)}
          onClick={handleLinkClick}
        >
          {link.label}
        </Link>
      ))}

      {!isLoading && !user && (
        <div className="mt-2 flex flex-col gap-2 border-t border-[var(--stroke)] pt-2">
          <Link href="/login" className={HEADER_STYLES.mobileAuthButtonGhost} onClick={handleLinkClick}>
            Login
          </Link>
          <Link href="/registro" className={HEADER_STYLES.mobileAuthButtonSolid} onClick={handleLinkClick}>
            Registro
          </Link>
        </div>
      )}

      {!isLoading && user && (
        <div className="mt-2 flex flex-col gap-2 border-t border-[var(--stroke)] pt-2">
          <UserMenuContent 
            user={user} 
            onItemClick={handleLinkClick} 
            onLogout={handleLogout}
          />
        </div>
      )}
    </nav>
  );
}
