"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/";
import type { Theme } from "@/types/";
import { STORAGE_KEYS, THEME } from "@/lib/constants";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const readStoredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return THEME.DEFAULT;
  }

  try {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || THEME.DEFAULT;
  } catch {
    return THEME.DEFAULT;
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
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
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
            <MoonIcon
              className="h-4 w-4 text-[var(--switch-icon-strong)]"
              aria-hidden="true"
            />
          ) : (
            <SunIcon
              className="h-4 w-4 text-[var(--switch-icon-strong)]"
              aria-hidden="true"
            />
          )}
        </span>
      </span>
    </button>
  );
}
