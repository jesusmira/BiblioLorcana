"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LorcanaCard, LorcanaSet } from "../types";

interface SetCache {
  data: LorcanaCard[];
  updatedAt: number;
}

interface GalleryState {
  sets: LorcanaSet[];
  setsUpdatedAt: number | null;
  cardsBySet: Record<string, SetCache>;
  allCards: LorcanaCard[];
  allCardsUpdatedAt: number | null;
  
  setSets: (sets: LorcanaSet[]) => void;
  setCards: (setCode: string, cards: LorcanaCard[]) => void;
  setAllCards: (cards: LorcanaCard[]) => void;
  clearCache: () => void;
  
  // Helpers
  isSetsValid: () => boolean;
  isCardsValid: (setCode: string) => boolean;
  isAllCardsValid: () => boolean;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      sets: [],
      setsUpdatedAt: null,
      cardsBySet: {},
      allCards: [],
      allCardsUpdatedAt: null,

      setSets: (sets: LorcanaSet[]) => 
        set({ sets, setsUpdatedAt: Date.now() }),

      setCards: (setCode: string, cards: LorcanaCard[]) => 
        set((state) => ({
          cardsBySet: {
            ...state.cardsBySet,
            [setCode]: { data: cards, updatedAt: Date.now() }
          }
        })),

      setAllCards: (cards: LorcanaCard[]) =>
        set({ allCards: cards, allCardsUpdatedAt: Date.now() }),

      clearCache: () => set({ sets: [], setsUpdatedAt: null, cardsBySet: {}, allCards: [], allCardsUpdatedAt: null }),

      isSetsValid: () => {
        const { sets, setsUpdatedAt } = get();
        if (!sets.length || !setsUpdatedAt) return false;
        return Date.now() - setsUpdatedAt < CACHE_DURATION;
      },

      isCardsValid: (setCode: string) => {
        const cache = get().cardsBySet[setCode];
        if (!cache || !cache.data.length) return false;
        return Date.now() - cache.updatedAt < CACHE_DURATION;
      },

      isAllCardsValid: () => {
        const { allCards, allCardsUpdatedAt } = get();
        if (!allCards.length || !allCardsUpdatedAt) return false;
        return Date.now() - allCardsUpdatedAt < CACHE_DURATION;
      },
    }),
    {
      name: "lorcana-gallery-cache",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
