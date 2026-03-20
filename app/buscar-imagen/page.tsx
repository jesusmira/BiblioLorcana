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
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedFlavor, setTranslatedFlavor] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (storedImage) {
      setImageData(storedImage);
      localStorage.removeItem(IMAGE_STORAGE_KEY);
    }
  }, []);

  const searchCardByNumber = useCallback(async (set: string, number: string, ocrText?: string) => {
    console.log("🔍 Buscando carta:", set, "/", number);
    setIsSearching(true);
    setError(null);
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
        await searchCardByNumber(cardInfo.set, cardInfo.number, result.text);
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
    if (!foundCard?.text && !foundCard?.flavor_text) return;

    if (translatedText !== null || translatedFlavor !== null) {
      setTranslatedText(null);
      setTranslatedFlavor(null);
      return;
    }

    setIsTranslating(true);

    const textsToTranslate = [
      foundCard.text ? translateText(foundCard.text, "en", "es") : null,
      foundCard.flavor_text ? translateText(foundCard.flavor_text, "en", "es") : null,
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

  const image = foundCard.image_uris?.digital?.normal || foundCard.image_uris?.digital?.large || foundCard.image_uris?.digital?.small || "";
  const cardInk = normalizeInk(foundCard.ink);
  const types = getTypes(foundCard);

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-3xl">
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

      <article className="grid gap-6 rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-6 sm:grid-cols-[320px_1fr]">
        <div className="h-full">
          <CardArtwork
            image={image}
            alt={foundCard.name || "Carta"}
            loading="lazy"
            wrapperClassName="h-full rounded-[16px] bg-[var(--surface-soft)]"
            imageClassName="h-full w-full rounded-[16px] object-contain"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[1px] ${
                inkClassMap[cardInk] || ""
              }`}
            >
              {cardInk}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTranslateClick}
                disabled={isTranslating || (!foundCard.text && !foundCard.flavor_text)}
                className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--stroke)] transition hover:bg-[var(--surface)] disabled:opacity-40"
                aria-label="Traducir texto"
              >
                {isTranslating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--muted)] border-t-transparent"></div>
                ) : (
                  <LanguageIcon className="h-4 w-4 text-[var(--muted)]" />
                )}
              </button>
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--cost-bg)] text-[var(--cost-ink)] font-bold">
                {foundCard.cost ?? 0}
              </span>
            </div>
          </div>

          <h3 className="font-[var(--font-title)] text-[1.1rem]">
            {foundCard.name}
            {foundCard.version ? `, ${foundCard.version}` : ""}
          </h3>

          <div className="flex flex-col gap-2.5">
            <p className="min-h-[4.5rem] overflow-hidden text-[var(--muted)] leading-[1.5] [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] whitespace-pre-line">
              {translatedText || (foundCard.text ?? "")}
            </p>
            {foundCard.flavor_text ? (
              <>
                <span
                  className="h-px w-full bg-current text-[var(--muted)]"
                  aria-hidden="true"
                ></span>
                <p className="overflow-hidden text-[var(--muted)] italic [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] whitespace-pre-line">
                  {translatedFlavor || foundCard.flavor_text}
                </p>
              </>
            ) : null}
            {(translatedText || translatedFlavor) && (
              <button
                onClick={handleTranslateClick}
                className="mt-1 text-xs text-[var(--accent)] underline"
              >
                Mostrar original
              </button>
            )}
          </div>

          <StatGrid card={foundCard} />

          <div className="flex flex-wrap gap-2">
            {types.slice(0, 2).map((item) => (
              <TagChip key={item}>{item}</TagChip>
            ))}
            <TagChip>{normalizeLabel(foundCard.rarity)}</TagChip>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-[12px] bg-green-500/20 p-3 text-green-400">
              {saveSuccess}
            </div>
          )}

          <div className="mt-auto flex gap-3">
            {user ? (
              <button
                onClick={handleSaveCard}
                disabled={isSaving || !!saveSuccess}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[12px] px-4 py-3 font-semibold transition ${
                  saveSuccess
                    ? "bg-green-500/20 text-green-400"
                    : "bg-[var(--accent)] text-white hover:opacity-90"
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Guardando...
                  </>
                ) : saveSuccess ? (
                  "Guardada"
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5" />
                    Guardar en mis cartas
                  </>
                )}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex flex-1 items-center justify-center gap-2 rounded-[12px] bg-[var(--accent)] px-4 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Iniciar sesión para guardar
              </Link>
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
