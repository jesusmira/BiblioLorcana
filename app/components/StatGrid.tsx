"use client";

import type { LorcanaCard } from "../types";

interface StatItem {
  key: keyof LorcanaCard;
  label: string;
}

const statItems: StatItem[] = [
  { key: "strength", label: "Fuerza" },
  { key: "willpower", label: "Voluntad" },
  { key: "lore", label: "Lore" },
];

const formatStat = (value: unknown): string | number =>
  value === null || value === undefined ? "--" : (value as number);

interface StatGridProps {
  card: LorcanaCard;
}

export default function StatGrid({ card }: StatGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 text-[0.85rem]">
      {statItems.map((item) => (
        <div key={item.key} className="rounded-[10px] bg-[var(--surface-soft)] p-2 text-center">
          <span className="block font-bold text-[var(--ink)]">
            {formatStat(card[item.key])}
          </span>
          {item.label}
        </div>
      ))}
    </div>
  );
}
