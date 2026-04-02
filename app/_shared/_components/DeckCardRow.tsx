"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { InkDot } from "./InkDot";
import type { DeckCard } from "../../types";

interface DeckCardRowProps {
  card: DeckCard;
  onCardClick: (cardId: string) => void;
}

export function DeckCardRow({ card, onCardClick }: DeckCardRowProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, below: false });
  const rowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <div
      ref={rowRef}
      className="group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-[var(--surface-soft)] cursor-pointer"
      onClick={() => onCardClick(card.cardId)}
      onMouseEnter={handleMouseEnter}
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
          className="fixed z-[60] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: `${tooltipPos.x}px`,
            top: tooltipPos.below ? `${tooltipPos.y}px` : undefined,
            bottom: tooltipPos.below ? undefined : `${window.innerHeight - tooltipPos.y}px`,
          }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--stroke)] bg-[var(--surface)]">
            <Image
              src={card.image}
              alt={card.name}
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