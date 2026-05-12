"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDecksStore } from "@/store";
import { useMisMazos } from "./_hooks/useMisMazos";
import { usePreviewDeck } from "./_hooks/usePreviewDeck";
import { useSyncDecks } from "./_hooks/useSyncDecks";
import {
  GalleryCardModal,
  ConfirmationDialog,
  AuthGuard,
  PageHeader,
  EmptyState,
} from "@/components";
import {
  InkDot,
  ManaCurve,
  InkBreakdown,
  DeckCardRow,
  DeckListCard,
} from "@/components/lorcana";
import {
  ArrowPathIcon,
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { spinner } from "@/lib/styles";
import { deleteDeckAction } from "@/actions/dbDeckActions";
import type { DeckCard } from "@/types";
import ExportDeckModal from "./_components/ExportDeckModal";

export default function MisMazosPage() {
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
  const [exportDeck, setExportDeck] = useState<any | null>(null);
  
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

  useSyncDecks();
  const activeSelectedCard = previewSelectedCard || sampleSelectedCard;
  const activeCloseModal = previewDeck ? closePreviewModal : closeSampleModal;
  const activeCardClick = previewDeck ? handlePreviewCardClick : handleSampleCardClick;

  const displayDeck = enrichedDeck ?? sampleDeck;
  const hasDisplayDeck = displayDeck !== null && displayDeck.cards.length > 0;

  return (
    <AuthGuard
      title="Mis Mazos"
      description="Inicia sesión para crear, gestionar y compartir tus mazos de Lorcana."
      icon={<SparklesIcon className="h-12 w-12" />}
      isLoading={sampleLoading}
      loadingMessage="Generando mazo de prueba..."
    >
      <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl font-[var(--font-sans)]">
        <PageHeader
          title="Mis Mazos"
          description="Crea, gestiona y comparte tus mazos de Lorcana"
          icon={<SparklesIcon className="h-8 w-8" />}
          actions={
            <button
              onClick={() => router.push("/mis-mazos/crear")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-bold text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20"
            >
              <PlusIcon className="h-5 w-5" />
              Crear nuevo mazo
            </button>
          }
        />

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
            <EmptyState
              icon={<SparklesIcon className="h-12 w-12" />}
              title="No se pudo generar el mazo"
              description="Intenta de nuevo o verifica tu conexión."
              action={
                <button
                  onClick={fetchDeck}
                  className="rounded-full bg-[var(--foreground)] px-8 py-3 font-bold text-[var(--surface)] transition hover:opacity-90 active:scale-95"
                >
                  Reintentar
                </button>
              }
            />
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
                await deleteDeckAction(deleteConfirm);
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
          <ExportDeckModal
            deck={exportDeck}
            onClose={() => setExportDeck(null)}
          />
        )}
      </main>
    </AuthGuard>
  );
}
