import { INK_COLORS } from "@/lib/constants";

export function getInkColor(ink: string | null): string {
  if (!ink) return "var(--muted)";
  return INK_COLORS[ink.toLowerCase()] || "var(--muted)";
}

interface InkDotProps {
  ink: string | null;
}

export function InkDot({ ink }: InkDotProps) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-full border border-white/20 shadow-sm"
      style={{ backgroundColor: getInkColor(ink) }}
      title={ink || ""}
    />
  );
}