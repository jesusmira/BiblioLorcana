import { clsx } from "clsx";

export const INK_COLORS: Record<string, string> = {
  Amber: "#f1b463",
  Amethyst: "#9b79c9",
  Emerald: "#4fa96b",
  Ruby: "#d85c57",
  Sapphire: "#4c84c4",
  Steel: "#8d9aa5",
};

export const inputErrorClass = "border-[var(--alert-ink)]";

export function inputError(inputClass: string, hasError: boolean): string {
  return clsx(inputClass, hasError && inputErrorClass);
}

export function spinner(isSpinning: boolean): string {
  return clsx("h-4 w-4", isSpinning && "animate-spin");
}
