// ── Lorcana Card Types ──

export interface CardImageUris {
  digital?: {
    small?: string | null;
    normal?: string | null;
    large?: string | null;
  } | null;
}

export interface LorcanaCard {
  id: string | number;
  name?: string | null;
  version?: string | null;
  text?: string | null;
  abilities?: string | null;
  flavor_text?: string | null;
  flavorText?: string | null;
  ink?: string | null;
  cost?: number | null;
  rarity?: string | null;
  type?: string[] | null;
  strength?: number | null;
  willpower?: number | null;
  lore?: number | null;
  collector_number?: string | null;
  collector_count?: string | null;
  classifications?: string[] | null;
  imageUrl?: string | null;
  image_uris?: CardImageUris | null;
  quantity?: number;
  set?: {
    name?: string | null;
  } | null;
}

export interface LorcanaSet {
  id: string | number;
  name: string;
  code: string;
  released_at?: string | null;
}

// ── Filter Types ──

export interface GalleryFilters {
  search: string;
  ink: string;
  type: string;
  rarity: string;
  sort: string;
}

// ── Theme Types ──

export type Theme = "dark" | "light";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ── Hook Return Types ──

export interface UseGalleryDataReturn {
  sets: LorcanaSet[];
  loadingSets: boolean;
  setError: string;
  cards: LorcanaCard[];
  loadingCards: boolean;
  cardError: string;
  selectedSet: string;
  setSelectedSet: (set: string) => void;
  search: string;
  ink: string;
  type: string;
  rarity: string;
  sort: string;
  updateFilter: (name: string, value: string) => void;
  resetFilters: () => void;
  setSearch: (val: string) => void;
  setInk: (val: string) => void;
  setType: (val: string) => void;
  setRarity: (val: string) => void;
  setSort: (val: string) => void;
}

export interface UseGalleryFiltersParams {
  cards: LorcanaCard[];
  search: string;
  ink: string;
  type: string;
  rarity: string;
  sort: string;
}

export interface UseGalleryFiltersReturn {
  inkValues: string[];
  typeValues: string[];
  rarityValues: string[];
  filteredCards: LorcanaCard[];
}

export interface UsePaginationReturn<T> {
  visibleCount: number;
  visibleItems: T[];
  canLoadMore: boolean;
  loadMore: () => void;
}

export interface UseModalCardParams {
  cards?: LorcanaCard[];
}

export interface UseModalCardReturn {
  selected: LorcanaCard | null;
  openCard: (card: LorcanaCard) => void;
  closeModal: () => void;
  pickRandom: () => void;
}

// ── Deck Types ──

export interface DeckCard {
  cardId: string;
  name: string;
  quantity: number;
  cost: number | null;
  ink: string | null;
  type: string | null;
  rarity: string | null;
  image: string | null;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  inkColors: string[];
  cards: DeckCard[];
  fullCards: LorcanaCard[];
  totalCards: number;
}

export interface DeckCardEntry {
  cardId: string;
  name: string;
  quantity: number;
}

export interface UserDeck {
  id: string;
  name: string;
  description: string;
  format?: string;
  strategy?: string;
  tier?: string;
  tags?: string[];
  inkColors?: string[];
  cards: DeckCardEntry[];
  createdAt: string;
  updatedAt: string;
}

export const DECK_FORMATS = [
  "Casual",
  "Competitivo",
  "Vintage",
  "Standard",
  "Any",
] as const;

export const DECK_STRATEGIES = [
  "Aggro",
  "Control",
  "Midrange",
  "Combo",
  "Ramp",
  "Bounce",
  "Chalice",
  "Steel",
] as const;

export const DECK_TIERS = ["S", "A", "B", "C"] as const;
