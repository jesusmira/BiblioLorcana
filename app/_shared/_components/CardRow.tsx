"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { InkDot } from "./InkDot";
import type { LorcanaCard } from "../../types";

function getCardImage(card: LorcanaCard): string | null {
  return (
    card.image_uris?.digital?.small ||
    card.image_uris?.digital?.normal ||
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
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, below: false });
  const rowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const image = getCardImage(card);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      if (rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const showBelow = spaceAbove < 300;
        setTooltipPos({
          x: rect.left + 16,
          y: showBelow ? rect.bottom + 8 : rect.top - 8,
          below: showBelow,
        });
      }
      setShowTooltip(true);
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const cardType = Array.isArray(card.type) && card.type.length > 0 ? card.type[0] : null;

  return (
    <div
      ref={rowRef}
      className="group flex items-center gap-2 rounded-xl pr-4 pl-8 py-2.5 transition hover:bg-[var(--surface-soft)] cursor-pointer"
      onClick={() => onCardClick(card)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-[var(--accent)]/10 px-1.5 text-sm font-bold text-[var(--accent)] tabular-nums">
        {card.quantity ?? 1}x
      </span>

      <InkDot ink={card.ink ?? null} />

      <span className="flex-1 text-sm font-medium text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors ml-2">
        {card.name}
        {card.version ? <span className="text-[var(--muted)]">, {card.version}</span> : null}
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
        className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] opacity-0 transition group-hover:opacity-100 hover:bg-[var(--alert)]/10 hover:text-[var(--alert)]"
        aria-label="Eliminar carta"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {showTooltip && image && (
        <div
          className="fixed z-[60] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: `${tooltipPos.x}px`,
            top: tooltipPos.below ? `${tooltipPos.y}px` : undefined,
            bottom: tooltipPos.below ? undefined : `${window.innerHeight - tooltipPos.y}px`,
          }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--stroke)] bg-[var(--surface)]">
            <Image
              src={image}
              alt={card.name || "Carta"}
              width={200}
              height={280}
              className="block rounded-xl"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}