"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { GalleryCardModal } from "@/components";
import {
  InkDot,
  ManaCurve,
  InkBreakdown,
  DeckCardRow,
} from "@/components/lorcana";
import type { DeckCard, LorcanaCard } from "@/types";

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
    Ámbar: "Amber",
    Amatista: "Amethyst",
    Esmeralda: "Emerald",
    Rubí: "Ruby",
    Zafiro: "Sapphire",
    Acero: "Steel",
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

const CardsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" className={className} fill="currentColor">
    <path d="M637.15 146.22c-8.89 2.7-17.2 7.92-24.15 15.07l-6.95 7.15-88.68-10.24c-56.99-6.57-91.19-9.85-96.02-8.89-7.73 1.35-17.97 6.38-25.69 12.56-4.06 3.28-19.9 5.99-90.8 16.42-47.33 6.96-89.64 13.91-94.28 15.65-8.5 3.09-24.34 17.58-26.47 23.76-1.16 4.06-.97 4.06-86.55 36.13-29.75 11.21-57.19 21.83-61.24 23.96-17.77 9.08-29.17 32.26-25.69 52.16C12.36 340 187.2 807.91 194.93 822.79c4.83 9.66 17.77 20.29 29.37 24.15 17.19 5.6 23.57 3.86 127.9-35.55 90.8-34.39 97.95-36.71 116.88-39.03 17-1.93 23.76-1.93 41.54.58l21.25 2.9 63.75 37.67c35.16 20.67 67.23 38.64 71.48 39.8 17.2 4.83 34.97.38 48.11-11.98 6.76-6.38 36.71-55.64 139.48-230.29C926.56 488.75 986.64 385 988.19 380.17c5.6-17.39-2.32-42.7-16.42-53.71-10.43-7.92-296.94-176.19-305.25-179.28-7.92-2.7-21.83-3.28-29.37-.96zm170.79 111.09c90.42 53.32 150.3 89.84 152.43 92.93 6.18 8.31 6.38 19.9.58 31.1-2.71 5.21-62.02 106.26-131.95 224.68-78.05 132.14-129.05 216.76-132.34 219.08-2.71 2.13-9.27 4.25-14.49 4.64-9.08.97-10.24.39-81.72-41.92-39.8-23.57-74.96-44.44-77.86-46.17-82.69-48.11-146.25-86.17-149.73-89.83-6.18-5.99-8.5-17.39-5.41-26.08 1.93-5.8 128.09-221.02 238.98-408.03 26.86-45.21 29.37-48.11 45.21-48.11 6.77 0 27.05 11.59 156.3 87.71zm-293.85-74.77c43.28 5.02 78.44 9.66 78.24 10.43-.96 2.51-234.15 397.59-234.54 397.21-.58-.58 45.4-392.38 46.56-396.82 1.35-5.41 10.24-16.04 15.26-17.97 6.77-2.89 13.14-2.32 94.48 7.15zm-135.82 13.91c0 2.13-12.94 115.72-28.98 252.7-15.84 136.78-28.98 252.89-28.98 257.72 0 12.56 9.47 30.72 19.9 38.44 9.08 6.76 23.57 11.59 34.39 11.59 4.06 0 7.73.77 8.31 1.54 1.16 1.74-67.04 11.98-80.37 11.98-7.53 0-10.43-1.16-16.03-5.99-3.67-3.29-7.53-9.08-8.69-12.94-1.16-4.06-18.55-120.17-38.64-258.5-36.32-249.03-36.71-251.35-33.62-260.23 5.41-15.84 5.22-15.84 89.26-28.4 41.15-6.18 76.7-11.2 79.21-11.4 2.89-.18 4.24.98 4.24 3.49zm-198.21 61.44c.77 4.06 17.19 117.27 36.9 251.73 19.71 134.46 37.09 248.25 38.83 252.89 4.06 10.63 14.49 22.41 24.73 27.82 6.57 3.48 11.01 4.25 26.66 4.25 10.24-.19 18.55 0 18.35.19-2.71 2.71-80.56 29.75-85.59 29.75a28.41 28.41 0 0 1-20.48-9.08c-1.93-1.93-12.94-29.17-24.73-60.47C81.72 455.33 34.39 327.63 34.39 322.41c0-7.15 3.67-15.07 9.27-20.09 3.67-3.28 127.7-51.39 133.11-51.58 1.16 0 2.71 3.28 3.29 7.15zm240.52 452.65c29.95 17.39 53.52 32.07 52.36 32.46-4.44 1.55-107.42-11.59-113.41-14.49-3.48-1.54-8.11-5.99-10.43-9.66-3.86-6.18-4.06-8.5-2.9-25.7.58-10.24 1.74-21.25 2.32-24.34l1.16-5.6 8.11 7.73c4.64 4.25 32.85 22.02 62.79 39.6z"></path>
  </svg>
);

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
          classifications: card.subtypes
            ? card.subtypes.split(", ").map((s) => s.trim())
            : null,
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
          <CardsIcon className="h-8 w-8 text-[var(--muted)]" />
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
              <CardsIcon className="h-8 w-8 text-[var(--accent)]" />
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
                <span className="text-[0.7rem] text-[var(--muted)]">
                  Únicas
                </span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                  {deck.cards.length > 0
                    ? (
                        deck.cards.reduce(
                          (acc, c) => acc + (c.cost ?? 0) * c.quantity,
                          0,
                        ) / totalCards
                      ).toFixed(1)
                    : "0"}
                </span>
                <span className="text-[0.7rem] text-[var(--muted)]">
                  Coste Medio
                </span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-[var(--surface-soft)] p-3">
                <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                  {deck.inks.length}
                </span>
                <span className="text-[0.7rem] text-[var(--muted)]">
                  Tintas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GalleryCardModal selected={selectedCard} onClose={closeModal} />
    </main>
  );
}
