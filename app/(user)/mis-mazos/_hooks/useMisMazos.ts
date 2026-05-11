"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { generateSampleDeck } from "@/actions";
import type { Deck, LorcanaCard } from "@/types/";

interface UseMisMazosReturn {
  deck: Deck | null;
  loading: boolean;
  isRegenerating: boolean;
  selectedCard: LorcanaCard | null;
  fetchDeck: () => Promise<void>;
  regenerate: () => Promise<void>;
  handleCardClick: (cardId: string) => void;
  closeModal: () => void;
}

export function useMisMazos(): UseMisMazosReturn {
  const { isLoading: authLoading } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<LorcanaCard | null>(null);

  const fetchDeck = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generateSampleDeck();
      setDeck(data);
    } catch {
      setDeck(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const regenerate = useCallback(async () => {
    setIsRegenerating(true);
    try {
      const data = await generateSampleDeck();
      setDeck(data);
    } catch {
      // noop
    } finally {
      setIsRegenerating(false);
    }
  }, []);

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
  }, [authLoading, fetchDeck]);

  return {
    deck,
    loading,
    isRegenerating,
    selectedCard,
    fetchDeck,
    regenerate,
    handleCardClick,
    closeModal,
  };
}
