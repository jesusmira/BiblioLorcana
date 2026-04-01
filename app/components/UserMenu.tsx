"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../lib/auth";
import Link from "next/link";
import {
  ChevronUpIcon,
  UserCircleIcon,
  RectangleStackIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const mockUser = {
  id: "1",
  name: "Usuario Demo",
  email: "demo@ejemplo.com",
  role: "USER" as const,
};

export default function UserMenu() {
  const { user: authUser, logout } = useAuth();
  const user = mockUser;
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
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[0.75rem] font-bold text-white">
          {initials}
        </span>
        <span className="text-[0.9rem] text-[var(--ink)] max-[900px]:hidden">
          {user.name}
        </span>
        <ChevronUpIcon
          className={`h-4 w-4 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-[16px] border border-[var(--stroke)] bg-[var(--surface)] py-2 shadow-[var(--panel-shadow)]">
          <div className="border-b border-[var(--stroke)] px-4 pb-3 pt-2">
            <p className="text-[0.9rem] font-medium text-[var(--ink)]">{user.name}</p>
            <p className="text-[0.8rem] text-[var(--muted)]">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/perfil"
              className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
              onClick={() => setIsOpen(false)}
            >
              <UserCircleIcon className="h-4 w-4 text-[var(--muted)]" />
              Mi perfil
            </Link>
            <Link
              href="/mis-cartas"
              className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
              onClick={() => setIsOpen(false)}
            >
              <RectangleStackIcon className="h-4 w-4 text-[var(--muted)]" />
              Mis cartas
            </Link>
            <Link
              href="/mis-mazos"
              className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
              onClick={() => setIsOpen(false)}
            >
              <SparklesIcon className="h-4 w-4 text-[var(--muted)]" />
              Mis mazos
            </Link>

          </div>
          <div className="border-t border-[var(--stroke)] pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--alert-ink)] transition hover:bg-[var(--surface-strong)]"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
