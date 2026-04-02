import { getInkColor } from "./InkDot";

interface ManaCurveProps {
  cards: { cost: number | null; quantity: number }[];
}

export function ManaCurve({ cards }: ManaCurveProps) {
  const costMap: Record<number, number> = {};
  let maxCount = 0;

  for (const card of cards) {
    const cost = card.cost ?? 0;
    const capped = Math.min(cost, 7);
    costMap[capped] = (costMap[capped] || 0) + card.quantity;
    if (costMap[capped] > maxCount) maxCount = costMap[capped];
  }

  return (
    <div className="flex items-end gap-1.5 h-20">
      {Array.from({ length: 8 }, (_, i) => {
        const count = costMap[i] || 0;
        const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[0.6rem] text-[var(--muted)] tabular-nums">
              {count || ""}
            </span>
            <div
              className="w-full rounded-t-sm bg-[var(--accent)] opacity-70 transition-all duration-500"
              style={{ height: `${Math.max(height, 4)}%` }}
            />
            <span className="text-[0.65rem] font-bold text-[var(--muted)]">
              {i === 7 ? "7+" : i}
            </span>
          </div>
        );
      })}
    </div>
  );
}