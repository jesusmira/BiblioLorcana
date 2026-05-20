"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import CardArtwork from "@/components/lorcana/CardArtwork";
import type { LorcanaCard } from "@/types/";

export interface SearchCardModalProps {
  card: LorcanaCard | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SearchCardModal({
  card,
  onConfirm,
  onCancel,
}: SearchCardModalProps) {
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
