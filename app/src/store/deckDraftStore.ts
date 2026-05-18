import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeckCardEntry } from "@/types/";

interface DeckDraft {
  id: string;
  name: string;
  description: string;
  format: string;
  strategy: string;
  tier: string;
  cards: DeckCardEntry[];
  updatedAt: string;
}

interface DeckDraftStore {
  drafts: Record<string, DeckDraft>;
  saveDraft: (
    deckId: string,
    data: Omit<DeckDraft, "id" | "updatedAt">,
  ) => void;
  loadDraft: (deckId: string) => DeckDraft | null;
  clearDraft: (deckId: string) => void;
  hasDraft: (deckId: string) => boolean;
}

export const useDeckDraftStore = create<DeckDraftStore>()(
  persist(
    (set, get) => ({
      drafts: {},
      saveDraft: (deckId, data) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [deckId]: {
              ...data,
              id: deckId,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
      loadDraft: (deckId) => {
        const draft = get().drafts[deckId];
        if (!draft) return null;
        const diffDays =
          (Date.now() - new Date(draft.updatedAt).getTime()) /
          (1000 * 60 * 60 * 24);
        if (diffDays > 7) {
          get().clearDraft(deckId);
          return null;
        }
        return draft;
      },
      clearDraft: (deckId) =>
        set((state) => {
          const { [deckId]: _, ...rest } = state.drafts;
          return { drafts: rest };
        }),
      hasDraft: (deckId) => {
        const draft = get().drafts[deckId];
        if (!draft) return false;
        const diffDays =
          (Date.now() - new Date(draft.updatedAt).getTime()) /
          (1000 * 60 * 60 * 24);
        if (diffDays > 7) {
          get().clearDraft(deckId);
          return false;
        }
        return true;
      },
    }),
    {
      name: "lorcana-deck-drafts",
    },
  ),
);
