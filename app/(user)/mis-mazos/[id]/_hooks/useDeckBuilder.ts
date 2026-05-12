"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDecksStore } from "@/store";
import { useAuth } from "@/lib/auth";
import { searchCardsWithFiltersAction, fetchSetsAction } from "@/actions";
import { enrichDeckCardsAction, saveDeckAction } from "@/actions/dbDeckActions";
import type { LorcanaCard, DeckCardEntry, UserDeck, LorcanaSet } from "@/types";

export interface DeckCardWithDetails extends DeckCardEntry {
  details?: LorcanaCard;
}

export interface DeckValidation {
  isValid: boolean;
  warnings: string[];
}

export interface DeckStats {
  totalCards: number;
  uniqueCards: number;
  averageCost: number;
  characters: number;
  actions: number;
  items: number;
  locations: number;
  inkAmber: number;
  inkAmethyst: number;
  inkEmerald: number;
  inkRuby: number;
  inkSapphire: number;
  inkSteel: number;
}

export function useDeckBuilder(deckId: string) {
  const router = useRouter();
  const isNewDeck = deckId === "crear";
  const { user } = useAuth();
  const { getDeck, addDeck, updateDeck } = useDecksStore();

  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckFormat, setDeckFormat] = useState("");
  const [deckStrategy, setDeckStrategy] = useState("");
  const [deckTier, setDeckTier] = useState("");
  const [cards, setCards] = useState<DeckCardWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LorcanaCard[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showInkWarning, setShowInkWarning] = useState(false);
  const [sets, setSets] = useState<LorcanaSet[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    ink: "",
    type: "",
    rarity: "",
    setCode: "",
  });

  const hasEnriched = useRef(false);

  // Initialize deck
  useEffect(() => {
    if (!isNewDeck && !hasEnriched.current) {
      const existingDeck = getDeck(deckId);
      if (existingDeck) {
        hasEnriched.current = true;
        setDeckName(existingDeck.name);
        setDeckDescription(existingDeck.description);
        setDeckFormat(existingDeck.format || "");
        setDeckStrategy(existingDeck.strategy || "");
        setDeckTier(existingDeck.tier || "");
        
        const initialCards = existingDeck.cards.map((c) => ({ ...c, details: undefined }));
        setCards(initialCards);

        (async () => {
          try {
            const { enrichedCards } = await enrichDeckCardsAction(existingDeck.cards);
            setCards(enrichedCards as DeckCardWithDetails[]);
          } catch (err) {
            console.error("Error enrichment:", err);
            hasEnriched.current = false;
          }
        })();
      }
    }
  }, [deckId, isNewDeck, getDeck]);

  // Fetch sets
  useEffect(() => {
    (async () => {
      try {
        const allSets = await fetchSetsAction();
        setSets(allSets);
      } catch {
        // ignore
      }
    })();
  }, []);

  // Search logic
  const handleSearch = useCallback(async () => {
    if (searchQuery.trim().length < 2 && !filters.ink && !filters.type && !filters.rarity && !filters.setCode) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCardsWithFiltersAction(searchQuery, {
        ink: filters.ink || undefined,
        type: filters.type || undefined,
        rarity: filters.rarity || undefined,
        setCode: filters.setCode || undefined,
      });
      setSearchResults(results.slice(0, 50));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [handleSearch]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ ink: "", type: "", rarity: "", setCode: "" });
  }, []);

  // Card management
  const addCardToDeck = useCallback((card: LorcanaCard) => {
    setCards((prev) => {
      const existing = prev.find((c) => c.cardId === String(card.id));
      if (existing) {
        if (existing.quantity >= 4) return prev;
        return prev.map((c) =>
          c.cardId === String(card.id)
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      const currentInks = new Set<string>();
      prev.forEach(c => {
        if (c.details?.ink) currentInks.add(c.details.ink.toLowerCase());
      });

      if (card.ink) {
        const newInk = card.ink.toLowerCase();
        if (!currentInks.has(newInk) && currentInks.size >= 2) {
          setShowInkWarning(true);
          return prev;
        }
      }

      return [
        ...prev,
        {
          cardId: String(card.id),
          name: card.name || "Unknown",
          quantity: 1,
          details: card,
        },
      ];
    });
  }, []);

  const removeCardFromDeck = useCallback((cardId: string) => {
    setCards((prev) => {
      const existing = prev.find((c) => c.cardId === cardId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.cardId === cardId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.cardId !== cardId);
    });
  }, []);

  const removeAllFromDeck = useCallback((cardId: string) => {
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));
  }, []);

  // Stats
  const stats = useMemo<DeckStats>(() => {
    const s: DeckStats = {
      totalCards: 0,
      uniqueCards: cards.length,
      averageCost: 0,
      characters: 0,
      actions: 0,
      items: 0,
      locations: 0,
      inkAmber: 0,
      inkAmethyst: 0,
      inkEmerald: 0,
      inkRuby: 0,
      inkSapphire: 0,
      inkSteel: 0,
    };

    let totalCost = 0;

    cards.forEach((c) => {
      s.totalCards += c.quantity;
      if (c.details) {
        const cost = c.details.cost || 0;
        totalCost += cost * c.quantity;

        const cardType = Array.isArray(c.details.type) ? c.details.type.join(" ") : (c.details.type || "");
        const type = cardType.toLowerCase();
        if (type.includes("personaje") || type.includes("character")) s.characters += c.quantity;
        else if (type.includes("acción") || type.includes("action")) s.actions += c.quantity;
        else if (type.includes("objeto") || type.includes("item")) s.items += c.quantity;
        else if (type.includes("lugar") || type.includes("location")) s.locations += c.quantity;

        const ink = (c.details.ink || "").toLowerCase();
        if (ink === "amber" || ink === "ámbar") s.inkAmber += c.quantity;
        else if (ink === "amethyst" || ink === "amatista") s.inkAmethyst += c.quantity;
        else if (ink === "emerald" || ink === "esmeralda") s.inkEmerald += c.quantity;
        else if (ink === "ruby" || ink === "rubí") s.inkRuby += c.quantity;
        else if (ink === "sapphire" || ink === "zafiro") s.inkSapphire += c.quantity;
        else if (ink === "steel" || ink === "acero") s.inkSteel += c.quantity;
      }
    });

    s.averageCost = s.totalCards > 0 ? totalCost / s.totalCards : 0;
    return s;
  }, [cards]);

  // Validation
  const validation = useMemo<DeckValidation>(() => {
    const warnings: string[] = [];
    if (stats.totalCards < 60) warnings.push("El mazo debe tener al menos 60 cartas.");
    
    const inks = [
      stats.inkAmber > 0,
      stats.inkAmethyst > 0,
      stats.inkEmerald > 0,
      stats.inkRuby > 0,
      stats.inkSapphire > 0,
      stats.inkSteel > 0,
    ].filter(Boolean).length;
    
    if (inks > 2) warnings.push("El mazo no puede tener más de 2 colores de tinta.");

    return {
      isValid: stats.totalCards >= 60 && inks <= 2 && deckName.trim().length > 0,
      warnings,
    };
  }, [stats, deckName]);

  // Save logic
  const handleSaveDeck = async () => {
    if (!deckName.trim()) {
      setError("El nombre del mazo es obligatorio.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const deckCards: DeckCardEntry[] = cards.map((c) => ({
      cardId: c.cardId,
      name: c.name,
      quantity: c.quantity,
    }));

    const inkColors = [
      stats.inkAmber > 0 ? "Amber" : "",
      stats.inkAmethyst > 0 ? "Amethyst" : "",
      stats.inkEmerald > 0 ? "Emerald" : "",
      stats.inkRuby > 0 ? "Ruby" : "",
      stats.inkSapphire > 0 ? "Sapphire" : "",
      stats.inkSteel > 0 ? "Steel" : "",
    ].filter(Boolean);

    const deckData: Partial<UserDeck> = {
      name: deckName,
      description: deckDescription,
      format: deckFormat,
      strategy: deckStrategy,
      tier: deckTier,
      cards: deckCards,
      totalCards: stats.totalCards,
      inkColors,
    };

    try {
      if (user) {
        const deckToSave: UserDeck = {
          id: isNewDeck ? `deck_${crypto.randomUUID()}` : deckId,
          userId: user.id,
          name: deckName,
          description: deckDescription,
          format: deckFormat,
          strategy: deckStrategy,
          tier: deckTier,
          cards: deckCards,
          totalCards: stats.totalCards,
          inkColors,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const savedDeck = await saveDeckAction(deckToSave);
        if (isNewDeck) addDeck(savedDeck);
        else updateDeck(deckId, savedDeck);
      } else {
        const mockDeck: UserDeck = {
          id: isNewDeck ? crypto.randomUUID() : deckId,
          userId: "guest",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(deckData as any),
        };
        if (isNewDeck) addDeck(mockDeck);
        else updateDeck(deckId, mockDeck);
      }
      router.push("/mis-mazos");
    } catch (err: any) {
      setError(err.message || "Error al guardar el mazo");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    deckFormat,
    setDeckFormat,
    deckStrategy,
    setDeckStrategy,
    deckTier,
    setDeckTier,
    cards,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isSaving,
    showInkWarning,
    setShowInkWarning,
    sets,
    filters,
    handleFilterChange,
    handleClearFilters,
    addCardToDeck,
    removeCardFromDeck,
    removeAllFromDeck,
    stats,
    validation,
    handleSaveDeck,
    error,
    isNewDeck,
  };
}
