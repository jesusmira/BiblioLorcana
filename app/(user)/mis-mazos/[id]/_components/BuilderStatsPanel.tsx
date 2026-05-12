"use client";

import { ManaCurve, InkBreakdown } from "@/components/lorcana";
import type { DeckCardWithDetails, DeckStats } from "../_hooks/useDeckBuilder";

interface BuilderStatsPanelProps {
  cards: DeckCardWithDetails[];
  stats: DeckStats;
}

export default function BuilderStatsPanel({
  cards,
  stats,
}: BuilderStatsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <h2 className="mb-6 font-[var(--font-title)] text-xl text-[var(--ink)]">
          Curva de Tinta
        </h2>
        <ManaCurve cards={cards.map(c => ({ ...c.details, quantity: c.quantity } as any))} />
      </div>

      <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <h2 className="mb-6 font-[var(--font-title)] text-xl text-[var(--ink)]">
          Desglose de Tipos
        </h2>
        <InkBreakdown cards={cards.map(c => ({ ink: c.details?.ink ?? null, quantity: c.quantity }))} />
      </div>
    </div>
  );
}
