"use client";

import { useState, useEffect } from "react";
import { fetchCardsBySetAction, fetchSetsAction } from "../actions/galleryActions";
import type {
  LorcanaSet,
  LorcanaCard,
  GalleryFilters,
  UseGalleryDataReturn,
} from "../types";

interface SetsState {
  data: LorcanaSet[];
  loading: boolean;
  error: string;
}

interface CardsState {
  data: LorcanaCard[];
  loading: boolean;
  error: string;
}

const DEFAULT_FILTERS: GalleryFilters = {
  search: "",
  ink: "",
  type: "",
  rarity: "",
  sort: "name",
};

export default function useGalleryData(defaultSetCode: string): UseGalleryDataReturn {
  const [sets, setSets] = useState<SetsState>({ data: [], loading: true, error: "" });
  const [cards, setCards] = useState<CardsState>({ data: [], loading: false, error: "" });

  const [selectedSet, setSelectedSet] = useState<string>(defaultSetCode);
  const [filters, setFilters] = useState<GalleryFilters>({ ...DEFAULT_FILTERS });

  const updateFilter = (name: string, value: string) =>
    setFilters((prev) => ({ ...prev, [name]: value }));
  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchSetsAction();
        if (active) setSets({ data, loading: false, error: "" });
      } catch {
        if (active)
          setSets((prev) => ({
            ...prev,
            loading: false,
            error: "No se pudieron cargar los sets.",
          }));
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSet) return;

    let active = true;
    resetFilters();
    setCards((prev) => ({ ...prev, loading: true, error: "" }));

    (async () => {
      try {
        const data = await fetchCardsBySetAction(selectedSet);
        if (active) setCards({ data, loading: false, error: "" });
      } catch {
        if (active)
          setCards({ data: [], loading: false, error: "No se pudo cargar la galería." });
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedSet]);

  return {
    sets: sets.data,
    loadingSets: sets.loading,
    setError: sets.error,
    cards: cards.data,
    loadingCards: cards.loading,
    cardError: cards.error,
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
