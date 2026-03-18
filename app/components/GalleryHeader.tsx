"use client";

import type { ChangeEvent } from "react";
import { ActiveSetSummary, SearchBar, SelectField } from "./index";
import { normalizeLabel } from "../lib";
import type { LorcanaSet } from "../types";

interface GalleryHeaderProps {
  selectedSetData: LorcanaSet | undefined;
  loadingSets: boolean;
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  sets: LorcanaSet[];
  selectedSet: string;
  onSelectedSetChange: (value: string) => void;
  ink: string;
  onInkChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  rarity: string;
  onRarityChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  inkValues: string[];
  typeValues: string[];
  rarityValues: string[];
  buttonGhost: string;
  buttonSolid: string;
  pickRandom: () => void;
  resetFilters: () => void;
  setError: string;
  cardError: string;
}

export default function GalleryHeader({
  selectedSetData,
  loadingSets,
  filteredCount,
  search,
  onSearchChange,
  sets,
  selectedSet,
  onSelectedSetChange,
  ink,
  onInkChange,
  type,
  onTypeChange,
  rarity,
  onRarityChange,
  sort,
  onSortChange,
  inkValues,
  typeValues,
  rarityValues,
  buttonGhost,
  buttonSolid,
  pickRandom,
  resetFilters,
  setError,
  cardError,
}: GalleryHeaderProps) {
  return (
    <div className="flex flex-col gap-[18px]">
      <section className="flex flex-col gap-[18px] rounded-[18px] bg-[var(--surface)] p-6 shadow-[var(--panel-shadow)] max-[600px]:p-4">
        <SearchBar
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
        />
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] max-[600px]:grid-cols-1">
            <SelectField
              id="setSelect"
              label="Set"
              value={selectedSet}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectedSetChange(event.target.value)}
              disabled={loadingSets || !sets.length}
            >
              {loadingSets ? (
                <option value="">Cargando sets...</option>
              ) : null}
              {!loadingSets && !sets.length ? (
                <option value="">Sin sets</option>
              ) : null}
              {sets.map((set) => (
                <option key={set.id} value={set.code}>
                  {set.name} ({set.code})
                </option>
              ))}
            </SelectField>
            <SelectField
              id="inkSelect"
              label="Tinta"
              value={ink}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onInkChange(event.target.value)}
            >
              <option value="">Todas</option>
              {inkValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </SelectField>
            <SelectField
              id="typeSelect"
              label="Tipo"
              value={type}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onTypeChange(event.target.value)}
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
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onRarityChange(event.target.value)}
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
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onSortChange(event.target.value)}
            >
              <option value="name">Nombre</option>
              <option value="cost">Costo</option>
              <option value="ink">Tinta</option>
            </SelectField>
          </div>
          <div className="flex flex-wrap gap-2.5 max-[720px]:justify-center">
            {inkValues.map((value) => (
              <button
                key={value}
                className={`rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-[14px] py-2 text-[0.9rem] transition duration-200 ${ink === value
                    ? "border-[var(--accent)] bg-[var(--chip-active-bg)]"
                    : ""
                  }`}
                onClick={() => onInkChange(ink === value ? "" : value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 max-[720px]:justify-center">
            <button className={buttonGhost} onClick={pickRandom} type="button">
              Carta aleatoria
            </button>
            <button className={buttonSolid} onClick={resetFilters} type="button">
              Limpiar filtros
            </button>
          </div>
        </div>
        {setError || cardError ? (
          <div className="rounded-[12px] bg-[var(--alert-bg)] px-[14px] py-3 text-[0.9rem] text-[var(--alert-ink)]">
            {setError || cardError}
          </div>
        ) : null}
      </section>

      <ActiveSetSummary
        selectedSetData={selectedSetData}
        loadingSets={loadingSets}
        filteredCount={filteredCount}
      />
    </div>
  );
}
