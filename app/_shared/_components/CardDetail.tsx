import Link from "next/link";
import CardArtwork from "../../components/CardArtwork";
import StatGrid from "../../components/StatGrid";
import TagChip from "../../components/TagChip";
import { normalizeInk, normalizeLabel } from "../../lib";
import type { LorcanaCard } from "../../types";
import {
  ArrowLeftIcon,
  HeartIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";

interface CardDetailProps {
  card: LorcanaCard;
  user: { id: string } | null;
  ocrData: { name: string; subtitle: string; number: string; isPromo: boolean } | null;
  isSpecialCard: boolean;
  translatedText: string | null;
  translatedFlavor: string | null;
  isTranslating: boolean;
  isSaving: boolean;
  saveSuccess: string | null;
  onTranslate: () => Promise<void>;
  onSave: () => Promise<void>;
}

export function CardDetail({
  card,
  user,
  ocrData,
  isSpecialCard,
  translatedText,
  translatedFlavor,
  isTranslating,
  isSaving,
  saveSuccess,
  onTranslate,
  onSave,
}: CardDetailProps) {
  const image = card.imageUrl ?? card.image_uris?.digital?.normal ?? "";
  const cardInk = normalizeInk(card.ink);
  const types = Array.isArray(card.type) ? card.type : [card.type].filter(Boolean);

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]">
        <ArrowLeftIcon className="h-5 w-5" />
        Volver a la galería
      </Link>
      <article className="grid items-stretch gap-8 rounded-[20px] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] [grid-template-columns:minmax(300px,1fr)_1.8fr] max-[900px]:grid-cols-1">
        <div className="relative flex justify-center max-[899px]:mb-4">
          <CardArtwork
            image={image}
            alt={card.name || "Carta"}
            loading="lazy"
            wrapperClassName="w-full max-w-[400px] aspect-[2/3] rounded-[16px] bg-[var(--surface-soft)] p-4"
            imageClassName="h-auto w-full rounded-[12px] object-contain"
          />
          {user && (
            <div className="absolute bottom-4 right-4 hidden gap-1 max-[899px]:flex max-[899px]:bottom-2 max-[899px]:right-2">
              <button
                onClick={onTranslate}
                disabled={isTranslating}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
              >
                {isTranslating ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div> : <LanguageIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={onSave}
                disabled={isSaving || !!saveSuccess}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${saveSuccess ? "bg-green-500 text-white" : "bg-[var(--surface-soft)] text-[var(--foreground)]"}`}
              >
                <HeartIcon className="h-5 w-5" fill={saveSuccess ? "currentColor" : "none"} />
              </button>
            </div>
          )}
        </div>
        <div className="flex h-full flex-col max-[899px]:text-center">
          <div className="mb-3 mt-3 flex flex-col gap-3.5">
            <p className="text-[0.75rem] uppercase tracking-[2px]">
              {ocrData?.isPromo ? 'Versión Especial' : card.set?.name} · {card.collector_number} {card.collector_count ? ` / ${card.collector_count}` : ''}
            </p>
            <h3 className="font-[var(--font-title)] text-[1.75rem] flex items-center gap-2 min-[900px]:flex">
              {card.name}{card.version ? `, ${card.version}` : ""}
              {user && (
                <span className="flex gap-1 max-[899px]:hidden">
                  <button onClick={onTranslate} disabled={isTranslating} className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)]">
                    {isTranslating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div> : <LanguageIcon className="h-4 w-4" />}
                  </button>
                  <button onClick={onSave} disabled={isSaving || !!saveSuccess} className={`flex h-7 w-7 items-center justify-center rounded-full ${saveSuccess ? "bg-green-500 text-white" : "bg-[var(--surface-soft)]"}`}>
                    <HeartIcon className="h-4 w-4" fill={saveSuccess ? "currentColor" : "none"} />
                  </button>
                </span>
              )}
            </h3>
            <p className="whitespace-pre-line text-[var(--muted)]">{translatedText || (card.text ?? "")}</p>
            {(card.flavorText || card.flavor_text) && (
              <>
                <span className="h-px w-full bg-current text-[var(--muted)]"></span>
                <p className="italic text-[var(--muted)]">{translatedFlavor || card.flavorText || card.flavor_text}</p>
              </>
            )}
            {(translatedText || translatedFlavor) && (
              <button onClick={onTranslate} className="mt-1 text-left text-xs text-[var(--accent)] underline">Mostrar original</button>
            )}
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <StatGrid card={card} />
            <div className="flex flex-wrap justify-center gap-3 max-[900px]:justify-center">
              <TagChip>{cardInk}</TagChip>
              {types.slice(0, 2).map((item) => <TagChip key={item}>{item}</TagChip>)}
              <span className="w-4" />
              <TagChip>{normalizeLabel(card.rarity)}</TagChip>
              <span className="w-4" />
              {card.classifications?.map((item) => <TagChip key={item}>{item}</TagChip>)}
            </div>
            {saveSuccess && <div className="flex items-center gap-2 rounded-[12px] bg-green-500/20 p-3 text-green-400">{saveSuccess}</div>}
            <Link href="/" className="flex items-center justify-center gap-2 rounded-[12px] border border-[var(--stroke)] px-4 py-3 transition hover:bg-[var(--surface)]">Volver</Link>
          </div>
        </div>
      </article>
    </main>
  );
}