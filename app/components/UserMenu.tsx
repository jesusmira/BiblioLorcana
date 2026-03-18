"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../lib/auth";
import Link from "next/link";

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
        <svg
          className={`h-4 w-4 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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
              <svg className="h-4 w-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi perfil
            </Link>
            <Link
              href="/mis-cartas"
              className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
              onClick={() => setIsOpen(false)}
            >
              <svg className="h-4 w-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Mis cartas
            </Link>
            <Link
              href="/favoritos"
              className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
              onClick={() => setIsOpen(false)}
            >
              <svg className="h-4 w-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favoritos
            </Link>

          </div>
          <div className="border-t border-[var(--stroke)] pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[0.9rem] text-[var(--alert-ink)] transition hover:bg-[var(--surface-strong)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
