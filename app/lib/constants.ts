export const APP = {
  DEFAULT_SET_CODE: "all",
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
