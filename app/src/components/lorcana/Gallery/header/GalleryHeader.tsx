"use client";

import { ActiveSetSummary, buttonSolid, buttonGhost } from "@/components";
import type { LorcanaSet } from "@/types/";
import GallerySearch from "./GallerySearch";
import GalleryFilters from "./GalleryFilters";
import GalleryInkFilters from "./GalleryInkFilters";

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
  pickRandom,
  resetFilters,
  setError,
  cardError,
}: GalleryHeaderProps) {
  return (
    <div className="flex flex-col gap-[18px]">
      <section className="flex flex-col gap-[18px] rounded-[18px] bg-[var(--surface)] p-6 shadow-[var(--panel-shadow)] max-[600px]:p-4">
        <GallerySearch search={search} onSearchChange={onSearchChange} />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex-1 min-w-[320px]">
            <GalleryFilters
              sets={sets}
              selectedSet={selectedSet}
              onSelectedSetChange={onSelectedSetChange}
              loadingSets={loadingSets}
              type={type}
              onTypeChange={onTypeChange}
              rarity={rarity}
              onRarityChange={onRarityChange}
              sort={sort}
              onSortChange={onSortChange}
              typeValues={typeValues}
              rarityValues={rarityValues}
            />
          </div>

          <div className="flex gap-2.5 pb-[2px] max-[720px]:w-full max-[720px]:justify-center">
            <button className={buttonGhost} onClick={pickRandom} type="button">
              Carta aleatoria
            </button>
            <button
              className={buttonSolid}
              onClick={resetFilters}
              type="button"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--stroke)]/50 pt-4 mt-1 max-[720px]:flex-col max-[720px]:justify-center">
          <GalleryInkFilters
            ink={ink}
            onInkChange={onInkChange}
            inkValues={inkValues}
          />

          <ActiveSetSummary
            selectedSetData={selectedSetData}
            loadingSets={loadingSets}
            filteredCount={filteredCount}
          />
        </div>

        {(setError || cardError) && (
          <div className="rounded-[12px] bg-[var(--alert-bg)] px-[14px] py-3 text-[0.9rem] text-[var(--alert-ink)]">
            {setError || cardError}
          </div>
        )}
      </section>
    </div>
  );
}
