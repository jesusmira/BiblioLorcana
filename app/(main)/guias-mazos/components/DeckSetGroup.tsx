"use client";

import { DeckCard } from "./DeckCard";
import { type StarterDeck } from "@/types/guide";

interface DeckSetGroupProps {
  setName: string;
  decks: StarterDeck[];
}

export function DeckSetGroup({ setName, decks }: DeckSetGroupProps) {
  return (
    <div>
      <h3
        className="mb-6 text-xl font-bold text-[var(--ink)] border-b border-[var(--stroke-strong)] pb-3"
        style={{ fontFamily: "var(--font-title)" }}
      >
        {setName}
      </h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}
