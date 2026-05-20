"use client";

import { useMemo } from "react";
import { fetchSetsAction } from "@/actions";
import type { LorcanaSet } from "@/types/";
import { INK_LABELS, CARD_TYPES, RARITY_LABELS } from "@/lib/constants";
import GalleryInkFilters from "@/components/lorcana/Gallery/header/GalleryInkFilters";

interface DeckSearchFiltersProps {
  filters: {
    ink: string;
    type: string;
    rarity: string;
    setCode: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  sets: LorcanaSet[];
}

export function DeckSearchFilters({
  filters,
  onFilterChange,
  onClearFilters,
  sets,
}: DeckSearchFiltersProps) {
  const hasActiveFilters =
    filters.ink || filters.type || filters.rarity || filters.setCode;

  return (
    <div className="space-y-4">
      <div className="flex w-full gap-2 items-center">
        <select
          value={filters.setCode}
          onChange={(e) => onFilterChange("setCode", e.target.value)}
          className={`flex-[3] min-w-[180px] rounded-lg border px-3 py-2 text-sm focus:outline-none transition-colors ${
            filters.setCode
              ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--ink)]"
              : "border-[var(--stroke)] bg-[var(--surface-soft)] text-[var(--ink)]"
          } focus:border-[var(--accent)]`}
        >
          <option value="">Todas las expansiones</option>
          {sets.map((set) => (
            <option key={set.code} value={set.code}>
              {set.name}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="flex-1 min-w-[120px] rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">Tipo</option>
          {CARD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.rarity}
          onChange={(e) => onFilterChange("rarity", e.target.value)}
          className="flex-1 min-w-[120px] rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">Rareza</option>
          {Object.entries(RARITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex-none rounded-lg border border-[var(--stroke)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--alert-ink)] hover:text-[var(--alert-ink)]"
          >
            Limpiar
          </button>
        )}
      </div>

      <GalleryInkFilters
        ink={filters.ink}
        onInkChange={(val) => onFilterChange("ink", val)}
        inkValues={Object.keys(INK_LABELS)}
      />
    </div>
  );
}
