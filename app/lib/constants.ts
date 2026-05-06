export const APP = {
  DEFAULT_SET_CODE: "11",
  PAGE_SIZE: Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 16,
} as const;

export const STORAGE_KEYS = {
  OCR_IMAGE: "ocr_image_data",
  THEME: "lorcana-theme",
} as const;

export const API = {
  LORCAST_BASE: process.env.LORCAST_API_BASE || "https://api.lorcast.com/v0",
} as const;

export const THEME = {
  DEFAULT: "dark" as const,
};

export const INK_COLORS: Record<string, string> = {
  amber: "#F59E0B",
  amethyst: "#8B5CF6",
  emerald: "#10B981",
  ruby: "#EF4444",
  sapphire: "#3B82F6",
  steel: "#6B7280",
};

export const INK_LABELS: Record<string, string> = {
  amber: "Ambar",
  amethyst: "Amatista",
  emerald: "Esmeralda",
  ruby: "Rubí",
  sapphire: "Zafiro",
  steel: "Acero",
};

export const CARD_TYPES = [
  "Action",
  "Character",
  "Item",
  "Location",
] as const;

export const RARITY_LABELS: Record<string, string> = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Rara",
  super_rare: "Súper rara",
};
