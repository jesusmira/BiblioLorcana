"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

function CardItem({
  card,
  isInDeck,
  isMaxed,
  cardImageUrl,
  cardQuantity,
  onCardSelect,
}: {
  card: LorcanaCard;
  isInDeck: boolean;
  isMaxed: boolean;
  cardImageUrl: string | null;
  cardQuantity: number;
  onCardSelect: (card: LorcanaCard) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback((clientX: number, clientY: number) => {
    const padding = 20;
    const tooltipWidth = 320;

    let x = clientX + padding;
    let y = clientY - 240;

    if (x + tooltipWidth > window.innerWidth) {
      x = clientX - tooltipWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }
    if (y < padding) {
      y = padding;
    }
    if (y + 480 > window.innerHeight - padding) {
      y = window.innerHeight - 500;
    }

    setPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    calculatePosition(e.clientX, e.clientY);
  }, [calculatePosition]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setShowTooltip(false);
    }, 150);
  }, []);

  useEffect(() => {
    if (showTooltip) {
      setIsVisible(true);
    }
  }, [showTooltip]);

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
        {cardImageUrl ? (
          <img
            src={cardImageUrl}
            alt={card.name || ""}
            className="aspect-[2/3] w-full h-auto object-cover"
            loading="lazy"
          />
        ) : (
          <div className="aspect-[2/3] w-full bg-[var(--surface)]" />
        )}

        {isInDeck && (
          <div className="absolute bottom-1 right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-lg">
            ×{cardQuantity}
          </div>
        )}

        {isMaxed && (
          <div className="absolute inset-0 bg-black/50" />
        )}
      </button>

      {showTooltip && isVisible && cardImageUrl && (
        <div
          className="fixed z-[100] pointer-events-none transition-opacity duration-150"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div className="relative">
            <img
              src={cardImageUrl}
              alt={card.name || ""}
              className="w-[320px] max-h-[80vh] rounded-xl shadow-2xl object-contain"
            />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)] shadow-lg border border-[var(--stroke)]">
              {card.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CardSearchResults({
  cards,
  isLoading,
  cardQuantities,
  onCardSelect,
}: CardSearchResultsProps) {
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
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => {
        const quantity = cardQuantities[String(card.id)] || 0;
        const isInDeck = quantity > 0;
        const isMaxed = quantity >= 4;
        const cardImageUrl = getCardImage(card);

        return (
          <CardItem
            key={card.id}
            card={card}
            isInDeck={isInDeck}
            isMaxed={isMaxed}
            cardImageUrl={cardImageUrl}
            cardQuantity={quantity}
            onCardSelect={onCardSelect}
          />
        );
      })}
    </div>
  );
}