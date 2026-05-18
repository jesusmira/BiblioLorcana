"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { InkDot } from "./InkDot";
import type { LorcanaCard } from "@/types/";

function getCardImage(card: LorcanaCard): string | null {
  return (
    card.image_uris?.digital?.large ||
    card.image_uris?.digital?.normal ||
    card.image_uris?.digital?.small ||
    card.imageUrl ||
    null
  );
}

interface CardRowProps {
  card: LorcanaCard;
  onCardClick: (card: LorcanaCard) => void;
  onRemoveClick: (card: LorcanaCard) => void;
}

export function CardRow({ card, onCardClick, onRemoveClick }: CardRowProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const image = getCardImage(card);

  const calculatePosition = useCallback((clientX: number, clientY: number) => {
    const padding = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 480;

    let x = clientX + padding;
    let y = clientY - tooltipHeight / 2;

    if (x + tooltipWidth > window.innerWidth) {
      x = clientX - tooltipWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }
    if (y < padding) {
      y = padding;
    }
    if (y + tooltipHeight > window.innerHeight - padding) {
      y = window.innerHeight - tooltipHeight - padding;
    }

    setPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      calculatePosition(e.clientX, e.clientY);
    },
    [calculatePosition],
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

  const cardType =
    Array.isArray(card.type) && card.type.length > 0 ? card.type[0] : null;

  return (
    <div
      ref={rowRef}
      className="group flex items-center gap-2 rounded-xl pr-4 pl-8 py-2.5 transition hover:bg-[var(--surface-soft)] cursor-pointer"
      onClick={() => onCardClick(card)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-[var(--accent)]/10 px-1.5 text-sm font-bold text-[var(--accent)] tabular-nums">
        {card.quantity ?? 1}x
      </span>

      <InkDot ink={card.ink ?? null} />

      <span className="flex-1 text-sm font-medium text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors ml-2">
        {card.name}
        {card.version ? (
          <span className="text-[var(--muted)]">, {card.version}</span>
        ) : null}
      </span>

      <div className="flex items-center gap-8">
        {cardType && (
          <span className="hidden sm:inline w-24 text-xs text-[var(--muted)] bg-[var(--surface-soft)] px-2 py-0.5 rounded-full text-center">
            {cardType}
          </span>
        )}

        {card.rarity && (
          <span className="hidden md:inline w-12 text-xs text-[var(--muted)] text-center">
            {card.rarity}
          </span>
        )}

        <span className="w-6 flex justify-center items-center h-6 rounded-full bg-[var(--surface-soft)] text-xs font-bold text-[var(--muted)]">
          {card.cost ?? "?"}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveClick(card);
        }}
        className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] opacity-0 transition group-hover:opacity-100 hover:bg-[var(--alert-surface)] hover:text-[var(--alert-ink)]"
        aria-label="Eliminar carta"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {showTooltip && isVisible && image && (
        <div
          className="fixed z-[100] pointer-events-none transition-opacity duration-150"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div className="relative">
            <img
              src={image}
              alt={card.name || "Carta"}
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
