import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeState } from "../types";

const DEFAULT_THEME = "dark" as const;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "lorcana-theme",
    },
  ),
);
