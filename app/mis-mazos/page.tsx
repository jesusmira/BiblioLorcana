"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth";
import { useMisMazos } from "./_hooks/useMisMazos";
import {
  GalleryCardModal,
} from "../components";
import {
  InkDot,
  ManaCurve,
  InkBreakdown,
  DeckCardRow,
} from "../_shared/_components";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { spinner } from "../lib/styles";

export default function MisMazosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    deck,
    loading,
    isRegenerating,
    selectedCard,
    regenerate,
    handleCardClick,
    closeModal,
    fetchDeck,
  } = useMisMazos();

  if (authLoading || loading) {
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
          Inicia sesión para ver mazos de ejemplo y crear los tuyos propios.
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

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl font-[var(--font-sans)]">
      <div className="mb-12 flex flex-col gap-4">
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
                Mazos de prueba generados con cartas reales
              </p>
            </div>
          </div>
        </div>
      </div>

      {deck && deck.cards.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] shadow-[var(--card-shadow)] overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--stroke)] px-6 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  {deck.inkColors.map((ink) => (
                    <InkDot key={ink} ink={ink} />
                  ))}
                  <h2 className="font-[var(--font-title)] text-xl text-[var(--ink)]">
                    {deck.name}
                  </h2>
                </div>
                <p className="text-sm text-[var(--muted)]">
                  {deck.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-bold text-[var(--accent)] tabular-nums">
                  {deck.totalCards} cartas
                </span>
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

              {deck.cards.map((card) => (
                <DeckCardRow
                  key={card.cardId}
                  card={card}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Curva de Maná
              </h3>
              <ManaCurve cards={deck.cards} />
            </div>

            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Distribución de Tinta
              </h3>
              <InkBreakdown cards={deck.cards} />
            </div>

            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Estadísticas Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {deck.totalCards}
                  </span>
                  <span className="text-[0.7rem] text-[var(--muted)]">Total</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {deck.cards.length}
                  </span>
                  <span className="text-[0.7rem] text-[var(--muted)]">Únicas</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {deck.cards.length > 0
                      ? (
                          deck.cards.reduce(
                            (acc, c) => acc + (c.cost ?? 0) * c.quantity,
                            0
                          ) / deck.totalCards
                        ).toFixed(1)
                      : "0"}
                  </span>
                  <span className="text-[0.7rem] text-[var(--muted)]">Coste Medio</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                  <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {deck.inkColors.length}
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

      <GalleryCardModal selected={selectedCard} onClose={closeModal} />
    </main>
  );
}