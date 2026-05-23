import { describe, it, expect, beforeEach } from "vitest";
import { useDeckDraftStore } from "@/store/deckDraftStore";

const DRAFT_DATA = {
  name: "Mazo de prueba",
  description: "Descripción de prueba",
  format: "Standard",
  strategy: "Control",
  tier: "A",
  cards: [{ cardId: "card-1", name: "Mickey Mouse", quantity: 3 }],
};

beforeEach(() => {
  useDeckDraftStore.setState({ drafts: {} });
});

describe("deckDraftStore", () => {
  describe("saveDraft", () => {
    it("guarda un borrador con id y updatedAt", () => {
      useDeckDraftStore.getState().saveDraft("deck-1", DRAFT_DATA);
      const draft = useDeckDraftStore.getState().drafts["deck-1"];

      expect(draft).toBeDefined();
      expect(draft.id).toBe("deck-1");
      expect(draft.name).toBe("Mazo de prueba");
      expect(draft.updatedAt).toBeDefined();
    });

    it("sobreescribe un borrador existente", () => {
      useDeckDraftStore.getState().saveDraft("deck-1", DRAFT_DATA);
      useDeckDraftStore
        .getState()
        .saveDraft("deck-1", { ...DRAFT_DATA, name: "Nombre actualizado" });

      const draft = useDeckDraftStore.getState().drafts["deck-1"];
      expect(draft.name).toBe("Nombre actualizado");
    });

    it("guarda múltiples borradores de forma independiente", () => {
      useDeckDraftStore.getState().saveDraft("deck-1", DRAFT_DATA);
      useDeckDraftStore
        .getState()
        .saveDraft("deck-2", { ...DRAFT_DATA, name: "Segundo mazo" });

      const drafts = useDeckDraftStore.getState().drafts;
      expect(Object.keys(drafts)).toHaveLength(2);
      expect(drafts["deck-1"].name).toBe("Mazo de prueba");
      expect(drafts["deck-2"].name).toBe("Segundo mazo");
    });
  });

  describe("loadDraft", () => {
    it("devuelve null si no existe borrador", () => {
      const draft = useDeckDraftStore.getState().loadDraft("deck-inexistente");
      expect(draft).toBeNull();
    });

    it("devuelve el borrador si existe y no ha expirado", () => {
      useDeckDraftStore.getState().saveDraft("deck-1", DRAFT_DATA);
      const draft = useDeckDraftStore.getState().loadDraft("deck-1");

      expect(draft).not.toBeNull();
      expect(draft?.name).toBe("Mazo de prueba");
    });

    it("elimina y devuelve null si el borrador tiene más de 7 días", () => {
      const oldDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
      useDeckDraftStore.setState({
        drafts: {
          "deck-viejo": {
            ...DRAFT_DATA,
            id: "deck-viejo",
            updatedAt: oldDate,
          },
        },
      });

      const draft = useDeckDraftStore.getState().loadDraft("deck-viejo");
      expect(draft).toBeNull();
      expect(useDeckDraftStore.getState().drafts["deck-viejo"]).toBeUndefined();
    });
  });

  describe("clearDraft", () => {
    it("elimina un borrador existente", () => {
      useDeckDraftStore.getState().saveDraft("deck-1", DRAFT_DATA);
      useDeckDraftStore.getState().clearDraft("deck-1");

      expect(useDeckDraftStore.getState().drafts["deck-1"]).toBeUndefined();
    });

    it("no falla si el borrador no existe", () => {
      expect(() => {
        useDeckDraftStore.getState().clearDraft("deck-inexistente");
      }).not.toThrow();
    });
  });

  describe("hasDraft", () => {
    it("devuelve false si no existe borrador", () => {
      expect(useDeckDraftStore.getState().hasDraft("deck-inexistente")).toBe(false);
    });

    it("devuelve true si el borrador existe y no ha expirado", () => {
      useDeckDraftStore.getState().saveDraft("deck-1", DRAFT_DATA);
      expect(useDeckDraftStore.getState().hasDraft("deck-1")).toBe(true);
    });

    it("devuelve false y limpia si el borrador tiene más de 7 días", () => {
      const oldDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
      useDeckDraftStore.setState({
        drafts: {
          "deck-viejo": {
            ...DRAFT_DATA,
            id: "deck-viejo",
            updatedAt: oldDate,
          },
        },
      });

      expect(useDeckDraftStore.getState().hasDraft("deck-viejo")).toBe(false);
      expect(useDeckDraftStore.getState().drafts["deck-viejo"]).toBeUndefined();
    });
  });
});
