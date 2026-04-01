"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import CardArtwork from "./CardArtwork";
import type { LorcanaCard } from "../types";
import { useAuth } from "../lib/auth";
import { useFavoritesStore, useUserCardsStore } from "../store";
import { saveCardToUser, removeCardFromUser } from "../actions";
import {
  HeartIcon,
  FolderIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface GalleryCardItemProps {
  card: LorcanaCard;
  onOpen: (card: LorcanaCard) => void;
  cardBaseClass: string;
  onRemove?: (id: string) => Promise<void>;
  hideDefaultActions?: boolean;
}

const getImage = (card: LorcanaCard): string =>
  card.image_uris?.digital?.normal ||
  card.image_uris?.digital?.large ||
  card.image_uris?.digital?.small ||
  "";

export default function GalleryCardItem({
  card,
  onOpen,
  cardBaseClass,
  onRemove,
  hideDefaultActions = false,
}: GalleryCardItemProps) {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addSavedCardId, removeSavedCardId, isSaved } = useUserCardsStore();
  
  const isCardFavorite = isFavorite(String(card.id));
  const isCardSaved = isSaved(String(card.id));
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const image = getImage(card);
  const ariaName = card.name ?? "esta carta";

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(card);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(String(card.id));
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaving(true);
    if (isCardSaved) {
      const result = await removeCardFromUser(String(card.id));
      if (result.success) {
        removeSavedCardId(String(card.id));
      }
    } else {
      const result = await saveCardToUser(card);
      if (result.success) {
        addSavedCardId(String(card.id));
      }
    }
    setIsSaving(false);
  };

  const handleRemoveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onRemove) return;
    
    setIsRemoving(true);
    await onRemove(String(card.id));
    setIsRemoving(false);
  };

  return (
    <article
      className={`${cardBaseClass} cursor-pointer relative`}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${ariaName}`}
      onClick={() => onOpen(card)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {user && (
          <div
            className={`absolute right-2 top-2 z-10 flex flex-col gap-2 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {!hideDefaultActions && (
              <>
                <button
                  onClick={handleFavoriteClick}
                  className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md ${
                    isCardFavorite
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                  aria-label={isCardFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <HeartIcon className="h-4 w-4" fill={isCardFavorite ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md ${
                    isCardSaved
                      ? "bg-[#2D2D2D] text-[var(--accent)]"
                      : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                  aria-label={isCardSaved ? "Quitar de mis cartas" : "Añadir a mis cartas"}
                >
                  {isSaving ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderIcon className="h-4 w-4" fill={isCardSaved ? "currentColor" : "none"} />
                  )}
                </button>
              </>
            )}

            {onRemove && (
              <button
                onClick={handleRemoveClick}
                disabled={isRemoving}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-md transition-all hover:bg-[var(--alert)] disabled:opacity-50"
                aria-label="Eliminar de mi colección"
              >
                {isRemoving ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <TrashIcon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}
        <CardArtwork
          image={image}
          alt={ariaName}
          loading="lazy"
          wrapperClassName="grid aspect-[2/3] place-items-center rounded-[18px] bg-[var(--surface-soft)] p-3 max-[600px]:aspect-[3/4] max-[600px]:p-1"
          imageClassName="h-full w-full rounded-[12px] object-contain"
        />
        {card.quantity && card.quantity > 1 && (
          <div className="absolute left-2 top-2 z-10 flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-black/70 px-2 text-[0.7rem] font-bold text-white backdrop-blur-md border border-white/20 shadow-lg">
            x{card.quantity}
          </div>
        )}
      </div>
    </article>
  );
}
