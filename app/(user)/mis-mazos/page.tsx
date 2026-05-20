"use client";

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
} from "@/components";
import { SparklesIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CardsIcon } from "@/components";
import { deleteDeckAction } from "@/actions/dbDeckActions";
import ExportDeckModal from "./_components/ExportDeckModal";

import { MyDecksSection } from "./_components/MyDecksSection";
import { PreviewDeckSection } from "./_components/PreviewDeckSection";

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

  const { deleteDeck } = useDecksStore();
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
    clearPreview,
  } = usePreviewDeck();

  useSyncDecks();
  const activeSelectedCard = previewSelectedCard || sampleSelectedCard;
  const activeCloseModal = previewDeck ? closePreviewModal : closeSampleModal;
  const activeCardClick = previewDeck
    ? handlePreviewCardClick
    : handleSampleCardClick;

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
          icon={<CardsIcon className="h-8 w-8" />}
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

        <MyDecksSection
          onDeleteConfirm={setDeleteConfirm}
          onExportDeck={setExportDeck}
          selectDeck={selectDeck}
        />

        <PreviewDeckSection
          previewDeck={previewDeck}
          displayDeck={displayDeck}
          hasDisplayDeck={hasDisplayDeck}
          isEnriching={isEnriching}
          isRegenerating={isRegenerating}
          activeCardClick={activeCardClick}
          clearPreview={clearPreview}
          regenerate={regenerate}
          fetchDeck={fetchDeck}
        />

        <GalleryCardModal
          selected={activeSelectedCard}
          onClose={activeCloseModal}
        />

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
