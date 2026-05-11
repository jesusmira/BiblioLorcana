"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import CardArtwork from "@/components/lorcana/CardArtwork";
import StatGrid from "@/components/lorcana/StatGrid";
import TagChip from "@/components/ui/TagChip";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { CardText } from "@/components/lorcana/CardText";
import { getTypes, normalizeInk, normalizeLabel } from "@/lib";
import type { LorcanaCard } from "@/types";
import { useAuth } from "@/lib/auth";

const actionButtonBase = "flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]";
const actionButtonActive = "bg-[var(--accent)] text-white";
const favoriteButtonBase = "flex h-7 w-7 items-center justify-center rounded-full";
const saveButtonBase = "flex h-7 px-2 items-center justify-center rounded-full gap-1.5 transition-all text-[0.7rem] font-bold";
const saveButtonActive = "bg-[#2D2D2D] text-[var(--accent)]";
import { useFavoritesStore, useUserCardsStore } from "@/store/";
import { 
  translateText, 
  saveCardToUser, 
  removeCardFromUser,
  updateCardQuantity as updateQuantityAction 
} from "@/actions/";
import {
  HeartIcon,
  LanguageIcon,
  CheckIcon,
  ArrowPathIcon,
  FolderIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

const getImage = (card: LorcanaCard): string =>
  card.image_uris?.digital?.normal ||
  card.image_uris?.digital?.large ||
  card.image_uris?.digital?.small ||
  "";

interface GalleryCardModalProps {
  selected: LorcanaCard | null;
  onClose: () => void;
  hideActions?: boolean;
}

export default function GalleryCardModal({
  selected,
  onClose,
  hideActions = false,
}: GalleryCardModalProps) {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addSavedCardId, removeSavedCardId, isSaved, updateCardQuantity } = useUserCardsStore();
  
  const isCardFavorite = selected ? isFavorite(String(selected.id)) : false;
  const isCardSaved = selected ? isSaved(String(selected.id)) : false;
  
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedFlavor, setTranslatedFlavor] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [localQuantity, setLocalQuantity] = useState(1);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = "card-modal-title";
  const descriptionId = "card-modal-description";

  useEffect(() => {
    if (selected?.quantity) {
      setLocalQuantity(selected.quantity);
    } else {
      setLocalQuantity(1);
    }
  }, [selected?.id, selected?.quantity]);

  const handleFavoriteClick = () => {
    if (selected) {
      toggleFavorite(String(selected.id));
    }
  };

  const handleSaveClick = async () => {
    if (!selected) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    if (isCardSaved) {
      const result = await removeCardFromUser(String(selected.id));
      if (result.success) {
        removeSavedCardId(String(selected.id));
      } else {
        setSaveError(result.error || "Error al eliminar la carta");
      }
    } else {
      const result = await saveCardToUser(selected);
      if (result.success) {
        addSavedCardId(String(selected.id));
      } else {
        setSaveError(result.error || "Error al guardar la carta");
      }
    }
    setIsSaving(false);
  };

  const handleUpdateQuantity = async (newQty: number) => {
    if (!selected || newQty < 1 || newQty > 10) return;
    
    setIsUpdatingQuantity(true);
    const result = await updateQuantityAction(String(selected.id), newQty);
    if (result.success) {
      setLocalQuantity(newQty);
      if (selected) selected.quantity = newQty;
      updateCardQuantity(String(selected.id), newQty);
    }
    setIsUpdatingQuantity(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    setIsSaving(true);
    const result = await removeCardFromUser(String(selected.id));
    if (result.success) {
      removeSavedCardId(String(selected.id));
      setIsConfirmingDelete(false);
      onClose();
    } else {
      setSaveError(result.error || "Error al eliminar");
      setIsConfirmingDelete(false);
    }
    setIsSaving(false);
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

    if (textResult && "translatedText" in textResult && textResult.translatedText) {
      setTranslatedText(textResult.translatedText);
    } else if (textResult && "error" in textResult && textResult.error) {
      setTranslateError(textResult.error);
    }

    if (flavorResult && "translatedText" in flavorResult && flavorResult.translatedText) {
      setTranslatedFlavor(flavorResult.translatedText);
    } else if (flavorResult && "error" in flavorResult && flavorResult.error) {
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
    setSaveError(null);
  }, [selected?.id]);

  if (!selected) {
    return null;
  }

  const cardName = selected.name ?? "Carta";

  return (
    <>
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
              imageClassName="h-full w-full rounded-[12px] object-contain"
            />
            <div className="flex h-full flex-col max-[900px]:text-center">
              <div className="mb-3 mt-3 flex flex-col gap-3.5">
                <p className="text-[0.75rem] uppercase tracking-[2px]">
                  {selected.set?.name || "Set"} · {selected.collector_number}
                </p>
                  <h3 id={titleId} className="font-[var(--font-title)] text-[1.5rem] flex items-center gap-2 max-[900px]:justify-center">
                  {cardName}
                  {selected.version ? `, ${selected.version}` : ""}
                  
                  <span className="flex gap-1 items-center">
                    {/* Botón Traducir - Siempre visible */}
                    <button
                      onClick={handleTranslateClick}
                      disabled={isTranslating}
                      className={clsx(actionButtonBase, translatedText !== null && "text-[var(--accent)]")}
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

                    {user && (
                      <>
                        {!hideActions && (
                          <>
                            <button
                              onClick={handleFavoriteClick}
                              className={clsx(favoriteButtonBase, isCardFavorite ? actionButtonActive : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]")}
                              aria-label={isCardFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                              <HeartIcon className="h-4 w-4" fill={isCardFavorite ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={handleSaveClick}
                              disabled={isSaving}
                              className={clsx(saveButtonBase, isCardSaved ? saveButtonActive : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]")}
                              aria-label={isCardSaved ? "Quitar de mis cartas" : "Añadir a mis cartas"}
                            >
                              {isSaving ? (
                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <FolderIcon className="h-4 w-4" fill={isCardSaved ? "currentColor" : "none"} />
                                  {isCardSaved && <span>YA LA TIENES</span>}
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {hideActions && (
                          <button
                            onClick={() => setIsConfirmingDelete(true)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--alert)]/10 text-[var(--alert)] hover:bg-[var(--alert)] hover:text-white transition-colors"
                            aria-label="Eliminar de mi colección"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </span>
                </h3>

                <p id={descriptionId} className="min-h-[4.5rem] whitespace-pre-line text-[var(--muted)]">
                  {translatedText !== null ? <CardText text={translatedText} /> : <CardText text={selected.text ?? ""} />}
                </p>
                {translateError && (
                  <p className="text-[var(--alert)] text-sm">{translateError}</p>
                )}
                {saveError && (
                  <p className="text-[var(--alert)] text-sm">{saveError}</p>
                )}
                {selected.flavor_text ? (
                  <>
                    <span
                      className="h-px w-full bg-current text-[var(--muted)]"
                      aria-hidden="true"
                    ></span>
                    <p className="italic text-[var(--muted)]">
                      {translatedFlavor !== null ? <CardText text={translatedFlavor} /> : <CardText text={selected.flavor_text} />}
                    </p>
                  </>
                ) : null}
              </div>
              <div className="mt-auto flex flex-col gap-3">
                {/* Selector de Cantidad - Solo en Mi Colección */}
                {hideActions && user && (
                  <div className="flex items-center justify-center gap-4 py-2">
                    <span className="text-sm font-bold text-[var(--muted)]">COPIAS:</span>
                    <div className="flex items-center gap-3 bg-[var(--surface-soft)] rounded-full px-4 py-1.5 border border-[var(--stroke)] shadow-inner">
                      <button
                        onClick={() => handleUpdateQuantity(localQuantity - 1)}
                        disabled={localQuantity <= 1 || isUpdatingQuantity}
                        className="text-[var(--foreground)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:text-[var(--foreground)]"
                      >
                        <MinusIcon className="h-4 w-4 transition hover:scale-110" strokeWidth={3} />
                      </button>
                      
                      <span className="min-w-[1.5rem] text-center font-bold text-lg">
                        {isUpdatingQuantity ? "..." : localQuantity}
                      </span>

                      <button
                        onClick={() => handleUpdateQuantity(localQuantity + 1)}
                        disabled={localQuantity >= 10 || isUpdatingQuantity}
                        className="text-[var(--foreground)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:text-[var(--foreground)]"
                      >
                        <PlusIcon className="h-4 w-4 transition hover:scale-110" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                )}
                <StatGrid card={selected} />
                <div className="flex flex-wrap justify-center gap-3 max-[900px]:justify-center">
                  <TagChip>{normalizeInk(selected.ink)}</TagChip>
                  {getTypes(selected).map((item) => (
                    <TagChip key={item}>{item}</TagChip>
                  ))}
                  <span className="w-4" />
                  <TagChip>{normalizeLabel(selected.rarity)}</TagChip>
                  <span className="w-4" />
                  {(selected.classifications || []).map((item) => (
                    <TagChip key={item}>{item}</TagChip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmingDelete}
        title="¿Eliminar de tu colección?"
        message={`Esta acción quitará a "${selected.name}" de tu carpeta personal. No podrás deshacer este cambio.`}
        confirmLabel="Eliminar carta"
        cancelLabel="Mantener carta"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmingDelete(false)}
        isDestructive={true}
      />
    </>
  );
}
