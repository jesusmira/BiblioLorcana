"use client";

import type { ChangeEvent } from "react";
import { SelectField } from "@/components";
import { normalizeLabel } from "@/lib/";
import type { LorcanaSet } from "@/types/";

interface GalleryFiltersProps {
  sets: LorcanaSet[];
  selectedSet: string;
  onSelectedSetChange: (value: string) => void;
  loadingSets: boolean;
  type: string;
  onTypeChange: (value: string) => void;
  rarity: string;
  onRarityChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  typeValues: string[];
  rarityValues: string[];
}

export default function GalleryFilters({
  sets,
  selectedSet,
  onSelectedSetChange,
  loadingSets,
  type,
  onTypeChange,
  rarity,
  onRarityChange,
  sort,
  onSortChange,
  typeValues,
  rarityValues,
}: GalleryFiltersProps) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] max-[600px]:grid-cols-1">
      <SelectField
        id="setSelect"
        label="Set"
        value={selectedSet}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onSelectedSetChange(event.target.value)
        }
        disabled={loadingSets || !sets.length}
      >
        {loadingSets ? <option value="">Cargando sets...</option> : null}
        {!loadingSets && !sets.length ? (
          <option value="">Sin sets</option>
        ) : null}
        <option value="all">Todos los sets</option>
        {sets.map((set) => (
          <option key={set.id} value={set.code}>
            {set.name} ({set.code})
          </option>
        ))}
      </SelectField>

      <SelectField
        id="typeSelect"
        label="Tipo"
        value={type}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onTypeChange(event.target.value)
        }
      >
        <option value="">Todos</option>
        {typeValues.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="raritySelect"
        label="Rareza"
        value={rarity}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onRarityChange(event.target.value)
        }
      >
        <option value="">Todas</option>
        {rarityValues.map((value) => (
          <option key={value} value={value}>
            {normalizeLabel(value)}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="sortSelect"
        label="Orden"
        value={sort}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onSortChange(event.target.value)
        }
      >
        <option value="name">Nombre</option>
        <option value="cost">Costo</option>
        <option value="ink">Tinta</option>
      </SelectField>
    </div>
  );
}
