"use client";

import { Button } from "@/components/ui/Button";
import { CookieBannerToggle } from "./CookieBannerToggle";
import { COOKIE_CATEGORIES, type CookieCategory } from "./types";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  acceptedAt: string | null;
}

export interface CookieBannerPreferencesProps {
  preferences: CookiePreferences;
  onToggle: (key: CookieCategory, value: boolean) => void;
  onBack: () => void;
  onSave: () => void;
  onAcceptAll: () => void;
}

export function CookieBannerPreferences({
  preferences,
  onToggle,
  onBack,
  onSave,
  onAcceptAll,
}: CookieBannerPreferencesProps) {
  return (
    <div className="cookie-banner-preferences">
      <div className="cookie-banner-header">
        <h2 className="font-serif text-lg font-semibold text-[var(--ink)]">
          Gestionar cookies
        </h2>
        <button onClick={onBack} className="cookie-link">
          ← Volver
        </button>
      </div>

      <div className="cookie-options">
        <CookieBannerToggle
          label="Esenciales"
          description="Necesarias para el funcionamiento básico"
          checked
          disabled
        />
        {COOKIE_CATEGORIES.map((category) => (
          <CookieBannerToggle
            key={category.key}
            label={category.label}
            description={category.description}
            checked={preferences[category.key] as boolean}
            onChange={(checked) => onToggle(category.key, checked)}
          />
        ))}
      </div>

      <div className="cookie-banner-actions">
        <Button variant="solid" onClick={onSave}>
          Guardar preferencias
        </Button>
        <Button variant="ghost" onClick={onAcceptAll}>
          Aceptar todo
        </Button>
      </div>
    </div>
  );
}
