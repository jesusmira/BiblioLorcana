import type { LorcanaCard } from "@/types";

export function groupCardsBySet(cards: LorcanaCard[]): Record<string, LorcanaCard[]> {
  const groups = cards.reduce((acc, card) => {
    const setName = card.set?.name || "Otros";
    if (!acc[setName]) acc[setName] = [];
    acc[setName].push(card);
    return acc;
  }, {} as Record<string, LorcanaCard[]>);

  return Object.keys(groups)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = groups[key];
      return sorted;
    }, {} as Record<string, LorcanaCard[]>);
}

export function calculateTotalCopies(
  cards: LorcanaCard[],
  quantities: Record<string, number>
): number {
  const qtyKeys = Object.keys(quantities);
  if (qtyKeys.length === 0) {
    return cards.reduce((sum, c) => sum + (c.quantity ?? 1), 0);
  }
  return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
}

export function calculateUniqueCards(
  cards: LorcanaCard[],
  quantities: Record<string, number>
): number {
  return Object.keys(quantities).length || cards.length;
}
