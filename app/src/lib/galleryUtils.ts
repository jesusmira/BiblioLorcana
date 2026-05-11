import type { LorcanaCard } from "../types";

const inkOrder: string[] = [
  "Amber",
  "Amethyst",
  "Emerald",
  "Ruby",
  "Sapphire",
  "Steel",
  "Sin tinta",
];

const normalizeInk = (value: string | undefined | null): string =>
  value ?? "Sin tinta";

const normalizeLabel = (value: string | undefined | null): string =>
  value ? value.replace(/_/g, " ") : "Sin dato";

const getInkIndex = (value: string): number => {
  const index = inkOrder.indexOf(value);
  return index === -1 ? inkOrder.length : index;
};

const formatDate = (value: string | undefined | null): string => {
  if (!value) return "--";
  return value.slice(0, 10);
};

const getTypes = (card: LorcanaCard): string[] =>
  Array.isArray(card.type) ? card.type : [];

export {
  inkOrder,
  normalizeInk,
  normalizeLabel,
  getInkIndex,
  formatDate,
  getTypes,
};
