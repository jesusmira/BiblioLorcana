"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useAuth } from "../../lib/auth";
import {
  HEADER_STYLES,
  HEADER_NAV_LINKS,
  useHeaderScroll,
  HeaderLogo,
  HeaderNav,
  HeaderActions,
  HeaderMobileNav,
} from "./index";

export default function SiteHeader() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible } = useHeaderScroll({ isMenuOpen: isOpen });

  const handleMenuToggle = () => {
    setIsOpen((open) => !open);
  };

  return (
    <header className={clsx(HEADER_STYLES.headerBase, isVisible ? "translate-y-0" : "-translate-y-full")}>
      <div className={HEADER_STYLES.container}>
        <HeaderLogo onMenuToggle={handleMenuToggle} />
        <HeaderNav links={HEADER_NAV_LINKS} pathname={pathname} />
        <HeaderActions isLoading={isLoading} user={user} />
      </div>

      <div className={HEADER_STYLES.mobileContainer}>
        <HeaderMobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </header>
  );
}
