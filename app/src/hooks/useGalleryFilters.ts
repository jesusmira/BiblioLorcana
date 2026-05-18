"use client";

import { useMemo } from "react";
import { getInkIndex, getTypes, inkOrder, normalizeInk } from "../lib";
import type {
  UseGalleryFiltersParams,
  UseGalleryFiltersReturn,
} from "../types";

export default function useGalleryFilters({
  cards,
  search,
  ink,
  type,
  rarity,
  sort,
}: UseGalleryFiltersParams): UseGalleryFiltersReturn {
  const inkValues = useMemo(() => {
    const values = new Set(cards.map((card) => normalizeInk(card.ink)));
    const ordered = inkOrder.filter((value) => values.has(value));
    const extra = [...values].filter((value) => !inkOrder.includes(value));
    return [...ordered, ...extra];
  }, [cards]);

  const typeValues = useMemo(() => {
    const values = new Set<string>();
    cards.forEach((card) => {
      getTypes(card).forEach((item) => values.add(item));
    });
    return [...values].sort((a, b) => a.localeCompare(b));
  }, [cards]);

  const rarityValues = useMemo(() => {
    const values = new Set(
      cards.map((card) => card.rarity).filter(Boolean) as string[],
    );
    return [...values].sort((a, b) => a.localeCompare(b));
  }, [cards]);

  const filteredCards = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = cards.filter((card) => {
      const matchesQuery =
        !query ||
        card.name?.toLowerCase().includes(query) ||
        (card.text ?? "").toLowerCase().includes(query);
      const matchesInk = ink ? normalizeInk(card.ink) === ink : true;
      const matchesType = type ? getTypes(card).includes(type) : true;
      const matchesRarity = rarity ? card.rarity === rarity : true;
      return matchesQuery && matchesInk && matchesType && matchesRarity;
    });

    list = list.sort((a, b) => {
      if (sort === "cost") {
        return (a.cost ?? 0) - (b.cost ?? 0);
      }
      if (sort === "ink") {
        return (
          getInkIndex(normalizeInk(a.ink)) - getInkIndex(normalizeInk(b.ink))
        );
      }
      return (a.name ?? "").localeCompare(b.name ?? "");
    });

    return list;
  }, [cards, search, ink, type, rarity, sort]);

  return {
    inkValues,
    typeValues,
    rarityValues,
    filteredCards,
  };
}
