"use server";

import { z } from "zod";
import { fetchJson } from "../lib/fetcher";
import { LorcanaCardSchema, LorcanaSetSchema, ResultsSchema } from "../lib/lorcastSchemas";
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
  const data = await fetchJson<unknown>(`${API_BASE}/sets`, {
    errorMessage: "No se pudieron cargar los sets",
  });
  return parseResults(data, LorcanaSetSchema);
}

export async function fetchCardsBySetAction(code: string): Promise<LorcanaCard[]> {
  const data = await fetchJson<unknown>(`${API_BASE}/sets/${code}/cards`, {
    errorMessage: "No se pudieron cargar las cartas",
  });
  return parseResults(data, LorcanaCardSchema);
}
