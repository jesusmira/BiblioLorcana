"use client";

import type { LorcanaCard } from "../types";
import { ResourceIcon, type ResourceType } from "./ResourceIcon";

interface StatItem {
  key: keyof LorcanaCard;
  label: string;
  icon: ResourceType;
}

const statItems: StatItem[] = [
  { key: "strength", label: "Fuerza", icon: "strength" },
  { key: "willpower", label: "Voluntad", icon: "willpower" },
  { key: "lore", label: "Lore", icon: "lore" },
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
          <span className="flex items-center justify-center gap-1">
            <ResourceIcon type={item.icon} size={14} />
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
