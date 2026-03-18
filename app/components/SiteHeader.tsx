"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { useAuth } from "../lib/auth";

const navLinks = [
  { href: "/", label: "Galeria" },
  { href: "/como-jugar", label: "Como jugar" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollRef = useRef(0);
  const tickingRef = useRef(false);

  const handleMenuToggle = () => {
    setIsVisible(true);
    setIsOpen((open) => {
      const next = !open;
      if (next && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("close-modal"));
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    lastScrollRef.current = window.scrollY;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const current = window.scrollY;
        const last = lastScrollRef.current;
        const delta = current - last;

        if (isOpen) {
          setIsVisible(true);
          lastScrollRef.current = current;
          tickingRef.current = false;
          return;
        }

        if (current > 80 && delta > 8) {
          setIsVisible(false);
          setIsOpen(false);
        } else if (delta < -8) {
          setIsVisible(true);
        }

        lastScrollRef.current = current;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-[var(--stroke)] bg-[color:var(--surface)]/95 backdrop-blur transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--ink)] transition duration-200 hover:border-[var(--stroke-strong)] min-[721px]:hidden"
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            onClick={handleMenuToggle}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <LogoMark size={36} />
            <span className="lorcana-title text-[1.15rem]">Archivo del Reino</span>
          </div>
        </div>

        <nav className="hidden items-center gap-3 text-[0.9rem] uppercase tracking-[1.6px] text-[var(--muted)] min-[721px]:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full border px-3 py-1 transition duration-200 ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--chip-active-bg)] text-[var(--ink)]"
                    : "border-transparent hover:border-[var(--stroke)] hover:text-[var(--ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && (user ? <UserMenu /> : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-[var(--stroke)] px-4 py-1.5 text-[0.8rem] uppercase tracking-[1px] text-[var(--ink)] transition hover:border-[var(--stroke-strong)]"
              >
                Login
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-[var(--accent)] px-4 py-1.5 text-[0.8rem] font-semibold uppercase tracking-[1px] text-white transition hover:opacity-90"
              >
                Registro
              </Link>
            </div>
          ))}
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-4 min-[721px]:hidden">
        {isOpen ? (
          <nav className="flex flex-col gap-2 rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-4 text-[0.9rem] uppercase tracking-[1.6px] text-[var(--muted)] shadow-[var(--panel-shadow)]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 transition duration-200 ${
                    isActive
                      ? "bg-[var(--chip-active-bg)] text-[var(--ink)]"
                      : "hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isLoading && !user && (
              <div className="mt-2 flex flex-col gap-2 border-t border-[var(--stroke)] pt-2">
                <Link
                  href="/login"
                  className="rounded-full border border-[var(--stroke)] px-4 py-2 text-center text-[var(--ink)] transition hover:border-[var(--stroke-strong)]"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/registro"
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-center font-semibold text-white transition hover:opacity-90"
                  onClick={() => setIsOpen(false)}
                >
                  Registro
                </Link>
              </div>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
