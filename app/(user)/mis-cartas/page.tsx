"use client";

import { useMisCartas } from "./_hooks/useMisCartas";
import {
  GalleryCardModal,
  ConfirmationDialog,
  AuthGuard,
  PageHeader,
  EmptyState,
} from "@/components";
import { CardRow } from "@/components/lorcana";
import { FolderIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function MisCartasPage() {
  const {
    loading,
    error,
    selectedCard,
    confirmingCard,
    uniqueCards,
    totalCopies,
    groupedCards,
    handleCardClick,
    handleRemoveClick,
    handleConfirmDelete,
    closeModal,
    setConfirmingCard,
  } = useMisCartas();

  const cards = Object.values(groupedCards).flat();

  return (
    <AuthGuard
      title="Mis Cartas"
      description="Inicia sesión para registrar y gestionar tu propia colección de Lorcana."
      icon={<FolderIcon className="h-12 w-12" />}
      isLoading={loading}
      loadingMessage="Consultando tu colección..."
    >
      <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl font-[var(--font-sans)]">
        <PageHeader
          title="Mi Colección"
          description={`${uniqueCards} ${uniqueCards === 1 ? "carta única" : "cartas únicas"} · ${totalCopies} ${totalCopies === 1 ? "copia total" : "copias totales"} · ${Object.keys(groupedCards).length} ${Object.keys(groupedCards).length === 1 ? "set" : "sets"}`}
          icon={<FolderIcon className="h-8 w-8" />}
        />

        {error ? (
          <EmptyState
            title="Error al cargar"
            description={error}
            action={
              <Link href="/" className="text-[var(--accent)] underline">
                Volver a la galería
              </Link>
            }
          />
        ) : cards.length === 0 ? (
          <EmptyState
            icon={<FolderIcon className="h-12 w-12" />}
            title="Tu carpeta está vacía"
            description="Explora la galería y usa el icono de carpeta para añadir cartas a tu colección personal."
            action={
              <Link
                href="/"
                className="rounded-full bg-[var(--foreground)] px-8 py-3 font-bold text-[var(--surface)] transition hover:opacity-90 active:scale-95 inline-block"
              >
                Explorar cartas
              </Link>
            }
          />
        ) : (
          <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] shadow-[var(--card-shadow)] overflow-visible">
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 pr-4 pl-8 py-2 text-[0.7rem] uppercase tracking-wider text-[var(--muted)]">
                <span className="flex h-7 min-w-[1.75rem] items-center justify-center">QTY</span>
                <span className="w-3" />
                <span className="flex-1 ml-2">Nombre</span>
                <span className="flex items-center gap-8">
                  <span className="hidden sm:inline w-24 text-center">Tipo</span>
                  <span className="hidden md:inline w-12 text-center">Rareza</span>
                  <span className="w-6 flex justify-center">⬡</span>
                </span>
                <span className="w-6" />
              </div>

              <div className="flex flex-col gap-2">
                {Object.entries(groupedCards).map(([setName, setCards]) => (
                  <div key={setName} className="flex flex-col gap-1">
                    <div className="px-4 py-2.5 bg-[var(--surface-soft)]/20 flex items-center gap-3 rounded-t-lg border-b border-[var(--stroke)]/30 mb-1">
                      <FolderIcon className="h-4 w-4 text-[var(--muted)]" />
                      <span className="font-[var(--font-title)] text-sm  text-[var(--ink)]">
                        {setName}
                      </span>
                    </div>
                    {setCards
                      .sort((a, b) => {
                        const costDiff = (a.cost ?? 99) - (b.cost ?? 99);
                        if (costDiff !== 0) return costDiff;
                        return (a.name ?? "").localeCompare(b.name ?? "");
                      })
                      .map((card) => (
                        <CardRow
                          key={card.id}
                          card={card}
                          onCardClick={handleCardClick}
                          onRemoveClick={handleRemoveClick}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <GalleryCardModal
          selected={selectedCard}
          onClose={closeModal}
          hideActions={true}
        />

        <ConfirmationDialog
          isOpen={!!confirmingCard}
          title="¿Eliminar de tu colección?"
          message={`¿Estás seguro de que quieres quitar a "${confirmingCard?.name}" de tu carpeta personal?`}
          confirmLabel="Eliminar carta"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmingCard(null)}
          isDestructive={true}
        />
      </main>
    </AuthGuard>
  );
}
