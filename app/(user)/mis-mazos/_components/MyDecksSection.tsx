"use client";

import { useDecksStore } from "@/store";
import { DeckListCard } from "@/components/lorcana";

import type { UserDeck } from "@/types/";

interface MyDecksSectionProps {
  onDeleteConfirm: (id: string) => void;
  onExportDeck: (deck: UserDeck) => void;
  selectDeck: (deck: UserDeck) => void;
}

export function MyDecksSection({
  onDeleteConfirm,
  onExportDeck,
  selectDeck,
}: MyDecksSectionProps) {
  const { decks, duplicateDeck } = useDecksStore();

  if (decks.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="mb-4 font-[var(--font-title)] text-2xl text-[var(--ink)]">
        Mis mazos
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((d) => (
          <DeckListCard
            key={d.id}
            deck={d}
            onDelete={onDeleteConfirm}
            onDuplicate={(id: string) => duplicateDeck(id)}
            onExport={onExportDeck}
            onDoubleClick={selectDeck}
          />
        ))}
      </div>
    </div>
  );
}
