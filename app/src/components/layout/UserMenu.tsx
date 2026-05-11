"use client";

import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { useAuth } from "@/lib/auth";
import { ChevronUpIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { UserMenuContent } from "./SiteHeader/UserMenuContent";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full px-3 py-1.5 transition"
        aria-label="Menu de usuario"
        aria-expanded={isOpen}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--stroke)]"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[0.75rem] font-bold text-white">
            {initials}
          </span>
        )}
        <span className="text-[0.9rem] text-[var(--ink)] max-[900px]:hidden">
          {user.name}
        </span>
        <ChevronUpIcon
          className={clsx("h-4 w-4 text-[var(--muted)] transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-[16px] border border-[var(--stroke)] bg-[var(--surface)] py-2 shadow-[var(--panel-shadow)]">
          <UserMenuContent
            user={user}
            onItemClick={() => setIsOpen(false)}
            onLogout={handleLogout}
            showHeader
          />
        </div>
      )}
    </div>
  );
}
