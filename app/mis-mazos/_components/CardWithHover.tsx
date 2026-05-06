"use client";

import { useState, useCallback, ReactNode } from "react";
import type { LorcanaCard } from "../../types";

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

interface CardWithHoverProps {
  card?: LorcanaCard;
  children: ReactNode;
}

export function CardWithHover({ card, children }: CardWithHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const imageUrl = getCardImage(card);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {isHovered && imageUrl && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y - 200,
          }}
        >
            <img
              src={imageUrl}
              alt={card?.name || ""}
              className="h-[450px] aspect-[2/3] rounded-xl shadow-2xl block object-contain"
              style={{ height: '450px', width: '300px' }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)] shadow-lg border border-[var(--stroke)]">
              {card?.name}
            </div>
        </div>
      )}
    </div>
  );
}