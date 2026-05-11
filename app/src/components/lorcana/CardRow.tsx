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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const image = getCardImage(card);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 200);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
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
      onMouseMove={handleMouseMove}
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
        className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] opacity-0 transition group-hover:opacity-100 hover:bg-[var(--alert-surface)] hover:text-[var(--alert-ink)]"
        aria-label="Eliminar carta"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {showTooltip && (
        <div
          className="fixed z-[100] pointer-events-none"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y - 200,
          }}
        >
          <div className="relative">
            <img
              src={image ?? ""}
              alt={card.name || "Carta"}
              className="h-[450px] aspect-[2/3] rounded-xl shadow-2xl block object-contain"
              style={{ height: '450px', width: '300px' }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)] shadow-lg border border-[var(--stroke)]">
              {card.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}