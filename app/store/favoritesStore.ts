import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteState {
  favorites: string[];
  addFavorite: (cardId: string) => void;
  removeFavorite: (cardId: string) => void;
  toggleFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
}

export const useFavoritesStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (cardId) =>
        set((state) => ({
          favorites: [...state.favorites, cardId],
        })),
      removeFavorite: (cardId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== cardId),
        })),
      toggleFavorite: (cardId) => {
        const { favorites } = get();
        if (favorites.includes(cardId)) {
          set({ favorites: favorites.filter((id) => id !== cardId) });
        } else {
          set({ favorites: [...favorites, cardId] });
        }
      },
      isFavorite: (cardId) => get().favorites.includes(cardId),
    }),
    {
      name: "lorcana-favorites",
    }
  )
);