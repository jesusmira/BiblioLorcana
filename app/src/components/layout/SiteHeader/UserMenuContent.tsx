"use client";

import Link from "next/link";
import {
  UserCircleIcon,
  RectangleStackIcon,
  SparklesIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

export interface UserMenuItem {
  href?: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isDestructive?: boolean;
}

export interface UserMenuContentProps {
  user: {
    name: string;
    email?: string;
    image?: string;
  };
  onItemClick?: () => void;
  onLogout?: () => void;
  showHeader?: boolean;
}

const baseLinkClass = "flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]";
const logoutClass = "flex w-full items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--alert-ink)] transition hover:bg-[var(--surface-strong)]";
const avatarClass = "flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[0.65rem] font-bold text-white";

export function UserMenuContent({ user, onItemClick, onLogout, showHeader = false }: UserMenuContentProps) {
  const userLinks: UserMenuItem[] = [
    {
      href: "/perfil",
      label: "Mi perfil",
      icon: <UserCircleIcon className="h-4 w-4 text-[var(--muted)]" />,
    },
    {
      href: "/mis-cartas",
      label: "Mis cartas",
      icon: <RectangleStackIcon className="h-4 w-4 text-[var(--muted)]" />,
    },
    {
      href: "/mis-mazos",
      label: "Mis mazos",
      icon: <SparklesIcon className="h-4 w-4 text-[var(--muted)]" />,
    },
  ];

  return (
    <>
        <div className="border-b border-[var(--stroke)] px-4 pb-3 pt-2">
          <div className="flex items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--stroke)]"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[0.9rem] font-medium text-[var(--ink)]">{user.name}</p>
              {user.email && <p className="truncate text-[0.8rem] text-[var(--muted)]">{user.email}</p>}
            </div>
          </div>
        </div>
      <div className="py-1">
        {userLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href!}
            className={baseLinkClass}
            onClick={onItemClick}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>
      <div className="border-t border-[var(--stroke)] pt-1">
        <button
          type="button"
          className={logoutClass}
          onClick={() => {
            onLogout?.();
            onItemClick?.();
          }}
        >
          <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export { avatarClass };
