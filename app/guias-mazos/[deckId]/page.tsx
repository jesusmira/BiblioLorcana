"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  GalleryCardModal,
} from "../../components";
import { InkDot, ManaCurve, InkBreakdown, DeckCardRow } from "../../_shared/_components";
import type { DeckCard, LorcanaCard } from "../../types";

interface StarterDeckCard {
  id: string;
  cardId: string;
  name: string;
  quantity: number;
  ink: string;
  type: string;
  cost: number;
  rarity: string;
  subtypes?: string | null;
  abilities?: string | null;
  imageUrl?: string | null;
  set?: string;
  strength?: number | null;
  willpower?: number | null;
  lore?: number | null;
  flavorText?: string | null;
}

interface StarterDeckData {
  id: string;
  name: string;
  set: string;
  inks: string[];
  description: string;
  profile: string;
  cards: StarterDeckCard[];
}

const getInkEnglish = (ink: string): string => {
  const map: Record<string, string> = {
    "Ámbar": "Amber",
    "Amatista": "Amethyst",
    "Esmeralda": "Emerald",
    "Rubí": "Ruby",
    "Zafiro": "Sapphire",
    "Acero": "Steel",
  };
  return map[ink] || ink;
};

const getInkSpanish = (ink: string): string => {
  const map: Record<string, string> = {
    Amber: "Ámbar",
    Amethyst: "Amatista",
    Emerald: "Esmeralda",
    Ruby: "Rubí",
    Sapphire: "Zafiro",
    Steel: "Acero",
  };
  return map[ink] || ink;
};

export default function DeckDetailPage() {
  const params = useParams();
  const deckId = params.deckId as string;
  const [deck, setDeck] = useState<StarterDeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<LorcanaCard | null>(null);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch("/api/starter-decks");
        const decks: StarterDeckData[] = await response.json();
        const foundDeck = decks.find((d) => d.id === deckId);
        if (foundDeck) {
          setDeck(foundDeck);
        }
      } catch (error) {
        console.error("Error fetching deck:", error);
      } finally {
        setLoading(false);
      }
    };

    if (deckId) {
      fetchDeck();
    }
  }, [deckId]);

  const handleCardClick = (cardId: string) => {
    if (deck) {
      const card = deck.cards.find((c) => c.cardId === cardId);
      if (card) {
        const [setNum] = card.cardId.split("-");
        setSelectedCard({
          id: card.cardId,
          name: card.name,
          cost: card.cost,
          ink: card.ink,
          type: card.type ? [card.type] : null,
          rarity: card.rarity,
          text: card.abilities || null,
          set: { name: deck.set },
          collector_number: card.cardId,
          version: card.name,
          image_uris: {
            digital: {
              normal: card.imageUrl || null,
              large: card.imageUrl || null,
              small: card.imageUrl || null,
            },
          },
          classifications: card.subtypes ? card.subtypes.split(", ").map(s => s.trim()) : null,
          strength: card.strength ?? null,
          willpower: card.willpower ?? null,
          lore: card.lore ?? null,
          flavor_text: card.flavorText || null,
        });
      }
    }
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="text-[var(--muted)]">Cargando mazo...</p>
        </div>
      </main>
    );
  }

  if (!deck) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <SparklesIcon className="h-8 w-8 text-[var(--muted)]" />
          <p className="text-[var(--muted)]">Mazo no encontrado</p>
        </div>
      </main>
    );
  }

  const totalCards = deck.cards.reduce((acc, c) => acc + c.quantity, 0);

  const deckCards: DeckCard[] = deck.cards.map((card) => ({
    cardId: card.cardId,
    name: card.name,
    quantity: card.quantity,
    cost: card.cost,
    ink: card.ink,
    type: card.type,
    rarity: card.rarity,
    image: card.imageUrl || null,
  }));

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-5xl font-[var(--font-sans)]">
      <div className="mb-12 flex flex-col gap-4">
        <Link
          href="/guias-mazos"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a guías de mazos
        </Link>
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[var(--accent)]/10 p-3">
              <SparklesIcon className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="font-[var(--font-title)] text-4xl">{deck.name}</h1>
              <p className="text-[var(--muted)]">{deck.set}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] shadow-[var(--card-shadow)] overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--stroke)] px-6 py-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                {deck.inks.map((ink) => (
                  <InkDot key={ink} ink={getInkEnglish(ink)} />
                ))}
                <h2 className="font-[var(--font-title)] text-xl text-[var(--ink)]">
                  {deck.profile}
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{deck.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-bold text-[var(--accent)] tabular-nums">
                {totalCards} cartas
              </span>
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

            {deckCards.map((card, idx) => (
              <DeckCardRow
                key={`${card.cardId}-${idx}`}
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
            <ManaCurve cards={deckCards} />
          </div>

          <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              Distribución de Tinta
            </h3>
            <InkBreakdown cards={deckCards} />
          </div>

          <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              Estadísticas Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                  {totalCards}
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
                        ) / totalCards
                      ).toFixed(1)
                    : "0"}
                </span>
                <span className="text-[0.7rem] text-[var(--muted)]">Coste Medio</span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                  {deck.inks.length}
                </span>
                <span className="text-[0.7rem] text-[var(--muted)]">Tintas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GalleryCardModal selected={selectedCard} onClose={closeModal} />
    </main>
  );
}
