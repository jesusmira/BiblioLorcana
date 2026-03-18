"use client";

import { useEffect } from "react";
import { useThemeStore } from "../store";
import type { Theme } from "../types";

const THEME_STORAGE_KEY = "lorcana-theme";
const DEFAULT_THEME: Theme = "dark";

const readStoredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

const applyTheme = (theme: Theme): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);
};

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, [setTheme]);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors.
    }
  }, [theme]);

  const isDark = theme === "dark";
  const label = isDark ? "Modo oscuro" : "Modo claro";
  const actionLabel = isDark
    ? "Cambiar a modo claro"
    : "Cambiar a modo oscuro";

  return (
    <button
      type="button"
      className="inline-flex items-center rounded-full p-1 text-[var(--ink)] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-4"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={actionLabel}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`relative h-9 w-[93px] overflow-hidden rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] transition duration-200 ${
          isDark ? "shadow-[0_10px_20px_rgba(0,0,0,0.35)]" : "shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
        }`}
        aria-hidden="true"
      >
        <span
          className={`pointer-events-none absolute left-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--switch-thumb)] shadow-[0_6px_12px_rgba(0,0,0,0.28)] transition-transform ${
            isDark ? "translate-x-[56px]" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[var(--switch-icon-strong)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 12.8A8.5 8.5 0 1111.2 3 7 7 0 0021 12.8z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[var(--switch-icon-strong)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
