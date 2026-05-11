"use server";

import { fetchJson } from "@/lib/fetcher";
import { API } from "@/lib/constants";
import { LORCAST_NORMALIZATIONS, SEARCH_STRATEGIES } from "@/lib/prompts";
import type { LorcanaCard } from "@/types";

interface SearchCardParams {
  name: string;
  subtitle?: string;
  number?: string;
  isPromo: boolean;
}

interface SearchResult {
  card: LorcanaCard | null;
  isSpecialCard: boolean;
  error?: string;
}

export async function searchCard(params: SearchCardParams): Promise<SearchResult> {
  const { name, subtitle, number, isPromo } = {
    ...params,
    name: LORCAST_NORMALIZATIONS.vaianaToMoana(params.name),
    subtitle: params.subtitle ? LORCAST_NORMALIZATIONS.vaianaToMoana(params.subtitle) : undefined,
    number: params.number ? LORCAST_NORMALIZATIONS.vaianaToMoana(params.number) : undefined,
  };

  const nameParts = [name, subtitle].filter(Boolean).join(" ");
  const searchQueries: string[] = [];

  if (number?.includes("/")) {
    const parts = number.split("/");
    const numPart = parts[0].trim();
    const setPart = parts[1].split(/[·.\s]/)[0].trim();

    if (numPart && /^\d+$/.test(numPart) && setPart) {
      searchQueries.push(SEARCH_STRATEGIES.byNumberAndSet(numPart, setPart));
    }
  }

  if (isPromo) {
    searchQueries.push(SEARCH_STRATEGIES.byNameAndRarity(nameParts, "special"));
    searchQueries.push(SEARCH_STRATEGIES.byNameAndRarity(nameParts, "promo"));
  }

  searchQueries.push(SEARCH_STRATEGIES.byName(nameParts));

  for (const q of searchQueries) {
    try {
      const cards = await fetchJson<LorcanaCard[]>(
        `${API.LORCAST_BASE}/cards/search?q=${encodeURIComponent(q)}`,
        { errorMessage: "Error en búsqueda" }
      );

      if (!cards?.length) continue;

      let bestMatch = cards[0];

      if (number) {
        const numOnly = number.split("/")[0].trim();
        const match = cards.find((c) => c.collector_number === numOnly);
        if (match) bestMatch = match;
      }

      const rarity = (bestMatch.rarity as string)?.toLowerCase() ?? "";
      const isSpecialCard = ["special", "enchanted", "promo"].includes(rarity);

      return { card: bestMatch, isSpecialCard };
    } catch (error) {
      console.error(`Error en query "${q}":`, error);
      continue;
    }
  }

  return {
    card: null,
    isSpecialCard: false,
    error: `No se pudo encontrar la carta "${name}${subtitle ? ", " + subtitle : ""}".`,
  };
}
