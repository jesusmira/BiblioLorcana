import { create } from "zustand";

interface UserCardsState {
  savedCardIds: string[];
  cardQuantities: Record<string, number>;
  setSavedCardIds: (ids: string[]) => void;
  addSavedCardId: (id: string) => void;
  removeSavedCardId: (id: string) => void;
  updateCardQuantity: (id: string, quantity: number) => void;
  isSaved: (id: string) => boolean;
  getQuantity: (id: string) => number;
}

export const useUserCardsStore = create<UserCardsState>((set, get) => ({
  savedCardIds: [],
  cardQuantities: {},
  setSavedCardIds: (ids) => set({ savedCardIds: ids }),
  addSavedCardId: (id) =>
    set((state) => ({
      savedCardIds: state.savedCardIds.includes(id)
        ? state.savedCardIds
        : [...state.savedCardIds, id],
      cardQuantities: { ...state.cardQuantities, [id]: 1 },
    })),
  removeSavedCardId: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.cardQuantities;
      return {
        savedCardIds: state.savedCardIds.filter((cid) => cid !== id),
        cardQuantities: rest,
      };
    }),
  updateCardQuantity: (id, quantity) =>
    set((state) => ({
      cardQuantities: { ...state.cardQuantities, [id]: quantity },
    })),
  isSaved: (id) => get().savedCardIds.includes(id),
  getQuantity: (id) => get().cardQuantities[id] ?? 1,
}));
