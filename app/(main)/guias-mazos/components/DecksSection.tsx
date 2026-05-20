"use client";

import { useMemo } from "react";
import { DeckSetGroup } from "./DeckSetGroup";
import { type StarterDeck } from "@/types/guide";
import { DeckSkeleton } from "./DeckSkeleton";

interface DecksSectionProps {
  decks: StarterDeck[];
  loading: boolean;
}

export function DecksSection({ decks, loading }: DecksSectionProps) {
  const decksBySet = useMemo(
    () =>
      decks.reduce<Record<string, StarterDeck[]>>((acc, deck) => {
        if (!acc[deck.set]) acc[deck.set] = [];
        acc[deck.set].push(deck);
        return acc;
      }, {}),
    [decks],
  );

  return (
    <div className="mt-24">
      <div className="text-center mb-12">
        <h2
          className="text-2xl font-bold text-[var(--ink)] sm:text-3xl"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Encuentra tu <span className="text-[var(--accent)]">Estilo</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
          Elige según tu forma de jugar. Cada perfil tiene fortalezas únicas.
        </p>
      </div>

      {loading ? (
        <DeckSkeleton />
      ) : (
        <div className="space-y-12">
          {Object.entries(decksBySet).map(([setName, setDecks]) => (
            <DeckSetGroup key={setName} setName={setName} decks={setDecks} />
          ))}
        </div>
      )}
    </div>
  );
}
