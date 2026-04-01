import { create } from "zustand";

interface UserCardsState {
  savedCardIds: string[];
  setSavedCardIds: (ids: string[]) => void;
  addSavedCardId: (id: string) => void;
  removeSavedCardId: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useUserCardsStore = create<UserCardsState>((set, get) => ({
  savedCardIds: [],
  setSavedCardIds: (ids) => set({ savedCardIds: ids }),
  addSavedCardId: (id) =>
    set((state) => ({
      savedCardIds: state.savedCardIds.includes(id) 
        ? state.savedCardIds 
        : [...state.savedCardIds, id],
    })),
  removeSavedCardId: (id) =>
    set((state) => ({
      savedCardIds: state.savedCardIds.filter((cid) => cid !== id),
    })),
  isSaved: (id) => get().savedCardIds.includes(id),
}));
