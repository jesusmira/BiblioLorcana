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
    <div className="space-y-4">
      <div className="flex items-end justify-between h-32 gap-1.5 px-1">
        {Array.from({ length: 8 }, (_, i) => {
          const count = costMap[i] || 0;
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full">
              <div className="flex-1 w-full flex flex-col justify-end items-center gap-1">
                {count > 0 && (
                  <span className="text-[0.65rem] font-bold text-[var(--ink)] tabular-nums">
                    {count}
                  </span>
                )}
                <div
                  className="w-full rounded-t-[3px] bg-gradient-to-t from-[var(--accent)] to-[var(--accent)]/70 shadow-sm transition-all duration-300 hover:brightness-110"
                  style={{ height: `${height}%`, minHeight: count > 0 ? "4px" : "0" }}
                  title={`Coste ${i === 7 ? "7+" : i}: ${count} cartas`}
                />
              </div>
              <div className="h-6 flex items-center justify-center border-t border-[var(--stroke)]/50 w-full mt-1">
                <span className="text-[0.7rem] font-bold text-[var(--muted)]">
                  {i === 7 ? "7+" : i}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between text-[0.65rem] text-[var(--muted)] border-t border-[var(--stroke)] pt-2 uppercase tracking-wider">
        <span className="font-medium">Curva de Maná</span>
        <span className="text-[var(--accent)] font-bold">{maxCount} máx.</span>
      </div>
    </div>
  );
}