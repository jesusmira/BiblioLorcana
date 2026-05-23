import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGalleryStore } from "@/store/galleryStore";
import type { LorcanaCard, LorcanaSet } from "@/types";

const MOCK_SETS: LorcanaSet[] = [
  { id: "001", name: "The First Chapter", code: "TFC" } as LorcanaSet,
  { id: "002", name: "Rise of the Floodborn", code: "ROF" } as LorcanaSet,
];

const MOCK_CARDS: LorcanaCard[] = [
  { id: "card-1", name: "Mickey Mouse", ink: "Amber" } as LorcanaCard,
  { id: "card-2", name: "Elsa", ink: "Sapphire" } as LorcanaCard,
];

beforeEach(() => {
  useGalleryStore.setState({
    sets: [],
    setsUpdatedAt: null,
    cardsBySet: {},
    allCards: [],
    allCardsUpdatedAt: null,
  });
});

describe("galleryStore", () => {
  describe("setSets", () => {
    it("guarda sets y establece setsUpdatedAt", () => {
      const before = Date.now();
      useGalleryStore.getState().setSets(MOCK_SETS);
      const state = useGalleryStore.getState();

      expect(state.sets).toHaveLength(2);
      expect(state.setsUpdatedAt).toBeGreaterThanOrEqual(before);
    });
  });

  describe("setCards", () => {
    it("almacena cartas por setCode con timestamp", () => {
      const before = Date.now();
      useGalleryStore.getState().setCards("TFC", MOCK_CARDS);
      const state = useGalleryStore.getState();

      expect(state.cardsBySet["TFC"].data).toHaveLength(2);
      expect(state.cardsBySet["TFC"].updatedAt).toBeGreaterThanOrEqual(before);
    });

    it("mantiene cartas de otros sets al añadir uno nuevo", () => {
      useGalleryStore.getState().setCards("TFC", MOCK_CARDS);
      useGalleryStore.getState().setCards("ROF", [MOCK_CARDS[0]]);

      const state = useGalleryStore.getState();
      expect(state.cardsBySet["TFC"].data).toHaveLength(2);
      expect(state.cardsBySet["ROF"].data).toHaveLength(1);
    });
  });

  describe("setAllCards", () => {
    it("guarda todas las cartas y establece allCardsUpdatedAt", () => {
      const before = Date.now();
      useGalleryStore.getState().setAllCards(MOCK_CARDS);
      const state = useGalleryStore.getState();

      expect(state.allCards).toHaveLength(2);
      expect(state.allCardsUpdatedAt).toBeGreaterThanOrEqual(before);
    });
  });

  describe("clearCache", () => {
    it("resetea todo el estado del store", () => {
      useGalleryStore.getState().setSets(MOCK_SETS);
      useGalleryStore.getState().setCards("TFC", MOCK_CARDS);
      useGalleryStore.getState().setAllCards(MOCK_CARDS);

      useGalleryStore.getState().clearCache();
      const state = useGalleryStore.getState();

      expect(state.sets).toHaveLength(0);
      expect(state.setsUpdatedAt).toBeNull();
      expect(state.cardsBySet).toEqual({});
      expect(state.allCards).toHaveLength(0);
      expect(state.allCardsUpdatedAt).toBeNull();
    });
  });

  describe("isSetsValid", () => {
    it("devuelve false si no hay sets", () => {
      expect(useGalleryStore.getState().isSetsValid()).toBe(false);
    });

    it("devuelve true si los sets se guardaron recientemente", () => {
      useGalleryStore.getState().setSets(MOCK_SETS);
      expect(useGalleryStore.getState().isSetsValid()).toBe(true);
    });

    it("devuelve false si los sets tienen más de 24h", () => {
      const old = Date.now() - 25 * 60 * 60 * 1000;
      useGalleryStore.setState({ sets: MOCK_SETS, setsUpdatedAt: old });
      expect(useGalleryStore.getState().isSetsValid()).toBe(false);
    });
  });

  describe("isCardsValid", () => {
    it("devuelve false si no hay cartas para ese set", () => {
      expect(useGalleryStore.getState().isCardsValid("TFC")).toBe(false);
    });

    it("devuelve true si las cartas se guardaron recientemente", () => {
      useGalleryStore.getState().setCards("TFC", MOCK_CARDS);
      expect(useGalleryStore.getState().isCardsValid("TFC")).toBe(true);
    });

    it("devuelve false si las cartas tienen más de 24h", () => {
      const old = Date.now() - 25 * 60 * 60 * 1000;
      useGalleryStore.setState({
        cardsBySet: { TFC: { data: MOCK_CARDS, updatedAt: old } },
      });
      expect(useGalleryStore.getState().isCardsValid("TFC")).toBe(false);
    });
  });

  describe("isAllCardsValid", () => {
    it("devuelve false si no hay cartas globales", () => {
      expect(useGalleryStore.getState().isAllCardsValid()).toBe(false);
    });

    it("devuelve true si las cartas globales son recientes", () => {
      useGalleryStore.getState().setAllCards(MOCK_CARDS);
      expect(useGalleryStore.getState().isAllCardsValid()).toBe(true);
    });

    it("devuelve false si las cartas globales tienen más de 24h", () => {
      const old = Date.now() - 25 * 60 * 60 * 1000;
      useGalleryStore.setState({ allCards: MOCK_CARDS, allCardsUpdatedAt: old });
      expect(useGalleryStore.getState().isAllCardsValid()).toBe(false);
    });
  });
});
