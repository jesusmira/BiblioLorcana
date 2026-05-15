export interface StarterDeckCard {
  id: string;
  cardId: string;
  name: string;
  quantity: number;
  ink: string;
  type: string;
  cost: number;
  rarity: string;
  subtypes?: string | null;
  abilities?: string | null;
  imageUrl?: string | null;
}

export interface StarterDeck {
  id: string;
  name: string;
  set: string;
  inks: string[];
  description: string;
  profile: string;
  cards: StarterDeckCard[];
}