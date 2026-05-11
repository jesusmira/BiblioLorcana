"use client";

import { useState, useEffect } from "react";
import type { UserDeck, Deck, DeckCard, LorcanaCard } from "@/types";
import { enrichDeckCardsAction } from "@/actions";

export function usePreviewDeck() {
  const [selectedDeck, setSelectedDeck] = useState<UserDeck | null>(null);
  const [enrichedDeck, setEnrichedDeck] = useState<Deck | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [selectedCard, setSelectedCard] = useState<LorcanaCard | null>(null);

  useEffect(() => {
    if (!selectedDeck) {
      setEnrichedDeck(null);
      setIsEnriching(false);
      return;
    }

    const enrich = async () => {
      setIsEnriching(true);
      try {
        const { enrichedCards, fullCards } = await enrichDeckCardsAction(selectedDeck.cards);
        
        // Calculate ink colors from enriched cards
        const inkSet = new Set<string>();
        enrichedCards.forEach(c => {
          if (c.ink) inkSet.add(c.ink);
        });

        const deck: Deck = {
          id: selectedDeck.id,
          name: selectedDeck.name,
          description: selectedDeck.description,
          inkColors: Array.from(inkSet),
          cards: enrichedCards,
          fullCards: fullCards,
          totalCards: enrichedCards.reduce((acc, c) => acc + c.quantity, 0),
        };

        setEnrichedDeck(deck);
      } catch (error) {
        console.error("Error enriching preview deck:", error);
        // Fallback: conversión simple sin datos extras si falla la API
        const fallbackCards: DeckCard[] = selectedDeck.cards.map(c => ({
          ...c,
          cost: null,
          ink: null,
          type: null,
          rarity: null,
          image: null
        }));
        
        setEnrichedDeck({
          id: selectedDeck.id,
          name: selectedDeck.name,
          description: selectedDeck.description,
          inkColors: [],
          cards: fallbackCards,
          fullCards: [],
          totalCards: fallbackCards.reduce((acc, c) => acc + c.quantity, 0),
        });
      } finally {
        setIsEnriching(false);
      }
    };

    enrich();
  }, [selectedDeck]);

  const handleCardClick = (cardId: string) => {
    if (!enrichedDeck) return;
    const fullCard = enrichedDeck.fullCards.find((c) => String(c.id) === cardId);
    if (fullCard) setSelectedCard(fullCard);
  };

  const closeModal = () => setSelectedCard(null);

  return {
    previewDeck: selectedDeck,
    enrichedDeck,
    isEnriching,
    selectedCard,
    selectDeck: setSelectedDeck,
    handleCardClick,
    closeModal,
    clearPreview: () => {
      setSelectedDeck(null);
      setSelectedCard(null);
    },
  };
}
