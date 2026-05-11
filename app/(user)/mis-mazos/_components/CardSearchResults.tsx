"use client";

import { useState, useCallback } from "react";
import type { LorcanaCard } from "@/types/";

interface CardSearchResultsProps {
  cards: LorcanaCard[];
  isLoading: boolean;
  cardQuantities: Record<string, number>;
  onCardSelect: (card: LorcanaCard) => void;
}

function getCardImage(card: LorcanaCard | undefined): string | null {
  if (!card) return null;
  return (
    card.image_uris?.digital?.large ||
    card.image_uris?.digital?.normal ||
    card.image_uris?.digital?.small ||
    card.imageUrl ||
    null
  );
}

export function CardSearchResults({
  cards,
  isLoading,
  cardQuantities,
  onCardSelect,
}: CardSearchResultsProps) {
  const [hoveredCard, setHoveredCard] = useState<LorcanaCard | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="py-8 text-center text-[var(--muted)]">
        No se encontraron cartas
      </div>
    );
  }

  return (
    <div onMouseMove={handleMouseMove}>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
        {cards.map((card) => {
          const quantity = cardQuantities[String(card.id)] || 0;
          const isInDeck = quantity > 0;
          const isMaxed = quantity >= 4;
          const imageUrl = getCardImage(card);

          return (
            <div
              key={card.id}
              className="relative"
              onMouseEnter={() => setHoveredCard(card)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <button
                onClick={() => !isMaxed && onCardSelect(card)}
                disabled={isMaxed}
                className={`relative w-full overflow-hidden rounded-lg border-2 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isInDeck
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                    : "border-[var(--stroke)] hover:border-[var(--accent)]"
                }`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={card.name || ""}
                    className="aspect-[2/3] w-full h-auto object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full bg-[var(--surface)]" />
                )}

                {isInDeck && (
                  <div className="absolute bottom-1 right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-lg">
                    ×{quantity}
                  </div>
                )}

                {isMaxed && (
                  <div className="absolute inset-0 bg-black/50" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {hoveredCard && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y - 200,
          }}
        >
          <div className="relative">
            <img
              src={getCardImage(hoveredCard) || ""}
              alt={hoveredCard.name || ""}
              className="h-[450px] aspect-[2/3] rounded-xl shadow-2xl block object-contain"
              style={{ height: '450px', width: '300px' }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)] shadow-lg">
              {hoveredCard.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
