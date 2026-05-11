export const LORCAST_NORMALIZATIONS = {
  vaianaToMoana: (text: string): string => text.replace(/Vaiana/gi, "Moana"),
} as const;

export const SEARCH_STRATEGIES = {
  byNumberAndSet: (number: string, set: string): string => `number:${number} set:${set}`,
  byNameAndRarity: (name: string, rarity: string): string => `${name} rarity:${rarity}`,
  byName: (name: string): string => name,
} as const;

export const OCR_PROMPTS = {
  lorcanaCard: `Analiza esta carta de Lorcana. Responde SOLO con un objeto JSON (sin bloques de código markdown, solo el texto JSON puro) con este formato:
{
  "name": "nombre del personaje (usa siempre 'Moana' en lugar de 'Vaiana')",
  "subtitle": "subtítulo",
  "number": "número si es visible ej: 1/P2 o 60/204",
  "isPromo": true o false (basado en si es una versión especial, promo, encantada o tiene arte diferente)
}`,
} as const;
