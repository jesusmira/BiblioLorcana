"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  extractTextFromImage,
  extractCollectorNumber,
  saveCardToUser,
} from "../actions";
import { fetchCardsBySetAction } from "../actions";
import { useAuth } from "../lib/auth";
import type { LorcanaCard } from "../types";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function ImageSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const imageParam = searchParams.get("image");

  const [imageData, setImageData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string | null>(null);
  const [collectorNumber, setCollectorNumber] = useState<string | null>(null);
  const [foundCard, setFoundCard] = useState<LorcanaCard | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [allCards, setAllCards] = useState<LorcanaCard[]>([]);

  useEffect(() => {
    if (imageParam) {
      setImageData(decodeURIComponent(imageParam));
    }
  }, [imageParam]);

  const searchCardByNumber = useCallback(async (number: string) => {
    setIsSearching(true);
    try {
      const setsResponse = await fetch("/api/lorcast/sets");
      if (!setsResponse.ok) throw new Error("Error al obtener sets");
      const sets = await setsResponse.json();

      for (const set of sets) {
        const cards = await fetchCardsBySetAction(set.id as string);
        const card = cards.find(
          (c) => c.collector_number === number
        );
        if (card) {
          setFoundCard(card);
          return;
        }
      }
      setError(`No se encontró ninguna carta con el número ${number}`);
    } catch (err) {
      setError("Error al buscar la carta");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const processImage = async () => {
    if (!imageData) return;

    setIsProcessing(true);
    setError(null);
    setDetectedText(null);
    setCollectorNumber(null);
    setFoundCard(null);
    setSaveSuccess(null);

    const result = await extractTextFromImage(imageData);

    if (!result.success) {
      setError(result.error || "Error al procesar la imagen");
      setIsProcessing(false);
      return;
    }

    setDetectedText(result.text || "");

    const number = await extractCollectorNumber(result.text || "");
    if (number) {
      setCollectorNumber(number);
      await searchCardByNumber(number);
    } else {
      setError(
        "No se pudo detectar el número de carta. Intenta hacer una foto más clara."
      );
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

  useEffect(() => {
    if (imageData) {
      processImage();
    }
  }, [imageData]);

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-2xl">
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

      {imageData && (
        <div className="mb-6 overflow-hidden rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)]">
          <img
            src={`data:image/jpeg;base64,${imageData}`}
            alt="Imagen subida"
            className="mx-auto max-h-[300px] object-contain p-4"
          />
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
          <p className="text-[var(--muted)]">
            Procesando imagen...
          </p>
        </div>
      )}

      {detectedText && (
        <div className="mb-4 rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-4">
          <p className="mb-2 text-[0.8rem] uppercase tracking-[1px] text-[var(--muted)]">
            Texto detectado
          </p>
          <p className="whitespace-pre-wrap text-[0.9rem] text-[var(--ink)]">
            {detectedText}
          </p>
        </div>
      )}

      {collectorNumber && (
        <div className="mb-4 rounded-[12px] border border-[var(--accent)] bg-[var(--accent)]/10 p-4">
          <p className="text-[0.8rem] uppercase tracking-[1px] text-[var(--accent)]">
            Número de carta detectado
          </p>
          <p className="text-xl font-bold text-[var(--ink)]">
            #{collectorNumber}
          </p>
        </div>
      )}

      {isSearching && (
        <div className="flex items-center gap-3 rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
          <p className="text-[var(--muted)]">Buscando carta...</p>
        </div>
      )}

      {foundCard && (
        <div className="flex flex-col gap-4 rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-6">
          <div className="flex gap-6 max-md:flex-col">
            <div className="w-48 shrink-0 max-md:mx-auto">
              <div className="grid aspect-[2/3] place-items-center rounded-[16px] bg-[var(--surface)] p-2">
                {foundCard.image_uris?.digital?.normal ? (
                  <Image
                    src={foundCard.image_uris.digital.normal}
                    alt={foundCard.name || "Carta"}
                    fill
                    className="rounded-[12px] object-contain"
                  />
                ) : (
                  <span className="text-[var(--muted)]">Sin imagen</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[0.75rem] uppercase tracking-[2px] text-[var(--muted)]">
                  {foundCard.set?.name} · {foundCard.collector_number}
                </p>
                <h2 className="font-[var(--font-title)] text-xl">
                  {foundCard.name}
                  {foundCard.version && `, ${foundCard.version}`}
                </h2>
              </div>
              <p className="whitespace-pre-line text-[var(--muted)]">
                {foundCard.text}
              </p>
              <div className="mt-auto flex flex-wrap gap-2">
                {foundCard.ink && (
                  <span className="rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[1px] bg-[var(--surface)]">
                    {foundCard.ink}
                  </span>
                )}
                {foundCard.cost !== null && foundCard.cost !== undefined && (
                  <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--cost-bg)] text-[var(--cost-ink)] font-bold">
                    {foundCard.cost}
                  </span>
                )}
                {foundCard.strength !== null && foundCard.strength !== undefined && (
                  <span className="rounded-full px-3 py-1 text-[0.8rem] bg-[var(--surface)]">
                    <span className="text-[var(--muted)]">F</span> {foundCard.strength}
                  </span>
                )}
                {foundCard.willpower !== null && foundCard.willpower !== undefined && (
                  <span className="rounded-full px-3 py-1 text-[0.8rem] bg-[var(--surface)]">
                    <span className="text-[var(--muted)]">W</span> {foundCard.willpower}
                  </span>
                )}
                {foundCard.lore !== null && foundCard.lore !== undefined && (
                  <span className="rounded-full px-3 py-1 text-[0.8rem] bg-[var(--surface)]">
                    <span className="text-[var(--muted)]">L</span> {foundCard.lore}
                  </span>
                )}
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-[12px] bg-green-500/20 p-3 text-green-400">
              <CheckIcon className="h-5 w-5" />
              {saveSuccess}
            </div>
          )}

          {user && (
            <div className="flex gap-3">
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
                  <>
                    <CheckIcon className="h-5 w-5" />
                    Guardada
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5" />
                    Guardar en mis cartas
                  </>
                )}
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-[12px] border border-[var(--stroke)] px-4 py-3 transition hover:bg-[var(--surface)]"
              >
                <XMarkIcon className="h-5 w-5" />
                Cerrar
              </Link>
            </div>
          )}

          {!user && (
            <div className="rounded-[12px] bg-[var(--surface)] p-4 text-center">
              <p className="mb-3 text-[var(--muted)]">
                Inicia sesión para guardar esta carta en tu colección
              </p>
              <Link
                href="/login"
                className="inline-block rounded-full bg-[var(--accent)] px-6 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
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