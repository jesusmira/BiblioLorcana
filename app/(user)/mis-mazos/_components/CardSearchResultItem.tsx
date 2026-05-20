"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import Image from "next/image";
import type { LorcanaCard } from "@/types/";

interface CardSearchResultItemProps {
  card: LorcanaCard;
  isInDeck: boolean;
  isMaxed: boolean;
  cardImageUrl: string | null;
  cardQuantity: number;
  onCardSelect: (card: LorcanaCard) => void;
  onCardClick: (card: LorcanaCard) => void;
  useModal?: boolean;
}

export function CardSearchResultItem({
  card,
  isInDeck,
  isMaxed,
  cardImageUrl,
  cardQuantity,
  onCardSelect,
  onCardClick,
  useModal,
}: CardSearchResultItemProps) {
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
          <Image
            src={cardImageUrl}
            alt={card.name || ""}
            width={200}
            height={280}
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
            <Image
              src={cardImageUrl}
              alt={card.name || ""}
              width={320}
              height={448}
              className="w-[320px] max-h-[80vh] rounded-xl shadow-2xl object-contain"
              priority
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
