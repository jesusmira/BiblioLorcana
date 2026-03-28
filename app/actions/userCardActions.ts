"use server";

import { prisma } from "../lib/prisma";
import { getSession } from "../lib/auth-utils";
import type { LorcanaCard } from "../types";

const API_BASE = "https://api.lorcast.com/v0";

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
    // Ya no guardamos la carta en la DB local. 
    // Solo creamos la relación en userCard usando el cardId de Lorcast.
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

  try {
    const userCards = await prisma.userCard.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    if (userCards.length === 0) return [];

    // Recuperar detalles de cada carta desde la API de Lorcast en paralelo
    const cardPromises = userCards.map(async (uc) => {
      try {
        const response = await fetch(`${API_BASE}/cards/${uc.cardId}`);
        if (!response.ok) return null;
        return await response.json() as LorcanaCard;
      } catch {
        return null;
      }
    });

    const cards = await Promise.all(cardPromises);
    return cards.filter((c): c is LorcanaCard => c !== null);
  } catch (error) {
    console.error("Error fetching user cards:", error);
    return [];
  }
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