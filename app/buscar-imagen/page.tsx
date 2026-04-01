"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import CardArtwork from "../components/CardArtwork";
import StatGrid from "../components/StatGrid";
import TagChip from "../components/TagChip";
import { normalizeInk, normalizeLabel } from "../lib";
import {
  saveCardToUser,
  translateText,
} from "../actions";
import { useAuth } from "../lib/auth";
import { STORAGE_KEYS } from "../lib/constants";
import type { LorcanaCard } from "../types";
import {
  ArrowLeftIcon,
  HeartIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";

export default function ImageSearchPage() {
  const { user } = useAuth();
  const [imageData, setImageData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundCard, setFoundCard] = useState<LorcanaCard | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<{name: string; subtitle: string; number: string; isPromo: boolean} | null>(null);
  const [isSpecialCard, setIsSpecialCard] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedFlavor, setTranslatedFlavor] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showPromoTooltip, setShowPromoTooltip] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem(STORAGE_KEYS.OCR_IMAGE);
    if (storedImage) {
      setImageData(storedImage);
      localStorage.removeItem(STORAGE_KEYS.OCR_IMAGE);
    }
  }, []);

  const searchCardByDetails = useCallback(async (details: {name: string; subtitle: string; number?: string; isPromo: boolean}) => {
    let { name, subtitle, number, isPromo } = details;
    
    // Normalizar Vaiana -> Moana (Regla importante: Lorcast solo entiende Moana)
    name = name.replace(/Vaiana/gi, "Moana");
    if (subtitle) subtitle = subtitle.replace(/Vaiana/gi, "Moana");
    if (number) number = number.replace(/Vaiana/gi, "Moana");

    console.log("🔍 Buscando carta por detalles:", { name, subtitle, number, isPromo });
    setIsSearching(true);
    setError(null);
    setFoundCard(null);
    setIsSpecialCard(false);

    try {
      const nameParts = [name, subtitle].filter(Boolean);
      const nameQuery = nameParts.join(" ");
      
      const searchQueries: string[] = [];

      // ESTRATEGIA 1: Si tenemos número y set (ej: 27/P3), usamos filtros específicos
      // Esto es lo más fiable para encontrar la carta exacta.
      if (number && number.includes("/")) {
        const parts = number.split("/");
        const numPart = parts[0].trim();
        const setPart = parts[1].split(/[·.\s]/)[0].trim(); // Extraer el set (ej: P3 de P3·EN·10)
        
        if (numPart && /^\d+$/.test(numPart) && setPart) {
          searchQueries.push(`number:${numPart} set:${setPart}`);
        }
      }

      // ESTRATEGIA 2: Búsqueda por nombre con filtros de rareza
      if (isPromo) {
        searchQueries.push(`${nameQuery} rarity:special`);
        searchQueries.push(`${nameQuery} rarity:promo`);
      }

      // ESTRATEGIA 3: Búsqueda básica por nombre
      searchQueries.push(nameQuery);

      let foundCards: LorcanaCard[] = [];
      
      for (const q of searchQueries) {
        console.log("📡 Intentando query Lorcast:", q);
        const endpoint = `https://api.lorcast.com/v0/cards/search?q=${encodeURIComponent(q)}`;
        const response = await fetch(endpoint);
        if (response.ok) {
          const resultsData = await response.json();
          const results = Array.isArray(resultsData) ? resultsData : (resultsData.results || []);
          if (results.length > 0) {
            foundCards = results;
            // Si la query era específica de number:set, confiamos plenamente en el resultado
            if (q.includes("set:")) break;
            
            // Si ya encontramos cartas con filtros de rareza, podemos parar
            if (q.includes("rarity:")) break;
            
            // Si es la búsqueda básica, esperamos a terminar el loop por si acaso (aunque es el último)
          }
        }
      }

      if (foundCards.length > 0) {
        let bestMatch = foundCards[0];

        // Refinamiento final por número si tenemos varios resultados
        if (number) {
          const numOnly = number.split("/")[0].trim();
          const numberMatch = foundCards.find(c => c.collector_number === numOnly);
          if (numberMatch) {
            bestMatch = numberMatch;
            console.log("✅ Match por número encontrado en lista:", bestMatch.name, bestMatch.collector_number);
          }
        }

        // Marcar como especial si la rareza lo indica
        const rarity = (bestMatch.rarity as string)?.toLowerCase();
        if (['special', 'enchanted', 'promo'].includes(rarity)) {
          setIsSpecialCard(true);
        }

        setFoundCard(bestMatch);
        setIsSearching(false);
        return;
      }

      setError(`No se pudo encontrar la carta "${name}${subtitle ? ', ' + subtitle : ''}".`);
    } catch (err) {
      console.error("Error buscando en Lorcast:", err);
      setError("Error al buscar la carta");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const processImage = async () => {
    if (!imageData) return;

    setIsProcessing(true);
    setError(null);
    setFoundCard(null);
    setSaveSuccess(null);
    setIsSpecialCard(false);

    try {
      console.log("🔄 Enviando imagen a OCR (Estrategia JSON)...");
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageData }),
      });

      const resultData = await response.json();
      console.log("📨 Respuesta OCR:", resultData);

      if (!resultData.success || !resultData.data) {
        setError(resultData.error || "Error al procesar la imagen");
        setIsProcessing(false);
        return;
      }

      const { name, subtitle, number, isPromo } = resultData.data;
      setOcrData({ name, subtitle, number, isPromo });
      
      if (name) {
        await searchCardByDetails({ name, subtitle, number, isPromo });
      } else {
        setError("No se pudo identificar el nombre de la carta.");
      }
    } catch (err) {
      console.error("Error procesando imagen:", err);
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
    if (textResult?.translatedText) setTranslatedText(textResult.translatedText);
    if (flavorResult?.translatedText) setTranslatedFlavor(flavorResult.translatedText);
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
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]">
          <ArrowLeftIcon className="h-5 w-5" />
          Volver a la galería
        </Link>
        <h1 className="mb-6 font-[var(--font-title)] text-2xl">Buscar carta por imagen</h1>
        {isProcessing && (
          <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
            <p className="text-[var(--muted)]">Procesando imagen e identificando carta...</p>
          </div>
        )}
        {isSearching && (
          <div className="flex items-center gap-3 rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
            <p className="text-[var(--muted)]">Buscando en Lorcast...</p>
          </div>
        )}
        {ocrData?.isPromo && (
          <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-6 text-center">
            <div className="text-4xl">⭐</div>
            <h2 className="font-[var(--font-title)] text-xl">Detección: Edición Especial</h2>
            <p className="text-[var(--muted)]">Claude ha identificado esta carta como una versión promocional o especial.</p>
            <p className="font-bold text-[var(--accent)]">{ocrData.name} {ocrData.subtitle && `· ${ocrData.subtitle}`}</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--alert)]/30 bg-[var(--alert)]/10 p-6 text-center">
            <p className="text-[var(--alert)]">{error}</p>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]">
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
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]">
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
              <button
                onClick={handleTranslateClick}
                disabled={isTranslating}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface)]"
              >
                {isTranslating ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div> : <LanguageIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={handleSaveCard}
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
              {ocrData?.isPromo ? 'Versión Especial' : (foundCard as any).set?.name} · {foundCard.collector_number} {foundCard.collector_count ? ` / ${foundCard.collector_count}` : ''}
            </p>
            <h3 className="font-[var(--font-title)] text-[1.75rem] flex items-center gap-2 min-[900px]:flex">
              {foundCard.name}{foundCard.version ? `, ${foundCard.version}` : ""}
              {user && (
                <span className="flex gap-1 max-[899px]:hidden">
                  <button onClick={handleTranslateClick} disabled={isTranslating} className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)]">
                    {isTranslating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div> : <LanguageIcon className="h-4 w-4" />}
                  </button>
                  <button onClick={handleSaveCard} disabled={isSaving || !!saveSuccess} className={`flex h-7 w-7 items-center justify-center rounded-full ${saveSuccess ? "bg-green-500 text-white" : "bg-[var(--surface-soft)]"}`}>
                    <HeartIcon className="h-4 w-4" fill={saveSuccess ? "currentColor" : "none"} />
                  </button>
                </span>
              )}
            </h3>
            <p className="whitespace-pre-line text-[var(--muted)]">{translatedText || ((foundCard.text as string) ?? "")}</p>
            {(foundCard.flavorText || foundCard.flavor_text) && (
              <>
                <span className="h-px w-full bg-current text-[var(--muted)]"></span>
                <p className="italic text-[var(--muted)]">{translatedFlavor || (foundCard.flavorText as string) || (foundCard.flavor_text as string)}</p>
              </>
            )}
            {(translatedText || translatedFlavor) && (
              <button onClick={handleTranslateClick} className="mt-1 text-left text-xs text-[var(--accent)] underline">Mostrar original</button>
            )}
          </div>
            <div className="mt-auto flex flex-col gap-3">
            <StatGrid card={foundCard} />
            <div className="flex flex-wrap justify-center gap-3 max-[900px]:justify-center">
              <TagChip>{cardInk}</TagChip>
              {types.slice(0, 2).map((item) => <TagChip key={item}>{item}</TagChip>)}
              <span className="w-4" />
              <TagChip>{normalizeLabel(foundCard.rarity)}</TagChip>
              <span className="w-4" />
              {(foundCard.classifications as string[])?.map((item) => <TagChip key={item}>{item}</TagChip>)}
            </div>
            {saveSuccess && <div className="flex items-center gap-2 rounded-[12px] bg-green-500/20 p-3 text-green-400">{saveSuccess}</div>}
            <Link href="/" className="flex items-center justify-center gap-2 rounded-[12px] border border-[var(--stroke)] px-4 py-3 transition hover:bg-[var(--surface)]">Volver</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
