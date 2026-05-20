import { clsx } from "clsx";
import {
  HeartIcon,
  LanguageIcon,
  CheckIcon,
  ArrowPathIcon,
  FolderIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const actionButtonBase =
  "flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]";
const actionButtonActive = "bg-[var(--accent)] text-white";
const favoriteButtonBase =
  "flex h-7 w-7 items-center justify-center rounded-full";
const saveButtonBase =
  "flex h-7 px-2 items-center justify-center rounded-full gap-1.5 transition-all text-[0.7rem] font-bold";
const saveButtonActive = "bg-[#2D2D2D] text-[var(--accent)]";

interface ModalCardActionsProps {
  user: any;
  hideActions: boolean;
  isTranslating: boolean;
  translatedText: string | null;
  onTranslateClick: () => void;
  isCardFavorite: boolean;
  onFavoriteClick: () => void;
  isSaving: boolean;
  isCardSaved: boolean;
  onSaveClick: () => void;
  onDeleteClick: () => void;
}

export function ModalCardActions({
  user,
  hideActions,
  isTranslating,
  translatedText,
  onTranslateClick,
  isCardFavorite,
  onFavoriteClick,
  isSaving,
  isCardSaved,
  onSaveClick,
  onDeleteClick,
}: ModalCardActionsProps) {
  return (
    <span className="flex gap-1 items-center">
      <button
        onClick={onTranslateClick}
        disabled={isTranslating}
        className={clsx(
          actionButtonBase,
          translatedText !== null && "text-[var(--accent)]",
        )}
        aria-label={
          translatedText !== null ? "Ocultar traducción" : "Traducir carta"
        }
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
                onClick={onFavoriteClick}
                className={clsx(
                  favoriteButtonBase,
                  isCardFavorite
                    ? actionButtonActive
                    : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]",
                )}
                aria-label={
                  isCardFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
                }
              >
                <HeartIcon
                  className="h-4 w-4"
                  fill={isCardFavorite ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={onSaveClick}
                disabled={isSaving}
                className={clsx(
                  saveButtonBase,
                  isCardSaved
                    ? saveButtonActive
                    : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]",
                )}
                aria-label={
                  isCardSaved ? "Quitar de mis cartas" : "Añadir a mis cartas"
                }
              >
                {isSaving ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <FolderIcon
                      className="h-4 w-4"
                      fill={isCardSaved ? "currentColor" : "none"}
                    />
                    {isCardSaved && <span>YA LA TIENES</span>}
                  </>
                )}
              </button>
            </>
          )}

          {hideActions && (
            <button
              onClick={onDeleteClick}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--alert-surface)] text-[var(--alert-ink)] hover:bg-[var(--alert-ink)] hover:text-white transition-colors"
              aria-label="Eliminar de mi colección"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </>
      )}
    </span>
  );
}
