"use client";

import Link from "next/link";
import { useImageSearch } from "./_hooks/useImageSearch";
import { useAuth } from "../lib/auth";
import { CardDetail } from "../_shared/_components";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ImageSearchPage() {
  const { user } = useAuth();
  const {
    isProcessing,
    isSearching,
    isSaving,
    isTranslating,
    saveSuccess,
    error,
    ocrData,
    isSpecialCard,
    foundCard,
    translatedText,
    translatedFlavor,
    handleSaveCard,
    handleTranslateClick,
  } = useImageSearch();

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

  return (
    <CardDetail
      card={foundCard}
      user={user}
      ocrData={ocrData}
      isSpecialCard={isSpecialCard}
      translatedText={translatedText}
      translatedFlavor={translatedFlavor}
      isTranslating={isTranslating}
      isSaving={isSaving}
      saveSuccess={saveSuccess}
      onTranslate={handleTranslateClick}
      onSave={handleSaveCard}
    />
  );
}