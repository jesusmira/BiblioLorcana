"use client";

import { useState } from "react";
import type { LorcanaCard } from "@/types/";
import { CardSearchResultItem } from "./CardSearchResultItem";
import { SearchCardModal } from "./SearchCardModal";
import { CardSkeleton } from "./CardSkeleton";

interface CardSearchResultsProps {
  cards: LorcanaCard[];
  isLoading: boolean;
  cardQuantities: Record<string, number>;
  onCardSelect: (card: LorcanaCard) => void;
  useModal?: boolean;
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
  useModal = false,
}: CardSearchResultsProps) {
  const [selectedCard, setSelectedCard] = useState<LorcanaCard | null>(null);

  const handleCardClick = (card: LorcanaCard) => {
    setSelectedCard(card);
  };

  const handleConfirm = () => {
    if (selectedCard) {
      onCardSelect(selectedCard);
      setSelectedCard(null);
    }
  };

  const handleCancel = () => {
    setSelectedCard(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <CardSkeleton key={`skeleton-${i}`} />
        ))}
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
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
        {cards.map((card) => {
          const quantity = cardQuantities[String(card.id)] || 0;
          const isInDeck = quantity > 0;
          const isMaxed = quantity >= 4;
          const cardImageUrl = getCardImage(card);

          return (
            <CardSearchResultItem
              key={card.id}
              card={card}
              isInDeck={isInDeck}
              isMaxed={isMaxed}
              cardImageUrl={cardImageUrl}
              cardQuantity={quantity}
              onCardSelect={onCardSelect}
              onCardClick={handleCardClick}
              useModal={useModal}
            />
          );
        })}
      </div>

      {useModal && selectedCard && (
        <SearchCardModal
          card={selectedCard}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
