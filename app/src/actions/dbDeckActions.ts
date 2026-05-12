"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import type { UserDeck, DeckCardEntry, DeckCard, LorcanaCard } from "../types";
import { revalidatePath } from "next/cache";

export async function getUserDecksAction(): Promise<UserDeck[]> {
  const session = await getSession();
  if (!session) return [];

  const decks = await (prisma as any).deck.findMany({
    where: { userId: session.userId },
    include: {
      cards: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return decks.map((d: any) => ({
    id: d.id,
    userId: d.userId,
    name: d.name,
    description: d.description || "",
    format: d.format || "",
    strategy: d.strategy || "",
    tier: d.tier || "",
    inkColors: d.inkColors,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    cards: d.cards.map((c: any) => ({
      cardId: c.cardId,
      name: c.name,
      quantity: c.quantity,
    })),
  }));
}

export async function saveDeckAction(deck: UserDeck): Promise<UserDeck> {
  const session = await getSession();
  if (!session) throw new Error("No autenticado");

  // Si el ID empieza por "deck_", es un ID temporal del cliente, hay que crear uno nuevo en DB
  const isNew = deck.id.startsWith("deck_");

  const deckData = {
    name: deck.name,
    description: deck.description,
    format: deck.format,
    strategy: deck.strategy,
    tier: deck.tier,
    inkColors: deck.inkColors || [],
    userId: session.userId,
  };

  let savedDeck;

  if (isNew) {
    savedDeck = await (prisma as any).deck.create({
      data: {
        ...deckData,
        cards: {
          create: deck.cards.map((c: DeckCardEntry) => ({
            cardId: c.cardId,
            name: c.name,
            quantity: c.quantity,
          })),
        },
      },
      include: { cards: true },
    });
  } else {
    // Actualizar mazo existente
    await (prisma as any).deckCard.deleteMany({
      where: { deckId: deck.id },
    });

    savedDeck = await (prisma as any).deck.update({
      where: { id: deck.id, userId: session.userId },
      data: {
        ...deckData,
        cards: {
          create: deck.cards.map((c: DeckCardEntry) => ({
            cardId: c.cardId,
            name: c.name,
            quantity: c.quantity,
          })),
        },
      },
      include: { cards: true },
    });
  }

  revalidatePath("/mis-mazos");

  return {
    id: savedDeck.id,
    userId: savedDeck.userId,
    name: savedDeck.name,
    description: savedDeck.description || "",
    format: savedDeck.format || "",
    strategy: savedDeck.strategy || "",
    tier: savedDeck.tier || "",
    inkColors: savedDeck.inkColors,
    createdAt: savedDeck.createdAt.toISOString(),
    updatedAt: savedDeck.updatedAt.toISOString(),
    cards: savedDeck.cards.map((c: any) => ({
      cardId: c.cardId,
      name: c.name,
      quantity: c.quantity,
    })),
  };
}

export async function deleteDeckAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("No autenticado");

  await (prisma as any).deck.delete({
    where: { id, userId: session.userId },
  });

  revalidatePath("/mis-mazos");
}

export async function migrateLocalDecksAction(decks: UserDeck[]): Promise<void> {
  const session = await getSession();
  if (!session) return;

  for (const deck of decks) {
    try {
      await saveDeckAction(deck);
    } catch (e) {
      console.error("Error migrando mazo:", e);
    }
  }
}

export async function enrichDeckCardsAction(cards: DeckCardEntry[]): Promise<{ enrichedCards: DeckCard[], fullCards: LorcanaCard[] }> {
  const fullCards: LorcanaCard[] = [];
  
  try {
    const { fetchAllCardsAction } = await import("./galleryActions");
    const allCardsPool = await fetchAllCardsAction();

    const enrichedCards = cards.map((entry) => {
      const q = entry.name.trim().toLowerCase();
      const card = allCardsPool.find(c => c.name?.toLowerCase() === q) || 
                   allCardsPool.find(c => c.name?.toLowerCase().includes(q)) ||
                   allCardsPool[0];
      
      if (card) {
        const cardIdStr = String(card.id);
        if (!fullCards.find(f => String(f.id) === cardIdStr)) {
          fullCards.push(card);
        }

        return {
          cardId: cardIdStr,
          name: card.name || entry.name,
          quantity: entry.quantity,
          cost: card.cost ?? null,
          ink: card.ink ?? null,
          type: Array.isArray(card.type) ? card.type[0] : (card.type || null),
          rarity: card.rarity ?? null,
          image: card.image_uris?.digital?.large || card.image_uris?.digital?.normal || card.image_uris?.digital?.small || null,
          details: card,
        };
      }

      return {
        cardId: entry.cardId || `fallback-${entry.name}`,
        name: entry.name,
        quantity: entry.quantity,
        cost: null,
        ink: null,
        type: null,
        rarity: null,
        image: null,
      };
    });

    const sortedEnriched = enrichedCards.sort((a, b) => {
      const costDiff = (a.cost ?? 99) - (b.cost ?? 99);
      if (costDiff !== 0) return costDiff;
      return a.name.localeCompare(b.name);
    });

    return { enrichedCards: sortedEnriched, fullCards };
  } catch (error) {
    console.error("Error in enrichDeckCardsAction:", error);
    return { 
      enrichedCards: cards.map(c => ({
        cardId: c.cardId || `fallback-${c.name}`,
        name: c.name,
        quantity: c.quantity,
        cost: null,
        ink: null,
        type: null,
        rarity: null,
        image: null,
      })), 
      fullCards: [] 
    };
  }
}
