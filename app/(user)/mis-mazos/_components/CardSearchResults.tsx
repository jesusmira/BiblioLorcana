"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import CardArtwork from "@/components/lorcana/CardArtwork";
import type { LorcanaCard } from "@/types/";

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

function CardItem({
  card,
  isInDeck,
  isMaxed,
  cardImageUrl,
  cardQuantity,
  onCardSelect,
  onCardClick,
  useModal,
}: {
  card: LorcanaCard;
  isInDeck: boolean;
  isMaxed: boolean;
  cardImageUrl: string | null;
  cardQuantity: number;
  onCardSelect: (card: LorcanaCard) => void;
  onCardClick: (card: LorcanaCard) => void;
  useModal?: boolean;
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
    if (!useModal) setShowTooltip(true);
  }, [useModal]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!useModal) calculatePosition(e.clientX, e.clientY);
    },
    [calculatePosition, useModal],
  );

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

  const handleClick = useModal
    ? () => onCardClick(card)
    : () => onCardSelect(card);

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        disabled={isMaxed && !useModal}
        className={clsx(
          "relative w-full overflow-hidden rounded-lg border-2 transition hover:scale-105",
          isInDeck
            ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
            : "border-[var(--stroke)] hover:border-[var(--accent)]",
          isMaxed && !useModal && "cursor-not-allowed opacity-60",
        )}
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

        {isMaxed && <div className="absolute inset-0 bg-black/50" />}
      </button>

      {showTooltip && isVisible && cardImageUrl && (
        <div
          className="fixed z-[100] pointer-events-none transition-opacity duration-150"
          style={{ left: position.x, top: position.y }}
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

function SearchCardModal({
  card,
  onConfirm,
  onCancel,
}: {
  card: LorcanaCard | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!card) return null;

  const image =
    card.image_uris?.digital?.normal ||
    card.image_uris?.digital?.large ||
    card.image_uris?.digital?.small ||
    "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="relative flex w-full max-w-[85vw] flex-col items-center gap-4 rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] p-4 shadow-2xl max-[400px]:max-w-[92vw] max-[400px]:p-3 max-[400px]:gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-base font-bold text-[var(--ink)] max-[400px]:text-sm">
          ¿Deseas añadir al mazo?
        </p>

        <div className="w-full overflow-hidden rounded-xl border border-[var(--stroke)] shadow-md">
          <CardArtwork
            image={image}
            alt={card.name ?? "Carta"}
            loading="lazy"
            wrapperClassName="aspect-[2/3] w-full bg-[var(--surface-soft)] p-2 max-[400px]:p-1"
            imageClassName="h-full w-full rounded-lg object-contain"
          />
        </div>

        <p className="text-center text-sm font-medium text-[var(--ink)] max-[400px]:text-xs">
          {card.name}
        </p>

        <div className="flex w-full gap-2 max-[400px]:gap-1.5">
          <button
            onClick={onCancel}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--stroke)] bg-[var(--surface)] py-2.5 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--surface-hover)] max-[400px]:py-2 max-[400px]:text-xs max-[400px]:gap-1"
          >
            <XMarkIcon className="h-4 w-4 max-[400px]:h-3 max-[400px]:w-3" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 max-[400px]:py-2 max-[400px]:text-xs max-[400px]:gap-1"
          >
            <CheckIcon className="h-4 w-4 max-[400px]:h-3 max-[400px]:w-3" />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
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
    <>
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
