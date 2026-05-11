"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useDecksStore } from "@/store";
import { useMisMazos } from "./_hooks/useMisMazos";
import { usePreviewDeck } from "./_hooks/usePreviewDeck";
import { useSyncDecks } from "./_hooks/useSyncDecks";
import {
  GalleryCardModal,
  ConfirmationDialog,
} from "@/components";
import {
  InkDot,
  ManaCurve,
  InkBreakdown,
  DeckCardRow,
  DeckListCard,
} from "@/components/lorcana";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { spinner } from "@/lib/styles";
import { deleteDeckAction } from "@/actions/dbDeckActions";
import type { UserDeck, DeckCard } from "@/types";

export default function MisMazosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const {
    deck: sampleDeck,
    loading: sampleLoading,
    isRegenerating,
    selectedCard: sampleSelectedCard,
    regenerate,
    handleCardClick: handleSampleCardClick,
    closeModal: closeSampleModal,
    fetchDeck,
  } = useMisMazos();

  const { decks, deleteDeck, duplicateDeck } = useDecksStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [exportDeck, setExportDeck] = useState<UserDeck | null>(null);
  
  const { 
    previewDeck, 
    enrichedDeck, 
    isEnriching, 
    selectedCard: previewSelectedCard,
    selectDeck, 
    handleCardClick: handlePreviewCardClick,
    closeModal: closePreviewModal,
    clearPreview 
  } = usePreviewDeck();

  const { sync: syncDecks } = useSyncDecks();
  const activeSelectedCard = previewSelectedCard || sampleSelectedCard;
  const activeCloseModal = previewDeck ? closePreviewModal : closeSampleModal;
  const activeCardClick = previewDeck ? handlePreviewCardClick : handleSampleCardClick;

  const isLoading = authLoading || sampleLoading;

  const displayDeck = enrichedDeck ?? sampleDeck;
  const hasDisplayDeck = displayDeck !== null && displayDeck.cards.length > 0;

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="text-[var(--muted)]">Generando mazo de prueba...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl text-center">
        <div className="mb-6 rounded-full bg-[var(--surface-soft)] p-6">
          <SparklesIcon className="h-12 w-12 text-[var(--muted)]" />
        </div>
        <h1 className="mb-4 font-[var(--font-title)] text-3xl">Mis Mazos</h1>
        <p className="mb-8 text-[var(--muted)] text-lg">
          Inicia sesión para crear, gestionar y compartir tus mazos de Lorcana.
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-full bg-[var(--accent)] px-8 py-3.5 font-bold text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20"
          >
            Iniciar sesión
          </Link>
        </div>

      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl font-[var(--font-sans)]">
      <div className="mb-8 flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a la galería
        </Link>
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[var(--accent)]/10 p-3">
              <SparklesIcon className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="font-[var(--font-title)] text-4xl">Mis Mazos</h1>
              <p className="text-[var(--muted)]">
                Crea, gestiona y comparte tus mazos de Lorcana
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/mis-mazos/crear")}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-bold text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20"
        >
          <PlusIcon className="h-5 w-5" />
          Crear nuevo mazo
        </button>
      </div>

      {decks.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 font-[var(--font-title)] text-2xl text-[var(--ink)]">
            Mis mazos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((d) => (
              <DeckListCard
                key={d.id}
                deck={d}
                onDelete={setDeleteConfirm}
                onDuplicate={(id: string) => duplicateDeck(id)}
                onExport={setExportDeck}
                onDoubleClick={selectDeck}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[var(--font-title)] text-2xl text-[var(--ink)] flex items-center gap-3">
            {previewDeck ? `Vista previa: ${previewDeck.name}` : "Mazo de prueba"}
            {isEnriching && (
              <ArrowPathIcon className="h-5 w-5 animate-spin text-[var(--accent)]" />
            )}
          </h2>
          {previewDeck && (
            <button
              onClick={clearPreview}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--stroke)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Volver al mazo de prueba
            </button>
          )}
        </div>
        {hasDisplayDeck && displayDeck ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] shadow-[var(--card-shadow)] overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--stroke)] px-6 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  {displayDeck.inkColors.map((ink: string) => (
                    <InkDot key={ink} ink={ink} />
                  ))}
                  <h2 className="font-[var(--font-title)] text-xl text-[var(--ink)]">
                    {displayDeck.name}
                  </h2>
                </div>
                <p className="text-sm text-[var(--muted)]">
                  {displayDeck.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-bold text-[var(--accent)] tabular-nums">
                  {displayDeck.totalCards} cartas
                </span>
                {!previewDeck && (
                  <button
                    onClick={regenerate}
                    disabled={isRegenerating}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
                    aria-label="Generar nuevo mazo"
                  >
                    <ArrowPathIcon
                      className={spinner(isRegenerating)}
                    />
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-[var(--stroke)]/30 px-2 py-2">
              <div className="flex items-center gap-3 px-4 py-2 text-[0.7rem] uppercase tracking-wider text-[var(--muted)]">
                <span className="min-w-[1.75rem] text-center">QTY</span>
                <span className="w-3" />
                <span className="flex-1">Nombre</span>
                <span className="hidden sm:inline w-16 text-left">Tipo</span>
                <span className="hidden md:inline w-12 text-left">Rareza</span>
                <span className="w-6 text-center">⬡</span>
              </div>

              {displayDeck.cards.map((card: DeckCard) => (
                <DeckCardRow
                  key={card.cardId}
                  card={card}
                  onCardClick={activeCardClick}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Curva de Maná
              </h3>
              <ManaCurve cards={displayDeck.cards} />
            </div>

            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Distribución de Tinta
              </h3>
              <InkBreakdown cards={displayDeck.cards} />
            </div>

            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Estadísticas Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {displayDeck.totalCards}
                  </span>
                  <span className="text-[0.7rem] text-[var(--muted)]">Total</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {displayDeck.cards.length}
                  </span>
                  <span className="text-[0.7rem] text-[var(--muted)]">Únicas</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {displayDeck.cards.length > 0
                      ? (
                          displayDeck.cards.reduce(
                            (acc: number, c: DeckCard) => acc + (c.cost ?? 0) * c.quantity,
                            0
                          ) / displayDeck.totalCards
                        ).toFixed(1)
                      : "0"}
                  </span>
                  <span className="text-[0.7rem] text-[var(--muted)]">Coste Medio</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {displayDeck.inkColors.length}
                  </span>
                  <span className="text-[0.7rem] text-[var(--muted)]">Tintas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 rounded-[24px] border border-[var(--stroke)] bg-[var(--surface-soft)]/50 p-16 text-center backdrop-blur-sm">
          <div className="rounded-full bg-[var(--surface)] p-6 shadow-inner">
            <SparklesIcon className="h-12 w-12 text-[var(--muted)] opacity-40" />
          </div>
          <div className="max-w-xs">
            <h2 className="mb-2 text-xl font-bold">No se pudo generar el mazo</h2>
            <p className="text-[var(--muted)]">
              Intenta de nuevo o verifica tu conexión.
            </p>
          </div>
          <button
            onClick={fetchDeck}
            className="rounded-full bg-[var(--foreground)] px-8 py-3 font-bold text-[var(--surface)] transition hover:opacity-90 active:scale-95"
          >
            Reintentar
          </button>
        </div>
      )}

      </div>

      <GalleryCardModal selected={activeSelectedCard} onClose={activeCloseModal} />

      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar mazo?"
        message={`¿Estás seguro de que quieres eliminar este mazo? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (deleteConfirm) {
            try {
              if (user) {
                await deleteDeckAction(deleteConfirm);
              }
              deleteDeck(deleteConfirm);
            } catch (error) {
              console.error("Error al eliminar mazo:", error);
            }
            setDeleteConfirm(null);
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
        isDestructive={true}
      />

      {exportDeck && (
        <ExportModal
          deck={exportDeck}
          onClose={() => setExportDeck(null)}
        />
      )}

    </main>
  );
}


function ExportModal({
  deck,
  onClose,
}: {
  deck: UserDeck;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const textExport = `Mazo: ${deck.name}
${deck.description ? `Descripción: ${deck.description}` : ""}
${deck.cards
  .filter((c) => c.quantity > 0)
  .map((c) => `${c.quantity}x ${c.name}`)
  .join("\n")}
---
Total: ${deck.cards.reduce((acc, c) => acc + c.quantity, 0)} cartas`;

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-2xl">
        <h2 className="mb-4 font-[var(--font-title)] text-xl text-[var(--ink)]">
          Exportar mazo
        </h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Comparte tu mazo usando uno de los formatos disponibles.
        </p>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--ink)]">Texto plano</span>
            <button
              onClick={() => copyToClipboard(textExport, "text")}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              {copied === "text" ? "Copiado ✓" : "Copiar"}
            </button>
          </div>
          <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-soft)] p-3 text-xs text-[var(--ink)] whitespace-pre-wrap">
            {textExport}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-[var(--stroke)] py-2.5 font-bold text-[var(--ink)] transition hover:border-[var(--muted)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
