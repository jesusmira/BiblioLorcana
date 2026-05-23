"use server";

import { z } from "zod";
import { fetchJson } from "@/lib/fetcher";
import { getCached, setCache } from "@/lib/cache";
import {
  LorcanaCardSchema,
  LorcanaSetSchema,
  ResultsSchema,
} from "@/lib/lorcastSchemas";
import type { LorcanaSet, LorcanaCard } from "../types";

const API_BASE = process.env.LORCAST_API_BASE || "https://api.lorcast.com/v0";

const parseResults = <T>(data: unknown, schema: z.ZodType<T>): T[] => {
  const parseArray = (items: unknown[]): T[] => {
    const parsed = items
      .map((item) => schema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data);
    if (parsed.length) {
      return parsed;
    }
    throw new Error("Respuesta invalida del servidor");
  };

  const arrayResult = z.array(schema).safeParse(data);
  if (arrayResult.success) {
    return arrayResult.data;
  }

  if (Array.isArray(data)) {
    return parseArray(data);
  }

  const objectResult = ResultsSchema(schema).safeParse(data);
  if (objectResult.success) {
    const results = objectResult.data.results ?? [];
    return parseArray(results);
  }

  if (data && typeof data === "object" && "results" in data) {
    const results = (data as { results?: unknown }).results;
    if (Array.isArray(results)) {
      return parseArray(results);
    }
  }

  throw new Error("Respuesta invalida del servidor");
};

export async function fetchSetsAction(): Promise<LorcanaSet[]> {
  const cacheKey = "lorcast:sets";
  const cached = getCached<LorcanaSet[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const data = await fetchJson<unknown>(`${API_BASE}/sets`, {
    errorMessage: "No se pudieron cargar los sets",
  });
  const result = parseResults(data, LorcanaSetSchema);
  setCache(cacheKey, result, 10 * 60 * 1000);
  return result;
}

export async function fetchCardsBySetAction(
  code: string,
): Promise<LorcanaCard[]> {
  const cacheKey = `lorcast:cards:${code}`;
  const cached = getCached<LorcanaCard[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const data = await fetchJson<unknown>(`${API_BASE}/sets/${code}/cards`, {
    errorMessage: "No se pudieron cargar las cartas",
  });
  const result = parseResults(data, LorcanaCardSchema);
  setCache(cacheKey, result, 5 * 60 * 1000);
  return result;
}

export interface CardSearchFilters {
  ink?: string;
  type?: string;
  rarity?: string;
  setCode?: string;
}

export async function searchCardsAction(query: string): Promise<LorcanaCard[]> {
  const q = query.trim();
  if (!q) {
    return fetchAllCardsAction();
  }

  const cacheKey = `lorcast:search:${q.toLowerCase()}`;
  const cached = getCached<LorcanaCard[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const endpoint = `${API_BASE}/cards/search?q=${encodeURIComponent(q)}`;
  const data = await fetchJson<unknown>(endpoint, {
    errorMessage: "No se pudo realizar la búsqueda",
  });
  const result = parseResults(data, LorcanaCardSchema);
  setCache(cacheKey, result, 2 * 60 * 1000);
  return result;
}

export async function searchCardsWithFiltersAction(
  query: string,
  filters: CardSearchFilters = {},
): Promise<LorcanaCard[]> {
  const q = query.trim();
  const hasAnyFilter =
    filters.ink || filters.type || filters.rarity || filters.setCode;

  // Caso 1: Solo filtro de set sin query - usar endpoint directo
  const onlySetFilter =
    filters.setCode && !q && !filters.ink && !filters.type && !filters.rarity;
  if (onlySetFilter && filters.setCode) {
    try {
      return await fetchCardsBySetAction(filters.setCode);
    } catch {
      return [];
    }
  }

  // Caso 2: Query vacía + filtros -> buscar todas las cartas (del set si hay) y filtrar localmente
  if (!q && hasAnyFilter) {
    let baseResults: LorcanaCard[];
    try {
      if (filters.setCode) {
        baseResults = await fetchCardsBySetAction(filters.setCode);
      } else {
        baseResults = await fetchAllCardsAction();
      }
    } catch {
      baseResults = [];
    }

    // Si no hay resultados, devolver vacío
    if (!baseResults.length) {
      return [];
    }

    // Filtrar localmente
    return filterCardsLocally(baseResults, filters);
  }

  // Caso 2b: Query con filtro de set (sin otros filtros) -> buscar en el set específico
  const queryWithSetOnly =
    q && filters.setCode && !filters.ink && !filters.type && !filters.rarity;
  if (queryWithSetOnly && filters.setCode) {
    let baseResults: LorcanaCard[];
    try {
      baseResults = await fetchCardsBySetAction(filters.setCode);
    } catch {
      baseResults = [];
    }

    if (!baseResults.length) {
      return [];
    }

    // Filtrar por query en el nombre
    const qLower = q.toLowerCase();
    return baseResults
      .filter((card) => card.name?.toLowerCase().includes(qLower))
      .slice(0, 50);
  }

  // Caso 3: Query con o sin filtros adicionales - cargar todas las cartas y filtrar localmente
  let baseResults: LorcanaCard[];
  try {
    if (filters.setCode) {
      baseResults = await fetchCardsBySetAction(filters.setCode);
    } else {
      baseResults = await fetchAllCardsAction();
    }
  } catch {
    baseResults = [];
  }

  if (!baseResults.length) {
    return [];
  }

  // Filtrar por nombre
  const qLower = q.toLowerCase();
  let filteredByName = baseResults.filter((card) =>
    card.name?.toLowerCase().includes(qLower),
  );

  // Si no hay filtros adicionales, devolver los primeros 50
  if (!filters.ink && !filters.type && !filters.rarity) {
    return filteredByName.slice(0, 50);
  }

  // Aplicar filtros adicionales
  return filterCardsLocally(filteredByName, filters);
}

function filterCardsLocally(
  cards: LorcanaCard[],
  filters: CardSearchFilters,
): LorcanaCard[] {
  const normalizeInk = (value: string | undefined | null): string => {
    if (!value) return "";
    return value.toLowerCase().replace(/\s+/g, "_").replace(/_+/g, "_");
  };

  const getTypes = (card: LorcanaCard): string[] => {
    if (!card.type) return [];
    return Array.isArray(card.type) ? card.type : [card.type];
  };

  return cards.filter((card) => {
    if (filters.ink) {
      const normalizedCardInk = normalizeInk(card.ink);
      if (filters.ink === "none") {
        if (normalizedCardInk !== "") return false;
      } else {
        if (normalizedCardInk !== filters.ink) return false;
      }
    }
    if (filters.type && !getTypes(card).includes(filters.type)) {
      return false;
    }
    if (filters.rarity && card.rarity !== filters.rarity) {
      return false;
    }
    return true;
  });
}

export async function fetchCardBySetAndNumberAction(
  setCode: string,
  collectorNumber: string,
): Promise<LorcanaCard | null> {
  try {
    const data = await fetchJson<unknown>(
      `${API_BASE}/cards/${setCode}/${collectorNumber}`,
      { errorMessage: "No se pudo cargar la carta" },
    );
    const result = LorcanaCardSchema.safeParse(data);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function fetchAllCardsAction(): Promise<LorcanaCard[]> {
  try {
    const sets = await fetchSetsAction();
    const allCardsPromises = sets.map((set) => fetchCardsBySetAction(set.code));
    const results = await Promise.all(allCardsPromises);
    return results.flat();
  } catch (error) {
    console.error("Error fetching all cards:", error);
    throw new Error(
      "No se pudieron cargar todas las cartas. Por favor, intenta de nuevo.",
    );
  }
}
