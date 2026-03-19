"use client";

import { useEffect, useRef, useState } from "react";
import CardArtwork from "./CardArtwork";
import StatGrid from "./StatGrid";
import TagChip from "./TagChip";
import { getTypes, normalizeInk, normalizeLabel } from "../lib";
import type { LorcanaCard } from "../types";
import { useAuth } from "../lib/auth";
import { useFavoritesStore } from "../store";
import { translateText } from "../actions";
import {
  HeartIcon,
  LanguageIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const getImage = (card: LorcanaCard): string =>
  card.image_uris?.digital?.normal ||
  card.image_uris?.digital?.large ||
  card.image_uris?.digital?.small ||
  "";

interface GalleryCardModalProps {
  selected: LorcanaCard | null;
  onClose: () => void;
}

export default function GalleryCardModal({
  selected,
  onClose,
}: GalleryCardModalProps) {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isCardFavorite = selected ? isFavorite(String(selected.id)) : false;
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedFlavor, setTranslatedFlavor] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = "card-modal-title";
  const descriptionId = "card-modal-description";

  const handleFavoriteClick = () => {
    if (selected) {
      toggleFavorite(String(selected.id));
    }
  };

  const handleTranslateClick = async () => {
    if (!selected?.text && !selected?.flavor_text) return;
    
    if (translatedText !== null || translatedFlavor !== null) {
      setTranslatedText(null);
      setTranslatedFlavor(null);
      return;
    }

    setIsTranslating(true);
    setTranslateError(null);

    const textsToTranslate = [
      selected.text ? translateText(selected.text, "en", "es") : null,
      selected.flavor_text ? translateText(selected.flavor_text, "en", "es") : null,
    ];

    const results = await Promise.all(textsToTranslate);

    const textResult = results[0];
    const flavorResult = results[1];

    if (textResult?.translatedText) {
      setTranslatedText(textResult.translatedText);
    } else if (textResult?.error) {
      setTranslateError(textResult.error);
    }

    if (flavorResult?.translatedText) {
      setTranslatedFlavor(flavorResult.translatedText);
    } else if (flavorResult?.error) {
      setTranslateError(flavorResult.error);
    }

    setIsTranslating(false);
  };

  useEffect(() => {
    if (!selected) return undefined;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    const first = focusable?.[0] || closeButtonRef.current;
    first?.focus();
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  useEffect(() => {
    setTranslatedText(null);
    setTranslatedFlavor(null);
    setTranslateError(null);
  }, [selected?.id]);

  if (!selected) {
    return null;
  }

  const cardName = selected.name ?? "Carta";

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center p-[clamp(16px,4vw,32px)]"
    >
      <div
        className="absolute inset-0 bg-[rgba(18,16,15,0.55)] backdrop-blur-[2px]"
        onClick={onClose}
      ></div>
        <div
          ref={dialogRef}
          className="relative z-[2] w-full max-w-[900px] overflow-auto rounded-[20px] bg-[var(--surface)] p-6 shadow-[var(--panel-shadow)] max-h-[calc(100vh-(clamp(16px,4vw,32px)*2))] max-[900px]:pt-12 max-[900px]:text-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
        >
        <button
          ref={closeButtonRef}
          className="absolute right-4 top-4 text-[0.9rem] text-[var(--muted)]"
          onClick={onClose}
          type="button"
        >
          Cerrar
        </button>
        <div className="grid items-stretch gap-6 [grid-template-columns:minmax(240px,1fr)_1.4fr] max-[900px]:grid-cols-1 max-[900px]:items-center">
          <CardArtwork
            image={getImage(selected)}
            alt={cardName}
            wrapperClassName="grid aspect-[2/3] w-full max-w-[360px] place-items-center rounded-[16px] bg-[var(--surface-soft)] p-3 max-[900px]:mx-auto max-[900px]:mt-2"
            imageClassName="h-auto w-full rounded-[12px] object-contain"
          />
          <div className="flex h-full flex-col max-[900px]:text-center">
            <div className="mb-3 mt-3 flex flex-col gap-3.5">
              <p className="text-[0.75rem] uppercase tracking-[2px]">
                {selected.set?.name || "Set"} · {selected.collector_number}
              </p>
              <h3 id={titleId} className="font-[var(--font-title)] text-[1.5rem] flex items-center gap-2">
                {cardName}
                {selected.version ? `, ${selected.version}` : ""}
                {user && (
                  <span className="flex gap-1">
                    <button
                      onClick={handleTranslateClick}
                      disabled={isTranslating}
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)] ${
                        translatedText !== null ? "text-[var(--accent)]" : ""
                      }`}
                      aria-label={translatedText !== null ? "Ocultar traducción" : "Traducir carta"}
                    >
                      {isTranslating ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      ) : translatedText !== null ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <LanguageIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleFavoriteClick}
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        isCardFavorite
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                      }`}
                      aria-label={isCardFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      <HeartIcon className="h-4 w-4" fill={isCardFavorite ? "currentColor" : "none"} />
                    </button>
                  </span>
                )}
              </h3>
              <p id={descriptionId} className="min-h-[4.5rem] whitespace-pre-line text-[var(--muted)]">
                {translatedText !== null ? translatedText : selected.text ?? ""}
              </p>
              {translateError && (
                <p className="text-[var(--error)] text-sm">{translateError}</p>
              )}
              {selected.flavor_text ? (
                <>
                  <span
                    className="h-px w-full bg-current text-[var(--muted)]"
                    aria-hidden="true"
                  ></span>
                  <p className="italic text-[var(--muted)]">
                    {translatedFlavor !== null ? translatedFlavor : selected.flavor_text}
                  </p>
                </>
              ) : null}
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <StatGrid card={selected} />
              <div className="flex flex-wrap gap-2 max-[900px]:justify-center">
                <TagChip>{normalizeInk(selected.ink)}</TagChip>
                {getTypes(selected).map((item) => (
                  <TagChip key={item}>{item}</TagChip>
                ))}
                <TagChip>{normalizeLabel(selected.rarity)}</TagChip>
                {(selected.classifications || []).map((item) => (
                  <TagChip key={item}>{item}</TagChip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
