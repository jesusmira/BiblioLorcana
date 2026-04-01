"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../lib/auth";
import { getUserCards, removeCardFromUser } from "../actions";
import { useUserCardsStore } from "../store";
import {
  GalleryCardModal,
  ConfirmationDialog,
} from "../components";
import {
  FolderIcon,
  ArrowLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { LorcanaCard } from "../types";

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

function getCardImage(card: LorcanaCard): string | null {
  return (
    card.image_uris?.digital?.small ||
    card.image_uris?.digital?.normal ||
    null
  );
}

interface CardRowProps {
  card: LorcanaCard;
  onCardClick: (card: LorcanaCard) => void;
  onRemoveClick: (card: LorcanaCard) => void;
}

function CardRow({ card, onCardClick, onRemoveClick }: CardRowProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, below: false });
  const rowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const image = getCardImage(card);

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

  const cardType = Array.isArray(card.type) && card.type.length > 0 ? card.type[0] : null;

  return (
    <div
      ref={rowRef}
      className="group flex items-center gap-2 rounded-xl pr-4 pl-8 py-2.5 transition hover:bg-[var(--surface-soft)] cursor-pointer"
      onClick={() => onCardClick(card)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Quantity Badge */}
      <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-[var(--accent)]/10 px-1.5 text-sm font-bold text-[var(--accent)] tabular-nums">
        {card.quantity ?? 1}x
      </span>

      <InkDot ink={card.ink ?? null} />

      <span className="flex-1 text-sm font-medium text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors ml-2">
        {card.name}
        {card.version ? <span className="text-[var(--muted)]">, {card.version}</span> : null}
      </span>

      <div className="flex items-center gap-8">
        {cardType && (
          <span className="hidden sm:inline w-24 text-xs text-[var(--muted)] bg-[var(--surface-soft)] px-2 py-0.5 rounded-full text-center">
            {cardType}
          </span>
        )}

        {card.rarity && (
          <span className="hidden md:inline w-12 text-xs text-[var(--muted)] text-center">
            {card.rarity}
          </span>
        )}

        <span className="w-6 flex justify-center items-center h-6 rounded-full bg-[var(--surface-soft)] text-xs font-bold text-[var(--muted)]">
          {card.cost ?? "?"}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveClick(card);
        }}
        className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] opacity-0 transition group-hover:opacity-100 hover:bg-[var(--alert)]/10 hover:text-[var(--alert)]"
        aria-label="Eliminar carta"
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </button>

      {/* Image Tooltip — fixed position */}
      {showTooltip && image && (
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
              src={image}
              alt={card.name || "Carta"}
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


export default function MisCartasPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { setSavedCardIds, removeSavedCardId, cardQuantities } = useUserCardsStore();
  const [cards, setCards] = useState<LorcanaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<LorcanaCard | null>(null);
  const [confirmingCard, setConfirmingCard] = useState<LorcanaCard | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getUserCards();
        setCards(data);
        setSavedCardIds(data.map(c => String(c.id)));
        const quantities: Record<string, number> = {};
        data.forEach(c => {
          quantities[String(c.id)] = c.quantity ?? 1;
        });
        useUserCardsStore.setState({ cardQuantities: quantities });
      } catch {
        setError("Error al cargar las cartas desde tu colección.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchCards();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, setSavedCardIds]);

  useEffect(() => {
    const quantities = useUserCardsStore.getState().cardQuantities;
    if (Object.keys(quantities).length > 0) {
      const updatedCards = cards.map(c => ({
        ...c,
        quantity: quantities[String(c.id)] ?? c.quantity ?? 1,
      }));
      setCards(updatedCards);
    }
  }, [cardQuantities]);

  const uniqueCards = Object.keys(cardQuantities).length || cards.length;

  const totalCopies = useMemo(() => {
    const qtyKeys = Object.keys(cardQuantities);
    if (qtyKeys.length === 0) {
      return cards.reduce((sum, c) => sum + (c.quantity ?? 1), 0);
    }
    return Object.values(cardQuantities).reduce((sum, qty) => sum + qty, 0);
  }, [cards, cardQuantities]);

  const handleCardClick = useCallback((card: LorcanaCard) => {
    setSelectedCard(card);
  }, []);

  const handleRemoveClick = useCallback((card: LorcanaCard) => {
    setConfirmingCard(card);
  }, []);

  const handleConfirmDelete = async () => {
    if (!confirmingCard) return;
    const cardIdToRemove = String(confirmingCard.id);
    
    const result = await removeCardFromUser(cardIdToRemove);
    if (result.success) {
      const updatedCards = cards.filter((c) => String(c.id) !== cardIdToRemove);
      setCards(updatedCards);
      setSavedCardIds(updatedCards.map(c => String(c.id)));
      removeSavedCardId(cardIdToRemove);
      setConfirmingCard(null);
    }
  };

  const closeModal = useCallback(() => {
    setSelectedCard(null);
    const quantities: Record<string, number> = {};
    cards.forEach(c => {
      quantities[String(c.id)] = c.quantity ?? 1;
    });
    useUserCardsStore.setState({ cardQuantities: quantities });
  }, [cards]);

  const groupedCards = useMemo(() => {
    const groups = cards.reduce((acc, card) => {
      const setName = card.set?.name || "Otros";
      if (!acc[setName]) acc[setName] = [];
      acc[setName].push(card);
      return acc;
    }, {} as Record<string, LorcanaCard[]>);

    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as Record<string, LorcanaCard[]>);
  }, [cards, cardQuantities]);

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

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl font-[var(--font-sans)]">
      {/* Header */}
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
            {/* Column Headers */}
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