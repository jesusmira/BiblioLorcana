import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de Prisma
const prismaMock = {
  deck: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  deckCard: {
    deleteMany: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

// Mock de auth-utils
const getSessionMock = vi.fn();
vi.mock("@/lib/auth-utils", () => ({ getSession: getSessionMock }));

// Importar después de los mocks
const { getUserDecksAction, saveDeckAction, deleteDeckAction } = await import(
  "@/actions/dbDeckActions"
);

const SESSION = { userId: "user-123" };

const DB_DECK = {
  id: "deck-abc",
  userId: "user-123",
  name: "Mi mazo",
  description: "Descripción",
  format: "Standard",
  strategy: "Control",
  tier: "A",
  inkColors: ["Amber", "Sapphire"],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
  cards: [{ cardId: "card-1", name: "Mickey", quantity: 3 }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUserDecksAction", () => {
  it("devuelve array vacío si no hay sesión", async () => {
    getSessionMock.mockResolvedValue(null);
    const result = await getUserDecksAction();
    expect(result).toEqual([]);
    expect(prismaMock.deck.findMany).not.toHaveBeenCalled();
  });

  it("devuelve los mazos del usuario mapeados correctamente", async () => {
    getSessionMock.mockResolvedValue(SESSION);
    prismaMock.deck.findMany.mockResolvedValue([DB_DECK]);

    const result = await getUserDecksAction();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("deck-abc");
    expect(result[0].name).toBe("Mi mazo");
    expect(result[0].inkColors).toEqual(["Amber", "Sapphire"]);
    expect(result[0].cards[0].cardId).toBe("card-1");
    // Las fechas deben ser strings ISO
    expect(typeof result[0].createdAt).toBe("string");
    expect(typeof result[0].updatedAt).toBe("string");
  });

  it("filtra por userId de la sesión", async () => {
    getSessionMock.mockResolvedValue(SESSION);
    prismaMock.deck.findMany.mockResolvedValue([]);

    await getUserDecksAction();

    expect(prismaMock.deck.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-123" },
      })
    );
  });
});

describe("saveDeckAction", () => {
  const NEW_DECK = {
    id: "deck_temporal-id",
    userId: "user-123",
    name: "Nuevo mazo",
    description: "",
    format: "",
    strategy: "",
    tier: "",
    inkColors: ["Ruby"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [{ cardId: "card-2", name: "Elsa", quantity: 2 }],
  };

  it("lanza error si no hay sesión", async () => {
    getSessionMock.mockResolvedValue(null);
    await expect(saveDeckAction(NEW_DECK)).rejects.toThrow("No autenticado");
  });

  it("usa create para mazos con ID temporal (deck_...)", async () => {
    getSessionMock.mockResolvedValue(SESSION);
    prismaMock.deck.create.mockResolvedValue({ ...DB_DECK, id: "deck-nuevo" });

    await saveDeckAction(NEW_DECK);

    expect(prismaMock.deck.create).toHaveBeenCalled();
    expect(prismaMock.deck.update).not.toHaveBeenCalled();
  });

  it("usa update para mazos con ID permanente", async () => {
    getSessionMock.mockResolvedValue(SESSION);
    prismaMock.deckCard.deleteMany.mockResolvedValue({});
    prismaMock.deck.update.mockResolvedValue(DB_DECK);

    const existingDeck = { ...NEW_DECK, id: "deck-abc" };
    await saveDeckAction(existingDeck);

    expect(prismaMock.deckCard.deleteMany).toHaveBeenCalledWith({
      where: { deckId: "deck-abc" },
    });
    expect(prismaMock.deck.update).toHaveBeenCalled();
    expect(prismaMock.deck.create).not.toHaveBeenCalled();
  });

  it("devuelve el mazo guardado con fechas como strings", async () => {
    getSessionMock.mockResolvedValue(SESSION);
    prismaMock.deck.create.mockResolvedValue(DB_DECK);

    const result = await saveDeckAction(NEW_DECK);

    expect(typeof result.createdAt).toBe("string");
    expect(typeof result.updatedAt).toBe("string");
    expect(result.name).toBe("Mi mazo");
  });
});

describe("deleteDeckAction", () => {
  it("lanza error si no hay sesión", async () => {
    getSessionMock.mockResolvedValue(null);
    await expect(deleteDeckAction("deck-abc")).rejects.toThrow("No autenticado");
  });

  it("elimina el mazo con el id y userId correctos", async () => {
    getSessionMock.mockResolvedValue(SESSION);
    prismaMock.deck.delete.mockResolvedValue({});

    await deleteDeckAction("deck-abc");

    expect(prismaMock.deck.delete).toHaveBeenCalledWith({
      where: { id: "deck-abc", userId: "user-123" },
    });
  });
});
