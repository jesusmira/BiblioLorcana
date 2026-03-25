"use server";

import { prisma } from "../lib/prisma";
import { getSession } from "../lib/auth-utils";
import type { LorcanaCard } from "../types";

interface SaveCardResponse {
  success: boolean;
  error?: string;
}

export async function saveCardToUser(cardData: LorcanaCard): Promise<SaveCardResponse> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Debes iniciar sesión para guardar cartas" };
  }

  const cardId = String(cardData.id);

  try {
    await prisma.card.upsert({
      where: { id: cardId },
      create: {
        id: cardId,
        name: cardData.name,
        text: cardData.text,
        flavorText: cardData.flavor_text,
        ink: cardData.ink,
        cost: cardData.cost,
        rarity: cardData.rarity,
        type: cardData.type as string[],
        strength: cardData.strength,
        willpower: cardData.willpower,
        lore: cardData.lore,
        collectorNumber: cardData.collector_number,
        classifications: cardData.classifications as string[],
        imageUrl: (cardData.image_uris as any)?.digital?.normal || (cardData.image_url as string) || null,
      },
      update: {
        name: cardData.name,
        text: cardData.text,
        flavorText: cardData.flavor_text,
        ink: cardData.ink,
        cost: cardData.cost,
        rarity: cardData.rarity,
        type: cardData.type as string[],
        strength: cardData.strength,
        willpower: cardData.willpower,
        lore: cardData.lore,
        collectorNumber: cardData.collector_number,
        classifications: cardData.classifications as string[],
        imageUrl: (cardData.image_uris as any)?.digital?.normal || (cardData.image_url as string) || null,
      },
    });

    await prisma.userCard.create({
      data: {
        userId: session.userId,
        cardId: cardId,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint") && error.message.includes("user_cards")) {
      return { success: false, error: "Esta carta ya está en tu colección" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al guardar la carta",
    };
  }
}

export async function removeCardFromUser(cardId: string): Promise<SaveCardResponse> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Debes iniciar sesión para eliminar cartas" };
  }

  try {
    await prisma.userCard.delete({
      where: {
        userId_cardId: {
          userId: session.userId,
          cardId: String(cardId),
        },
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar la carta de tu colección" };
  }
}

export async function getUserCards(): Promise<LorcanaCard[]> {
  const session = await getSession();
  if (!session) {
    return [];
  }

  const userCards = await prisma.userCard.findMany({
    where: { userId: session.userId },
    include: { card: true },
    orderBy: { createdAt: "desc" },
  });

  return userCards.map((uc) => ({
    id: uc.card.id,
    name: uc.card.name,
    text: uc.card.text,
    flavor_text: uc.card.flavorText,
    ink: uc.card.ink,
    cost: uc.card.cost,
    rarity: uc.card.rarity,
    type: uc.card.type as string[] | null,
    strength: uc.card.strength,
    willpower: uc.card.willpower,
    lore: uc.card.lore,
    collector_number: uc.card.collectorNumber,
    classifications: uc.card.classifications as string[] | null,
    image_url: uc.card.imageUrl,
  }));
}

export async function isCardSavedByUser(cardId: string): Promise<boolean> {
  const session = await getSession();
  if (!session) {
    return false;
  }

  const userCard = await prisma.userCard.findUnique({
    where: {
      userId_cardId: {
        userId: session.userId,
        cardId: String(cardId),
      },
    },
  });

  return !!userCard;
}