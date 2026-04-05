"use client";

import Link from "next/link";
import { useAuth } from "../../lib/auth";
import ThemeToggle from "../ThemeToggle";
import UserMenu from "../UserMenu";
import { HEADER_STYLES } from "./index";

interface HeaderActionsProps {
  isLoading: boolean;
  user: { name: string } | null;
}

export function HeaderActions({ isLoading, user }: HeaderActionsProps) {
  if (isLoading) return null;

  return (
    <div className={HEADER_STYLES.actionsContainer}>
      {user ? (
        <div className="hidden min-[721px]:block">
          <UserMenu />
        </div>
      ) : (
        <div className="hidden items-center gap-2 min-[721px]:flex">
          <Link href="/login" className={HEADER_STYLES.authButtonGhost}>
            Login
          </Link>
          <Link href="/registro" className={HEADER_STYLES.authButtonSolid}>
            Registro
          </Link>
        </div>
      )}
      <ThemeToggle />
    </div>
  );
}
