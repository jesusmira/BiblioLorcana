"use client";

import { useMemo } from "react";
import { fetchSetsAction } from "@/actions";
import type { LorcanaSet } from "@/types/";
import { INK_LABELS, CARD_TYPES, RARITY_LABELS } from "@/lib/constants";

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
  const hasActiveFilters = filters.ink || filters.type || filters.rarity || filters.setCode;

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.ink}
        onChange={(e) => onFilterChange("ink", e.target.value)}
        className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
      >
        <option value="">Todas las tintas</option>
        {Object.entries(INK_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => onFilterChange("type", e.target.value)}
        className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
      >
        <option value="">Todos los tipos</option>
        {CARD_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={filters.rarity}
        onChange={(e) => onFilterChange("rarity", e.target.value)}
        className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
      >
        <option value="">Todas las rarezas</option>
        {Object.entries(RARITY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={filters.setCode}
        onChange={(e) => onFilterChange("setCode", e.target.value)}
        className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
      >
        <option value="">Todas las expansiones</option>
        {sets.map((set) => (
          <option key={set.code} value={set.code}>
            {set.name}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="rounded-lg border border-[var(--stroke)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--alert)] hover:text-[var(--alert)]"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
