"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth";
import { useMisCartas } from "./_hooks/useMisCartas";
import {
  GalleryCardModal,
  ConfirmationDialog,
} from "../components";
import { CardRow } from "../_shared/_components";
import {
  FolderIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function MisCartasPage() {
  const { user, isLoading: authLoading } = useAuth();
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

  if (authLoading || loading) {
    return (
      <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
          <p className="text-[var(--muted)]">Consultando tu colección...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl text-center">
        <div className="mb-6 rounded-full bg-[var(--surface-soft)] p-6">
          <FolderIcon className="h-12 w-12 text-[var(--muted)]" />
        </div>
        <h1 className="mb-4 font-[var(--font-title)] text-3xl">Mis Cartas</h1>
        <p className="mb-8 text-[var(--muted)] text-lg">
          Inicia sesión para registrar y gestionar tu propia colección de Lorcana.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-[var(--accent)] px-8 py-3.5 font-bold text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl text-center">
        <p className="text-[var(--alert)] bg-[var(--alert)]/10 px-4 py-2 rounded-lg">{error}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Volver a la galería
        </Link>
      </main>
    );
  }

  const cards = Object.values(groupedCards).flat();

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
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-[var(--accent)]/10 p-3">
            <FolderIcon className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="font-[var(--font-title)] text-4xl">Mi Colección</h1>
            <p className="text-[var(--muted)]">
              {uniqueCards} {uniqueCards === 1 ? "carta única" : "cartas únicas"} · {totalCopies} {totalCopies === 1 ? "copia total" : "copias totales"} · {Object.keys(groupedCards).length} {Object.keys(groupedCards).length === 1 ? "set" : "sets"}
            </p>
          </div>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center gap-6 rounded-[24px] border border-[var(--stroke)] bg-[var(--surface-soft)]/50 p-16 text-center backdrop-blur-sm">
          <div className="rounded-full bg-[var(--surface)] p-6 shadow-inner">
            <FolderIcon className="h-12 w-12 text-[var(--muted)] opacity-40" />
          </div>
          <div className="max-w-xs">
            <h2 className="mb-2 text-xl font-bold">Tu carpeta está vacía</h2>
            <p className="text-[var(--muted)]">
              Explora la galería y usa el icono de carpeta para añadir cartas a tu colección personal.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-[var(--foreground)] px-8 py-3 font-bold text-[var(--surface)] transition hover:opacity-90 active:scale-95"
          >
            Explorar cartas
          </Link>
        </div>
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
                    <span className="font-[var(--font-title)] text-sm font-bold text-[var(--ink)]">
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
  );
}