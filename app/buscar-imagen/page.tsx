"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import CardArtwork from "../components/CardArtwork";
import StatGrid from "../components/StatGrid";
import TagChip from "../components/TagChip";
import { getTypes, normalizeInk, normalizeLabel } from "../lib";
import {
  extractCollectorNumber,
  saveCardToUser,
  translateText,
} from "../actions";
import { useAuth } from "../lib/auth";
import type { LorcanaCard } from "../types";
import {
  ArrowLeftIcon,
  HeartIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";

const IMAGE_STORAGE_KEY = "ocr_image_data";

const inkClassMap: Record<string, string> = {
  Amber: "bg-[rgba(241,180,99,0.2)] text-[#8d5a12]",
  Amethyst: "bg-[rgba(155,121,201,0.2)] text-[#6f4aa4]",
  Emerald: "bg-[rgba(79,169,107,0.2)] text-[#2f7f4b]",
  Ruby: "bg-[rgba(216,92,87,0.2)] text-[#a53f3b]",
  Sapphire: "bg-[rgba(76,132,196,0.2)] text-[#2f67a6]",
  Steel: "bg-[rgba(141,154,165,0.2)] text-[#4f5b64]",
  "Sin tinta": "bg-[rgba(245,239,231,0.12)] text-[var(--muted)]",
};

export default function ImageSearchPage() {
  const { user } = useAuth();
  const [imageData, setImageData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundCard, setFoundCard] = useState<LorcanaCard | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [collectorLine, setCollectorLine] = useState<string | null>(null);
  const [isSpecialCard, setIsSpecialCard] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedFlavor, setTranslatedFlavor] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showPromoTooltip, setShowPromoTooltip] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (storedImage) {
      setImageData(storedImage);
      localStorage.removeItem(IMAGE_STORAGE_KEY);
    }
  }, []);

  const searchCardByNumber = useCallback(async (set: string, number: string, ocrText?: string, collectorLine?: string) => {
    console.log("🔍 Buscando carta:", set, "/", number);
    setIsSearching(true);
    setError(null);
    setFoundCard(null);
    setIsSpecialCard(false);

    const hasLetters = /[A-Za-z]/.test(set);
    
    if (hasLetters && collectorLine) {
      console.log("⭐ Carta especial detectada:", collectorLine);
      
      try {
        const response = await fetch(`/api/cards/by-collector/${encodeURIComponent(collectorLine)}`);
        console.log("📡 Respuesta BD local:", response.status);
        
        if (response.ok) {
          const card = await response.json();
          console.log("✅ Carta encontrada en BD local:", card.name);
          setFoundCard(card);
          setIsSpecialCard(true);
          setIsSearching(false);
          return;
        }
      } catch (err) {
        console.log("❌ Error buscando en BD local:", err);
      }
      
      console.log("❌ Carta especial no encontrada en BD local");
      setIsSpecialCard(true);
      setIsSearching(false);
      return;
    }

    try {
      const response = await fetch(`/api/lorcast/cards/${set}/${number}`);
      console.log("📡 Respuesta API:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log("📷 Texto OCR detectado:", ocrText);
          console.log("🔍 Carta no encontrada:", `${set}/${number}`, "- Puede ser una carta promocional");
          setError(`No se encontró la carta ${set}/${number}. Puede ser una carta promocional.`);
        } else {
          setError("Error al buscar la carta");
        }
        return;
      }

      const card = await response.json();
      setFoundCard(card);
    } catch {
      setError("Error al buscar la carta");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const processImage = async () => {
    if (!imageData) {
      console.log("❌ No hay imageData");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFoundCard(null);
    setSaveSuccess(null);
    setIsSpecialCard(false);

    try {
      console.log("🔄 Enviando imagen a OCR...");
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageData }),
      });

      const result = await response.json();
      console.log("📨 Respuesta OCR:", result);

      if (!result.success) {
        console.log("❌ OCR falló:", result.error);
        setError(result.error || "Error al procesar la imagen");
        setIsProcessing(false);
        return;
      }

      console.log("📷 Texto OCR:", result.text);
      const cardInfo = await extractCollectorNumber(result.text || "");
      
      if (cardInfo) {
        setCollectorLine(cardInfo.fullLine);
        console.log("✅ Número detectado:", cardInfo.set, "/", cardInfo.number);
        console.log("📋 Línea completa:", cardInfo.fullLine);
        await searchCardByNumber(cardInfo.set, cardInfo.number, result.text, cardInfo.fullLine);
      } else {
        console.log("❌ No se detectó número de carta en:", result.text);
        setError("No se pudo detectar el número de carta");
      }
    } catch (err) {
      console.log("❌ Error procesando imagen:", err);
      setError("Error al procesar la imagen");
    }

    setIsProcessing(false);
  };

  const handleSaveCard = async () => {
    if (!foundCard) return;

    setIsSaving(true);
    const result = await saveCardToUser(foundCard);
    setIsSaving(false);

    if (result.success) {
      setSaveSuccess("Carta guardada en tu colección");
    } else {
      setError(result.error || "Error al guardar la carta");
    }
  };

  const handleTranslateClick = async () => {
    const cardText = (foundCard?.text as string) || (foundCard?.abilities as string) || "";
    const cardFlavor = (foundCard?.flavorText as string) || (foundCard?.flavor_text as string) || "";

    if (!cardText && !cardFlavor) return;

    if (translatedText !== null || translatedFlavor !== null) {
      setTranslatedText(null);
      setTranslatedFlavor(null);
      return;
    }

    setIsTranslating(true);

    const textsToTranslate = [
      cardText ? translateText(cardText, "en", "es") : null,
      cardFlavor ? translateText(cardFlavor, "en", "es") : null,
    ];

    const results = await Promise.all(textsToTranslate);
    const textResult = results[0];
    const flavorResult = results[1];

    if (textResult?.translatedText) {
      setTranslatedText(textResult.translatedText);
    }
    if (flavorResult?.translatedText) {
      setTranslatedFlavor(flavorResult.translatedText);
    }

    setIsTranslating(false);
  };

  useEffect(() => {
    if (imageData) {
      processImage();
    }
  }, [imageData]);

  if (!foundCard) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Volver a la galería
        </Link>

        <h1 className="mb-6 font-[var(--font-title)] text-2xl">
          Buscar carta por imagen
        </h1>

        {isProcessing && (
          <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
            <p className="text-[var(--muted)]">
              Procesando imagen y buscando carta...
            </p>
          </div>
        )}

        {isSearching && (
          <div className="flex items-center gap-3 rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
            <p className="text-[var(--muted)]">Buscando carta...</p>
          </div>
        )}

        {isSpecialCard && (
          <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-6 text-center">
            <div className="text-4xl">⭐</div>
            <h2 className="font-[var(--font-title)] text-xl">Carta Especial</h2>
            <p className="text-[var(--muted)]">
              Esta carta tiene un número especial que no está en nuestra base de datos.
            </p>
            <p className="font-mono text-lg font-bold text-[var(--accent)]">
              {collectorLine}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver a la galería
            </Link>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--alert)]/30 bg-[var(--alert)]/10 p-6 text-center">
            <p className="text-[var(--alert)]">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver a la galería
            </Link>
          </div>
        )}
      </main>
    );
  }

  const image = (foundCard.imageUrl as string) || (foundCard.image_uris as any)?.digital?.normal || "";
  const cardInk = normalizeInk(foundCard.ink);
  const types = Array.isArray(foundCard.type) ? foundCard.type : [foundCard.type].filter(Boolean);

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Volver a la galería
      </Link>

      <article className="grid items-stretch gap-8 rounded-[20px] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] [grid-template-columns:minmax(300px,1fr)_1.8fr] max-[900px]:grid-cols-1">
        <div className="relative flex justify-center max-[899px]:mb-4">
          <CardArtwork
            image={image}
            alt={foundCard.name || "Carta"}
            loading="lazy"
            wrapperClassName="w-full max-w-[400px] aspect-[2/3] rounded-[16px] bg-[var(--surface-soft)] p-4"
            imageClassName="h-auto w-full rounded-[12px] object-contain"
          />
          {user && (
            <div className="absolute bottom-4 right-4 hidden gap-1 max-[899px]:flex max-[899px]:bottom-2 max-[899px]:right-2">
              {isSpecialCard && (foundCard as any).promoSet ? (
                <button
                  onClick={() => setShowPromoTooltip(!showPromoTooltip)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white text-lg relative"
                  aria-label={(foundCard as any).promoSet}
                >
                  ⭐
                  {showPromoTooltip && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[var(--surface)] text-xs rounded whitespace-nowrap z-10">
                      {(foundCard as any).promoSet}
                    </span>
                  )}
                </button>
              ) : null}
              <button
                onClick={handleTranslateClick}
                disabled={isTranslating || ((!foundCard.text && !foundCard.flavor_text) && (!foundCard.flavorText && !foundCard.abilities))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                aria-label="Traducir carta"
              >
                {isTranslating ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--muted)] border-t-transparent"></div>
                ) : (
                  <LanguageIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={handleSaveCard}
                disabled={isSaving || !!saveSuccess}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  saveSuccess
                    ? "bg-green-500 text-white"
                    : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                }`}
                aria-label={saveSuccess ? "Guardada" : "Guardar carta"}
              >
                <HeartIcon className="h-5 w-5" fill={saveSuccess ? "currentColor" : "none"} />
              </button>
            </div>
          )}
        </div>

        <div className="flex h-full flex-col max-[899px]:text-center">
          <div className="mb-3 mt-3 flex flex-col gap-3.5">
            <p className="text-[0.75rem] uppercase tracking-[2px]">
              {isSpecialCard && collectorLine ? (foundCard as any).nonPromoSet : ((foundCard as any).set?.name || collectorLine)} · {isSpecialCard && collectorLine ? collectorLine : foundCard.collector_number}
            </p>

            <h3 className="font-[var(--font-title)] text-[1.75rem] flex items-center gap-2 min-[900px]:flex">
              {foundCard.name}
              {foundCard.version ? `, ${foundCard.version}` : ""}
              {user && (
                <span className="flex gap-1 max-[899px]:hidden">
                  {isSpecialCard && (foundCard as any).promoSet && (
                    <button
                      onClick={() => setShowPromoTooltip(!showPromoTooltip)}
                      className="text-lg relative"
                      aria-label={(foundCard as any).promoSet}
                    >
                      ⭐
                      {showPromoTooltip && (
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[var(--surface)] text-xs rounded whitespace-nowrap z-10">
                          {(foundCard as any).promoSet}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleTranslateClick}
                    disabled={isTranslating || ((!foundCard.text && !foundCard.flavor_text) && (!foundCard.flavorText && !foundCard.abilities))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                    aria-label="Traducir carta"
                  >
                    {isTranslating ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--muted)] border-t-transparent"></div>
                    ) : (
                      <LanguageIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={handleSaveCard}
                    disabled={isSaving || !!saveSuccess}
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      saveSuccess
                        ? "bg-green-500 text-white"
                        : "bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                    }`}
                    aria-label={saveSuccess ? "Guardada" : "Guardar carta"}
                  >
                    <HeartIcon className="h-4 w-4" fill={saveSuccess ? "currentColor" : "none"} />
                  </button>
                </span>
              )}
            </h3>

            <p className="whitespace-pre-line text-[var(--muted)]">
              {translatedText || ((foundCard.text as string) ?? "")}
            </p>

            {(foundCard.flavorText || foundCard.flavor_text) ? (
              <>
                <span className="h-px w-full bg-current text-[var(--muted)]"></span>
                <p className="italic text-[var(--muted)]">
                  {translatedFlavor || (foundCard.flavorText as string) || (foundCard.flavor_text as string)}
                </p>
              </>
            ) : null}

            {(translatedText || translatedFlavor) && (
              <button
                onClick={handleTranslateClick}
                className="mt-1 text-left text-xs text-[var(--accent)] underline"
              >
                Mostrar original
              </button>
            )}
          </div>

            <div className="mt-auto flex flex-col gap-3">
              <StatGrid card={foundCard} />
              <div className="flex flex-wrap gap-2 max-[900px]:justify-center">
                <TagChip>{cardInk}</TagChip>
                {types.slice(0, 2).map((item) => (
                  <TagChip key={item}>{item}</TagChip>
                ))}
                <TagChip>{normalizeLabel(foundCard.rarity)}</TagChip>
                {(foundCard.classifications as string[])?.map((item) => (
                  <TagChip key={item}>{item}</TagChip>
                ))}
              </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-[12px] bg-green-500/20 p-3 text-green-400">
                {saveSuccess}
              </div>
            )}

            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-[12px] border border-[var(--stroke)] px-4 py-3 transition hover:bg-[var(--surface)]"
            >
              Volver
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
