"use client";

import { useState } from "react";
import {
  LanguageIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { CardText } from "@/components/lorcana/CardText";
import { translateText } from "@/actions/";

interface CardTranslateSectionProps {
  cardTitle: string;
  setName?: string | null;
  collectorNumber?: string | null;
  text?: string | null;
  flavorText?: string | null;
}

export function CardTranslateSection({
  cardTitle,
  setName,
  collectorNumber,
  text,
  flavorText,
}: CardTranslateSectionProps) {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedFlavor, setTranslatedFlavor] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const hasContent = text || flavorText;

  const handleTranslateClick = async () => {
    if (!text && !flavorText) return;

    if (translatedText !== null || translatedFlavor !== null) {
      setTranslatedText(null);
      setTranslatedFlavor(null);
      return;
    }

    setIsTranslating(true);
    setTranslateError(null);

    const [textResult, flavorResult] = await Promise.all([
      text ? translateText(text, "en", "es") : Promise.resolve(null),
      flavorText ? translateText(flavorText, "en", "es") : Promise.resolve(null),
    ]);

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

  const isTranslated = translatedText !== null || translatedFlavor !== null;

  return (
    <>
      <div>
        <p className="mb-2 text-xs uppercase tracking-[2px] text-[var(--muted)]">
          {setName ?? "Disney Lorcana"}{collectorNumber ? ` · #${collectorNumber}` : ""}
        </p>
        <h1 className="font-[var(--font-title)] text-3xl text-[var(--ink)] sm:text-4xl flex items-center gap-3">
          {cardTitle}
          {hasContent && (
            <button
              onClick={handleTranslateClick}
              disabled={isTranslating}
              className={clsx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors",
                isTranslated && "text-[var(--accent)]",
              )}
              aria-label={isTranslated ? "Ocultar traducción" : "Traducir carta"}
            >
              {isTranslating ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : isTranslated ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <LanguageIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </h1>
      </div>

      {text && (
        <div className="rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-soft)] px-5 py-4">
          <p className="whitespace-pre-line text-[var(--ink)] leading-relaxed">
            <CardText text={translatedText !== null ? translatedText : text} />
          </p>
        </div>
      )}

      {translateError && (
        <p className="text-[var(--alert-ink)] text-sm">{translateError}</p>
      )}

      {flavorText && (
        <p className="italic text-[var(--muted)] text-sm leading-relaxed">
          "
          <CardText
            text={translatedFlavor !== null ? translatedFlavor : flavorText}
          />
          "
        </p>
      )}
    </>
  );
}
