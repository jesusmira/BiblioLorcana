export type CookieCategory = "analytics" | "marketing" | "functional";

export interface CookieCategoryConfig {
  key: CookieCategory;
  label: string;
  description: string;
}

export const COOKIE_CATEGORIES: CookieCategoryConfig[] = [
  {
    key: "analytics",
    label: "Analíticas",
    description: "Nos ayudan a entender cómo se usa la web",
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Para mostrar anuncios personalizados",
  },
  {
    key: "functional",
    label: "Funcionales",
    description: "Para preferencias como idioma o tema",
  },
];

export const DEFAULT_REDIRECT_URL = "https://www.google.com";
export const REDIRECT_DELAY_MS = 1500;