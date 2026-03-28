"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchCardsBySetAction, fetchSetsAction, fetchAllCardsAction } from "../actions/galleryActions";
import { useGalleryStore } from "../store/galleryStore";
import type {
  LorcanaSet,
  LorcanaCard,
  GalleryFilters,
  UseGalleryDataReturn,
} from "../types";

const DEFAULT_FILTERS: GalleryFilters = {
  search: "",
  ink: "",
  type: "",
  rarity: "",
  sort: "name",
};

export default function useGalleryData(defaultSetCode: string): UseGalleryDataReturn {
  const { 
    sets: cachedSets, 
    setSets, 
    isSetsValid, 
    cardsBySet, 
    setCards, 
    isCardsValid,
    allCards,
    setAllCards,
    isAllCardsValid
  } = useGalleryStore();

  const [loadingSets, setLoadingSets] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [setsError, setSetsError] = useState("");
  const [cardsError, setCardsError] = useState("");

  const [selectedSet, setSelectedSet] = useState<string>(defaultSetCode);
  const [filters, setFilters] = useState<GalleryFilters>({ ...DEFAULT_FILTERS });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debouncing para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const updateFilter = (name: string, value: string) =>
    setFilters((prev) => ({ ...prev, [name]: value }));
  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS });

  // Cargar Sets
  useEffect(() => {
    if (isSetsValid()) return;

    let active = true;
    setLoadingSets(true);
    (async () => {
      try {
        const data = await fetchSetsAction();
        if (active) {
          setSets(data);
          setLoadingSets(false);
        }
      } catch (err) {
        if (active) {
          setSetsError("No se pudieron cargar los sets.");
          setLoadingSets(false);
        }
      }
    })();
    return () => { active = false; };
  }, [isSetsValid, setSets]);

  // Resetear filtros al cambiar de set
  useEffect(() => {
    if (selectedSet) {
      resetFilters();
    }
  }, [selectedSet]);

  // Cargar Cartas
  useEffect(() => {
    if (!selectedSet) return;

    // Caso 1: Todas las cartas (Global)
    if (selectedSet === "all") {
      if (isAllCardsValid()) return;
      
      let active = true;
      setLoadingCards(true);
      (async () => {
        try {
          const data = await fetchAllCardsAction();
          if (active) {
            setAllCards(data);
            setLoadingCards(false);
          }
        } catch (err) {
          if (active) {
            setCardsError("Error al cargar todas las cartas.");
            setLoadingCards(false);
          }
        }
      })();
      return () => { active = false; };
    }

    // Caso 2: Set específico
    if (isCardsValid(selectedSet)) return;

    let active = true;
    setLoadingCards(true);
    (async () => {
      try {
        const data = await fetchCardsBySetAction(selectedSet);
        if (active) {
          setCards(selectedSet, data);
          setLoadingCards(false);
        }
      } catch (err) {
        if (active) {
          setCardsError(`No se pudieron cargar las cartas de ${selectedSet}.`);
          setLoadingCards(false);
        }
      }
    })();
    return () => { active = false; };
  }, [selectedSet, isCardsValid, isAllCardsValid, setCards, setAllCards]);

  // Filtrado y derivación de datos
  // Si estamos en "all", usamos el filtro por nombre cliente
  const displayCards = useMemo(() => {
    if (selectedSet === "all") {
      if (!debouncedSearch.trim()) return allCards;
      const searchLower = debouncedSearch.toLowerCase();
      return allCards.filter(card => 
        card.name?.toLowerCase().includes(searchLower) || 
        card.version?.toLowerCase().includes(searchLower)
      );
    }
    return cardsBySet[selectedSet]?.data || [];
  }, [selectedSet, debouncedSearch, allCards, cardsBySet]);

  return {
    sets: cachedSets,
    loadingSets,
    setError: setsError,
    cards: displayCards,
    loadingCards,
    cardError: cardsError,
    selectedSet,
    setSelectedSet,
    ...filters,
    updateFilter,
    resetFilters,
    setSearch: (val: string) => updateFilter("search", val),
    setInk: (val: string) => updateFilter("ink", val),
    setType: (val: string) => updateFilter("type", val),
    setRarity: (val: string) => updateFilter("rarity", val),
    setSort: (val: string) => updateFilter("sort", val),
  };
}
