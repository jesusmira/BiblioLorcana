"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard, PageHeader } from "@/components";
import { ShareIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useDeckBuilder } from "./_hooks/useDeckBuilder";
import BuilderSearchPanel from "./_components/BuilderSearchPanel";
import BuilderDeckPanel from "./_components/BuilderDeckPanel";
import BuilderStatsPanel from "./_components/BuilderStatsPanel";
import BuilderExportModal from "./_components/BuilderExportModal";
import InkWarningModal from "./_components/InkWarningModal";

export default function EditDeckPage() {
  const params = useParams();
  const deckId = params.id as string;
  const [showExport, setShowExport] = useState(false);

  const {
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    deckFormat,
    setDeckFormat,
    deckStrategy,
    setDeckStrategy,
    deckTier,
    setDeckTier,
    cards,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isSaving,
    showInkWarning,
    setShowInkWarning,
    sets,
    filters,
    handleFilterChange,
    handleClearFilters,
    addCardToDeck,
    removeCardFromDeck,
    removeAllFromDeck,
    stats,
    validation,
    handleSaveDeck,
    error,
    isNewDeck,
  } = useDeckBuilder(deckId);

  const cardQuantities = cards.reduce((acc, c) => {
    acc[c.cardId] = c.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AuthGuard
      title={isNewDeck ? "Crear Mazo" : "Editar Mazo"}
      description="Inicia sesión para crear y gestionar tus propios mazos de Lorcana."
      icon={<SparklesIcon className="h-12 w-12" />}
    >
      <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-[1400px] font-[var(--font-sans)]">
        <PageHeader
          title={isNewDeck ? "Constructor de Mazos" : "Editar Mazo"}
          description={isNewDeck ? "Crea tu estrategia perfecta" : `Editando: ${deckName}`}
          backHref="/mis-mazos"
          actions={
            <div className="flex gap-3">
              <button
                onClick={() => setShowExport(true)}
                disabled={cards.length === 0}
                className="flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--surface)] px-5 py-2 text-sm font-bold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
              >
                <ShareIcon className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={handleSaveDeck}
                disabled={!validation.isValid || isSaving}
                className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 shadow-lg shadow-[var(--accent)]/20"
              >
                {isSaving ? "Guardando..." : "Guardar mazo"}
              </button>
            </div>
          }
        />

        {error && (
          <div className="mb-6 rounded-xl bg-[var(--alert-bg)] p-4 text-[var(--alert-ink)] border border-[var(--alert-ink)]/20 flex items-center gap-3">
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px_300px]">
          {/* Panel de Búsqueda */}
          <BuilderSearchPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
            sets={sets}
            searchResults={searchResults}
            cardQuantities={cardQuantities}
            addCardToDeck={addCardToDeck}
          />

          {/* Panel del Mazo */}
          <BuilderDeckPanel
            deckName={deckName}
            setDeckName={setDeckName}
            deckDescription={deckDescription}
            setDeckDescription={setDeckDescription}
            deckFormat={deckFormat}
            setDeckFormat={setDeckFormat}
            deckStrategy={deckStrategy}
            setDeckStrategy={setDeckStrategy}
            deckTier={deckTier}
            setDeckTier={setDeckTier}
            cards={cards}
            stats={stats}
            validation={validation}
            addCardToDeck={addCardToDeck}
            removeCardFromDeck={removeCardFromDeck}
            removeAllFromDeck={removeAllFromDeck}
          />

          {/* Panel de Estadísticas */}
          <BuilderStatsPanel
            cards={cards}
            stats={stats}
          />
        </div>

        <InkWarningModal
          isOpen={showInkWarning}
          onClose={() => setShowInkWarning(false)}
        />

        <BuilderExportModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          deckName={deckName}
          deckDescription={deckDescription}
          deckFormat={deckFormat}
          deckStrategy={deckStrategy}
          deckTier={deckTier}
          cards={cards}
          totalCards={stats.totalCards}
        />
      </main>
    </AuthGuard>
  );
}