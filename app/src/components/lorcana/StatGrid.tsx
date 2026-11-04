"use client";

import type { LorcanaCard } from "@/types/";
import { ResourceIcon, type ResourceType } from "./ResourceIcon";

interface StatItem {
  key: "strength" | "willpower" | "move_cost";
  label: string;
  icon: ResourceType | null;
  valueClassName: string;
}

const STRENGTH_ITEM: StatItem = {
  key: "strength",
  label: "Fuerza",
  icon: "strength",
  valueClassName: "text-[var(--ink)]",
};

const MOVE_COST_ITEM: StatItem = {
  key: "move_cost",
  label: "Movimiento",
  icon: null,
  valueClassName: "text-[var(--ink)]",
};

const WILLPOWER_ITEM: StatItem = {
  key: "willpower",
  label: "Voluntad",
  icon: "willpower",
  valueClassName: "text-[var(--surface-soft)]",
};

const STAT_ICON_SIZE = 58;
const LORE_ICON_SIZE = 28;

const statBoxClass =
  "flex flex-col items-center justify-start gap-1.5 rounded-[10px] bg-[var(--surface-soft)] p-2 text-center";

const isLocation = (card: LorcanaCard): boolean =>
  (card.type ?? []).some((value) => value.toLowerCase() === "location");

interface StatGridProps {
  card: LorcanaCard;
}

export default function StatGrid({ card }: StatGridProps) {
  const lore = card.lore ?? 0;
  const loreLabel = card.lore === null || card.lore === undefined ? "--" : lore;
  const statItems = [
    isLocation(card) ? MOVE_COST_ITEM : STRENGTH_ITEM,
    WILLPOWER_ITEM,
  ];

  return (
    <div className="grid grid-cols-3 gap-2 text-[0.85rem]">
      {statItems.map((item) => {
        const value = card[item.key];

        return (
          <div key={item.key} className={statBoxClass}>
            <span>{item.label}</span>
            <span
              className="relative flex items-center justify-center text-[var(--ink)]"
              style={{ width: STAT_ICON_SIZE, height: STAT_ICON_SIZE }}
              aria-label={`${item.label}: ${value ?? "sin valor"}`}
            >
              {item.icon ? (
                <ResourceIcon type={item.icon} size={STAT_ICON_SIZE} />
              ) : (
                <span className="h-[46px] w-[46px] rounded-full border-[5px] border-current" />
              )}
              <span
                className={`absolute inset-0 flex items-center justify-center text-[1.4rem] font-bold ${item.valueClassName}`}
              >
                {value ?? "-"}
              </span>
            </span>
          </div>
        );
      })}

      <div className={statBoxClass}>
        <span>Lore</span>
        <span
          className="flex min-h-[58px] flex-wrap items-center justify-center gap-0.5 text-[var(--ink)]"
          aria-label={`Lore: ${loreLabel}`}
        >
          {lore > 0 ? (
            Array.from({ length: lore }, (_, index) => (
              <ResourceIcon key={index} type="lore" size={LORE_ICON_SIZE} />
            ))
          ) : (
            <span className="font-bold">{loreLabel}</span>
          )}
        </span>
      </div>
    </div>
  );
}
