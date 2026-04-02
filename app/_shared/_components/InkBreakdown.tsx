import { InkDot, getInkColor } from "./InkDot";

interface InkBreakdownProps {
  cards: { ink: string | null; quantity: number }[];
}

export function InkBreakdown({ cards }: InkBreakdownProps) {
  const inkMap: Record<string, number> = {};
  let total = 0;

  for (const card of cards) {
    const ink = card.ink || "Otro";
    inkMap[ink] = (inkMap[ink] || 0) + card.quantity;
    total += card.quantity;
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(inkMap)
        .sort((a, b) => b[1] - a[1])
        .map(([ink, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={ink} className="flex items-center gap-3">
              <InkDot ink={ink} />
              <span className="text-sm font-medium text-[var(--ink)] min-w-[5rem]">
                {ink}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: getInkColor(ink),
                  }}
                />
              </div>
              <span className="text-xs text-[var(--muted)] tabular-nums min-w-[3rem] text-right">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
    </div>
  );
}