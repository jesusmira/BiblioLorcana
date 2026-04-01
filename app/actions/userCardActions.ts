"use server";

import axios from "axios";
import { prisma } from "../lib/prisma";
import { getSession } from "../lib/auth-utils";
import { API } from "../lib/constants";
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

export async function updateCardQuantity(cardId: string, quantity: number): Promise<SaveCardResponse> {
  const session = await getSession();
  if (!session) return { success: false, error: "Debes iniciar sesión" };
  
  if (quantity < 1 || quantity > 10) {
    return { success: false, error: "La cantidad debe estar entre 1 y 10" };
  }

  try {
    await prisma.userCard.update({
      where: {
        userId_cardId: {
          userId: session.userId,
          cardId: String(cardId),
        },
      },
      data: { quantity },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating card quantity:", error);
    return { success: false, error: "Error al actualizar la cantidad" };
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

    // Recuperar detalles de cada carta desde la API de Lorcast
    const cardPromises = userCards.map(async (uc) => {
      try {
        // Intentar primero por ID directo
        let response = await axios.get(`${API.LORCAST_BASE}/cards/${uc.cardId}`);
        
        // Si no funciona, buscar por collector_number
        if (response.status !== 200) {
          // Buscar en el set "1" por collector number
          const searchRes = await axios.get(`${API.LORCAST_BASE}/sets/1/cards?collector_number=${uc.cardId}`);
          if (searchRes.status !== 200 || !searchRes.data.results?.[0]) return null;
          return { ...searchRes.data.results[0], quantity: uc.quantity };
        }
        
        const card = response.data as LorcanaCard;
        const quantity = uc.quantity ?? 1;
        return { ...card, quantity } as LorcanaCard;
      } catch {
        return null;
      }
    });

    const cards = await Promise.all(cardPromises);
    return (cards.filter((c) => c !== null) as LorcanaCard[]);
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

export async function getUserCardIds(): Promise<string[]> {
  const session = await getSession();
  if (!session) {
    return [];
  }

  try {
    const userCards = await prisma.userCard.findMany({
      where: { userId: session.userId },
      select: { cardId: true },
    });

    // Devolver los IDs tal cual están guardados
    return userCards.map((uc) => uc.cardId);
  } catch (error) {
    console.error("Error fetching user card IDs:", error);
    return [];
  }
}