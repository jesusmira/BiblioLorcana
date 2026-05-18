"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DeckSearchFilters } from "../../_components/DeckSearchFilters";
import { CardSearchResults } from "../../_components/CardSearchResults";
import type { LorcanaCard, LorcanaSet } from "@/types";

interface BuilderSearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  filters: {
    ink: string;
    type: string;
    rarity: string;
    setCode: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  handleClearFilters: () => void;
  sets: LorcanaSet[];
  searchResults: LorcanaCard[];
  cardQuantities: Record<string, number>;
  addCardToDeck: (card: LorcanaCard) => void;
  useModal?: boolean;
}

export default function BuilderSearchPanel({
  searchQuery,
  setSearchQuery,
  isSearching,
  filters,
  handleFilterChange,
  handleClearFilters,
  sets,
  searchResults,
  cardQuantities,
  addCardToDeck,
  useModal = false,
}: BuilderSearchPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <h2 className="mb-4 font-[var(--font-title)] text-xl text-[var(--ink)]">
          Buscar cartas
        </h2>

        <div className="relative mb-3">
          <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--muted)]">
            <MagnifyingGlassIcon className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre (mín. 2 caracteres)..."
            className="h-[52px] w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-[14px] pl-10 pr-10 text-base text-[var(--ink)] focus:border-[var(--accent)] outline-none transition-colors"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <DeckSearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            sets={sets}
          />
        </div>

        <div className="flex max-h-[500px] flex-col overflow-auto custom-scrollbar">
          <CardSearchResults
            cards={searchResults}
            isLoading={isSearching}
            cardQuantities={cardQuantities}
            onCardSelect={addCardToDeck}
            useModal={useModal}
          />
        </div>
      </div>
    </div>
  );
}
