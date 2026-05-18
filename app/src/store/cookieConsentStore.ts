"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  acceptedAt: string | null;
}

interface CookieConsentState {
  consent: CookieConsent;
  hasConsented: boolean;
  setConsent: (consent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  reset: () => void;
}

const defaultConsent: CookieConsent = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
  acceptedAt: null,
};

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      consent: defaultConsent,
      hasConsented: false,
      setConsent: (newConsent) =>
        set((state) => ({
          consent: { ...state.consent, ...newConsent, essential: true },
          hasConsented: true,
        })),
      acceptAll: () =>
        set({
          consent: {
            essential: true,
            analytics: true,
            marketing: true,
            functional: true,
            acceptedAt: new Date().toISOString(),
          },
          hasConsented: true,
        }),
      rejectAll: () =>
        set({
          consent: { ...defaultConsent, acceptedAt: new Date().toISOString() },
          hasConsented: true,
        }),
      reset: () =>
        set({
          consent: defaultConsent,
          hasConsented: false,
        }),
    }),
    {
      name: "cookie_consent",
    },
  ),
);

export function useCookieConsent() {
  const { consent, hasConsented } = useCookieConsentStore();
  return { consent, hasConsented };
}
