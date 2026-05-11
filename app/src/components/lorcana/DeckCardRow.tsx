"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { InkDot } from "./InkDot";
import type { DeckCard } from "@/types/";

interface DeckCardRowProps {
  card: DeckCard;
  onCardClick?: (cardId: string) => void;
}

export function DeckCardRow({ card, onCardClick }: DeckCardRowProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    return () => setShowTooltip(false);
  }, []);

  return (
    <div
      ref={rowRef}
      className="group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-[var(--surface-soft)] cursor-pointer"
      onClick={() => onCardClick?.(card.cardId)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-[var(--accent)]/10 px-1.5 text-sm font-bold text-[var(--accent)] tabular-nums">
        {card.quantity}x
      </span>

      <InkDot ink={card.ink} />

      <span className="flex-1 text-sm font-medium text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors">
        {card.name}
      </span>

      {card.type && (
        <span className="hidden sm:inline text-xs text-[var(--muted)] bg-[var(--surface-soft)] px-2 py-0.5 rounded-full text-left">
          {card.type}
        </span>
      )}

      {card.rarity && (
        <span className="hidden md:inline text-xs text-[var(--muted)] text-left">
          {card.rarity}
        </span>
      )}

      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-soft)] text-xs font-bold text-[var(--muted)]">
        {card.cost ?? "?"}
      </span>

      {showTooltip && card.image && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y - 200,
          }}
        >
          <div className="relative">
            <img
              src={card.image}
              alt={card.name}
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