"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../lib/auth";
import { generateSampleDeck } from "../actions";
import { GalleryCardModal } from "../components";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { Deck, DeckCard, LorcanaCard } from "../types";

const INK_COLORS: Record<string, string> = {
  amber: "#F59E0B",
  amethyst: "#8B5CF6",
  emerald: "#10B981",
  ruby: "#EF4444",
  sapphire: "#3B82F6",
  steel: "#6B7280",
};

function getInkColor(ink: string | null): string {
  if (!ink) return "var(--muted)";
  return INK_COLORS[ink.toLowerCase()] || "var(--muted)";
}

function InkDot({ ink }: { ink: string | null }) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-full border border-white/20 shadow-sm"
      style={{ backgroundColor: getInkColor(ink) }}
      title={ink || ""}
    />
  );
}

function ManaCurve({ cards }: { cards: DeckCard[] }) {
  const costMap: Record<number, number> = {};
  let maxCount = 0;

  for (const card of cards) {
    const cost = card.cost ?? 0;
    const capped = Math.min(cost, 7);
    costMap[capped] = (costMap[capped] || 0) + card.quantity;
    if (costMap[capped] > maxCount) maxCount = costMap[capped];
  }

  return (
    <div className="flex items-end gap-1.5 h-20">
      {Array.from({ length: 8 }, (_, i) => {
        const count = costMap[i] || 0;
        const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[0.6rem] text-[var(--muted)] tabular-nums">
              {count || ""}
            </span>
            <div
              className="w-full rounded-t-sm bg-[var(--accent)] opacity-70 transition-all duration-500"
              style={{ height: `${Math.max(height, 4)}%` }}
            />
            <span className="text-[0.65rem] font-bold text-[var(--muted)]">
              {i === 7 ? "7+" : i}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function InkBreakdown({ cards }: { cards: DeckCard[] }) {
  const inkMap: Record<string, number> = {};
  let total = 0;

  for (const card of cards) {
    const ink = card.ink || "Otro";
    inkMap[ink] = (inkMap[ink] || 0) + card.quantity;
    total += card.quantity;
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(inkMap)
        .sort((a, b) => b[1] - a[1])
        .map(([ink, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={ink} className="flex items-center gap-3">
              <InkDot ink={ink} />
              <span className="text-sm font-medium text-[var(--ink)] min-w-[5rem]">
                {ink}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: getInkColor(ink),
                  }}
                />
              </div>
              <span className="text-xs text-[var(--muted)] tabular-nums min-w-[3rem] text-right">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
    </div>
  );
}

interface CardRowProps {
  card: DeckCard;
  onCardClick: (cardId: string) => void;
}

function CardRow({ card, onCardClick }: CardRowProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, below: false });
  const rowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const showBelow = spaceAbove < 300;
        setTooltipPos({
          x: rect.left + 16,
          y: showBelow ? rect.bottom + 8 : rect.top - 8,
          below: showBelow,
        });
      }
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  return (
    <div
      ref={rowRef}
      className="group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-[var(--surface-soft)] cursor-pointer"
      onClick={() => onCardClick(card.cardId)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-[var(--accent)]/10 px-1.5 text-sm font-bold text-[var(--accent)] tabular-nums">
        {card.quantity}x
      </span>

      <InkDot ink={card.ink} />

      <span className="flex-1 text-sm font-medium text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors">
        {card.name}
      </span>

      {card.type && (
        <span className="hidden sm:inline text-xs text-[var(--muted)] bg-[var(--surface-soft)] px-2 py-0.5 rounded-full text-left">
          {card.type}
        </span>
      )}

      {card.rarity && (
        <span className="hidden md:inline text-xs text-[var(--muted)] text-left">
          {card.rarity}
        </span>
      )}

      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-soft)] text-xs font-bold text-[var(--muted)]">
        {card.cost ?? "?"}
      </span>

      {/* Image Tooltip — fixed position to avoid overflow clipping */}
      {showTooltip && card.image && (
        <div
          className="fixed z-[60] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: `${tooltipPos.x}px`,
            top: tooltipPos.below ? `${tooltipPos.y}px` : undefined,
            bottom: tooltipPos.below ? undefined : `${window.innerHeight - tooltipPos.y}px`,
          }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--stroke)] bg-[var(--surface)]">
            <Image
              src={card.image}
              alt={card.name}
              width={200}
              height={280}
              className="block rounded-xl"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function MisMazosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<LorcanaCard | null>(null);

  const fetchDeck = async () => {
    setLoading(true);
    try {
      const data = await generateSampleDeck();
      setDeck(data);
    } catch {
      setDeck(null);
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    setIsRegenerating(true);
    try {
      const data = await generateSampleDeck();
      setDeck(data);
    } catch {
      /* noop */
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (!deck) return;
      const fullCard = deck.fullCards.find((c) => String(c.id) === cardId);
      if (fullCard) setSelectedCard(fullCard);
    },
    [deck]
  );

  const closeModal = useCallback(() => {
    setSelectedCard(null);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchDeck();
    }
  }, [authLoading]);

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
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a la galería
        </Link>
        <div className="flex flex-col items-center gap-4">
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
          {/* Left: Card List */}
          <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] shadow-[var(--card-shadow)] overflow-hidden">
            {/* Deck Header */}
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
                    className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Card List */}
            <div className="divide-y divide-[var(--stroke)]/30 px-2 py-2">
              {/* Column Headers */}
              <div className="flex items-center gap-3 px-4 py-2 text-[0.7rem] uppercase tracking-wider text-[var(--muted)]">
                <span className="min-w-[1.75rem] text-center">QTY</span>
                <span className="w-3" />
                <span className="flex-1">Nombre</span>
                <span className="hidden sm:inline w-16 text-left">Tipo</span>
                <span className="hidden md:inline w-12 text-left">Rareza</span>
                <span className="w-6 text-center">⬡</span>
              </div>

              {deck.cards.map((card) => (
                <CardRow
                  key={card.cardId}
                  card={card}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          {/* Right: Deck Stats */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {/* Mana Curve */}
            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Curva de Maná
              </h3>
              <ManaCurve cards={deck.cards} />
            </div>

            {/* Ink Breakdown */}
            <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Distribución de Tinta
              </h3>
              <InkBreakdown cards={deck.cards} />
            </div>

            {/* Quick Stats */}
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

      {/* Card Detail Modal */}
      <GalleryCardModal selected={selectedCard} onClose={closeModal} />
    </main>
  );
}
