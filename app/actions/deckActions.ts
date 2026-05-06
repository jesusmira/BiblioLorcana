"use server";

import axios from "axios";
import { API } from "../lib/constants";
import type { LorcanaCard, Deck, DeckCard, DeckCardEntry } from "../types";
import { searchCardsWithFiltersAction } from "./galleryActions";

const DECK_TEMPLATES = [
  {
    name: "Dominio Ámbar-Amatista",
    description: "Un mazo de control que combina la resistencia del Ámbar con el poder arcano de la Amatista.",
    inks: ["Amber", "Amethyst"],
  },
  {
    name: "Agresión Esmeralda-Rubí",
    description: "Un mazo agresivo que aprovecha la velocidad del Rubí y la versatilidad de la Esmeralda.",
    inks: ["Emerald", "Ruby"],
  },
  {
    name: "Tormenta Acero-Zafiro",
    description: "Un mazo de tempo que usa la fuerza del Acero y la inteligencia del Zafiro.",
    inks: ["Steel", "Sapphire"],
  },
];

function getCardImage(card: LorcanaCard): string | null {
  return (
    card.image_uris?.digital?.normal ||
    card.image_uris?.digital?.small ||
    null
  );
}

function getCardType(card: LorcanaCard): string | null {
  if (Array.isArray(card.type) && card.type.length > 0) {
    return card.type[0];
  }
  return null;
}

export async function generateSampleDeck(): Promise<Deck> {
  const template = DECK_TEMPLATES[Math.floor(Math.random() * DECK_TEMPLATES.length)];

  // Fetch cards from the first available set
  let allCards: LorcanaCard[] = [];

  try {
    const setsRes = await axios.get(`${API.LORCAST_BASE}/sets`);
    const sets = setsRes.data.results || setsRes.data;

    // Pick a random set
    const randomSet = sets[Math.floor(Math.random() * sets.length)];
    const setCode = randomSet.code || randomSet.id;

    // Use the correct endpoint: /sets/{code}/cards
    const cardsRes = await axios.get(`${API.LORCAST_BASE}/sets/${setCode}/cards`);
    allCards = cardsRes.data.results || cardsRes.data || [];
  } catch (error) {
    console.error("Error fetching cards for sample deck:", error);
    return {
      id: "sample-1",
      name: template.name,
      description: template.description,
      inkColors: template.inks,
      cards: [],
      fullCards: [],
      totalCards: 0,
    };
  }

  // Filter by template inks
  const inkCards = allCards.filter(
    (c) => c.ink && template.inks.some((ink) => c.ink?.toLowerCase() === ink.toLowerCase())
  );

  // If not enough ink-matched cards, use all cards
  const pool = inkCards.length >= 15 ? inkCards : allCards;

  // Build a 60-card deck (max 4 copies per card, Lorcana rules)
  const deckCards: Map<string, DeckCard> = new Map();
  const fullCardsMap: Map<string, LorcanaCard> = new Map();
  let totalCards = 0;
  const TARGET = 60;

  // Shuffle the pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // First pass: add 2-4 copies of each card
  for (const card of shuffled) {
    if (totalCards >= TARGET) break;

    const cardId = String(card.id);
    const existing = deckCards.get(cardId);

    if (!existing) {
      const copies = Math.min(
        Math.floor(Math.random() * 3) + 2, // 2-4 copies
        TARGET - totalCards
      );
      deckCards.set(cardId, {
        cardId,
        name: card.name || "Carta Desconocida",
        quantity: copies,
        cost: card.cost ?? null,
        ink: card.ink ?? null,
        type: getCardType(card),
        rarity: card.rarity ?? null,
        image: getCardImage(card),
      });
      fullCardsMap.set(cardId, card);
      totalCards += copies;
    }
  }

  // Second pass: fill remaining slots
  if (totalCards < TARGET) {
    for (const [, dc] of deckCards) {
      if (totalCards >= TARGET) break;
      const canAdd = 4 - dc.quantity;
      if (canAdd > 0) {
        const toAdd = Math.min(canAdd, TARGET - totalCards);
        dc.quantity += toAdd;
        totalCards += toAdd;
      }
    }
  }

  // Sort by cost then by name
  const sortedCards = Array.from(deckCards.values()).sort((a, b) => {
    const costDiff = (a.cost ?? 99) - (b.cost ?? 99);
    if (costDiff !== 0) return costDiff;
    return a.name.localeCompare(b.name);
  });

  return {
    id: `sample-${Date.now()}`,
    name: template.name,
    description: template.description,
    inkColors: template.inks,
    cards: sortedCards,
    fullCards: Array.from(fullCardsMap.values()),
    totalCards,
  };
}

// Moved to dbDeckActions.ts

