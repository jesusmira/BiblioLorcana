"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { getUserCards, removeCardFromUser } from "@/actions";
import { useUserCardsStore } from "@/store";
import type { LorcanaCard } from "@/types";
import {
  groupCardsBySet,
  calculateTotalCopies,
  calculateUniqueCards,
} from "./useMisCartasUtils";

interface UseMisCartasReturn {
  cards: LorcanaCard[];
  loading: boolean;
  error: string | null;
  selectedCard: LorcanaCard | null;
  confirmingCard: LorcanaCard | null;
  uniqueCards: number;
  totalCopies: number;
  groupedCards: Record<string, LorcanaCard[]>;
  handleCardClick: (card: LorcanaCard) => void;
  handleRemoveClick: (card: LorcanaCard) => void;
  handleConfirmDelete: () => Promise<void>;
  closeModal: () => void;
  setConfirmingCard: (card: LorcanaCard | null) => void;
}

export function useMisCartas(): UseMisCartasReturn {
  const { user, isLoading: authLoading } = useAuth();
  const { setSavedCardIds, removeSavedCardId, cardQuantities } =
    useUserCardsStore();
  const [cards, setCards] = useState<LorcanaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<LorcanaCard | null>(null);
  const [confirmingCardState, setConfirmingCardState] =
    useState<LorcanaCard | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getUserCards();
        setCards(data);
        setSavedCardIds(data.map((c) => String(c.id)));
        const quantities: Record<string, number> = {};
        data.forEach((c) => {
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
      setCards((prevCards) =>
        prevCards.map((c) => ({
          ...c,
          quantity: quantities[String(c.id)] ?? c.quantity ?? 1,
        })),
      );
    }
  }, [cardQuantities]);

  const uniqueCards = calculateUniqueCards(cards, cardQuantities);
  const totalCopies = calculateTotalCopies(cards, cardQuantities);
  const groupedCards = groupCardsBySet(cards);

  const handleCardClick = useCallback((card: LorcanaCard) => {
    setSelectedCard(card);
  }, []);

  const handleRemoveClick = useCallback((card: LorcanaCard) => {
    setConfirmingCardState(card);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmingCardState) return;
    const cardIdToRemove = String(confirmingCardState.id);

    const result = await removeCardFromUser(cardIdToRemove);
    if (result.success) {
      const updatedCards = cards.filter((c) => String(c.id) !== cardIdToRemove);
      setCards(updatedCards);
      setSavedCardIds(updatedCards.map((c) => String(c.id)));
      removeSavedCardId(cardIdToRemove);
      setConfirmingCardState(null);
    }
  }, [confirmingCardState, cards, setSavedCardIds, removeSavedCardId]);

  const closeModal = useCallback(() => {
    setSelectedCard(null);
    const quantities: Record<string, number> = {};
    cards.forEach((c) => {
      quantities[String(c.id)] = c.quantity ?? 1;
    });
    useUserCardsStore.setState({ cardQuantities: quantities });
  }, [cards]);

  const setConfirmingCard = useCallback((card: LorcanaCard | null) => {
    setConfirmingCardState(card);
  }, []);

  return {
    cards,
    loading,
    error,
    selectedCard,
    confirmingCard: confirmingCardState,
    uniqueCards,
    totalCopies,
    groupedCards,
    handleCardClick,
    handleRemoveClick,
    handleConfirmDelete,
    closeModal,
    setConfirmingCard,
  };
}
