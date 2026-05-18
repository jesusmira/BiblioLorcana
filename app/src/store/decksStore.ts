import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserDeck, DeckCardEntry } from "../types";

interface DecksState {
  decks: UserDeck[];
  isLoading: boolean;
  addDeck: (
    deck: Omit<UserDeck, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => UserDeck;
  updateDeck: (
    id: string,
    updates: Partial<Omit<UserDeck, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteDeck: (id: string) => void;
  duplicateDeck: (id: string) => UserDeck | null;
  getDeck: (id: string) => UserDeck | undefined;
  importFromText: (text: string, name?: string) => UserDeck | null;
  setDecks: (decks: UserDeck[]) => void;
  setIsLoading: (loading: boolean) => void;
}

function generateId(): string {
  return `deck_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getCurrentDate(): string {
  return new Date().toISOString();
}

export const useDecksStore = create<DecksState>()(
  persist(
    (set, get) => ({
      decks: [],
      isLoading: false,

      setDecks: (decks) => set({ decks }),
      setIsLoading: (isLoading) => set({ isLoading }),

      addDeck: (deckData) => {
        const newDeck: UserDeck = {
          ...deckData,
          id: generateId(),
          userId: "local",
          createdAt: getCurrentDate(),
          updatedAt: getCurrentDate(),
        };
        set((state) => ({ decks: [...state.decks, newDeck] }));
        return newDeck;
      },

      updateDeck: (id, updates) => {
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === id
              ? { ...deck, ...updates, updatedAt: getCurrentDate() }
              : deck,
          ),
        }));
      },

      deleteDeck: (id) => {
        set((state) => ({
          decks: state.decks.filter((deck) => deck.id !== id),
        }));
      },

      duplicateDeck: (id) => {
        const deck = get().decks.find((d) => d.id === id);
        if (!deck) return null;
        const duplicated: UserDeck = {
          ...deck,
          id: generateId(),
          name: `${deck.name} (copia)`,
          createdAt: getCurrentDate(),
          updatedAt: getCurrentDate(),
        };
        set((state) => ({ decks: [...state.decks, duplicated] }));
        return duplicated;
      },

      getDeck: (id) => {
        return get().decks.find((deck) => deck.id === id);
      },

      importFromText: (text, name) => {
        const lines = text.split("\n").filter((line) => line.trim());
        const cards: DeckCardEntry[] = [];
        let deckName = name || "Mazo importado";

        for (const line of lines) {
          const match = line.match(/^(\d+)[xX]\s+(.+)$/);
          if (match) {
            const quantity = parseInt(match[1], 10);
            const cardName = match[2].trim();
            if (quantity > 0 && quantity <= 4) {
              cards.push({ cardId: "", name: cardName, quantity });
            }
          } else if (line.toLowerCase().startsWith("mazo:")) {
            deckName = line.substring(5).trim() || deckName;
          }
        }

        if (cards.length === 0) return null;

        const newDeck: UserDeck = {
          id: generateId(),
          userId: "local",
          name: deckName,
          description: "Mazo importado desde texto",
          cards,
          createdAt: getCurrentDate(),
          updatedAt: getCurrentDate(),
        };

        set((state) => ({ decks: [...state.decks, newDeck] }));
        return newDeck;
      },
    }),
    {
      name: "lorcana-decks",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
