"use client";

import { Button } from "@/components/ui/Button";

export interface CookieBannerInitialProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onManageOptions: () => void;
}

export function CookieBannerInitial({
  onAcceptAll,
  onRejectAll,
  onManageOptions,
}: CookieBannerInitialProps) {
  return (
    <div className="cookie-banner-initial">
      <div className="cookie-banner-text">
        <h2 className="mb-2 font-serif text-lg font-semibold text-[var(--ink)]">
          Preferencias de cookies
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Esta web utiliza cookies para mejorar tu experiencia. Puedes
          aceptar todas, rechazar las no esenciales o gestionar cada categoría.
        </p>
      </div>
      <div className="cookie-banner-actions">
        <Button variant="solid" onClick={onAcceptAll}>
          Aceptar todo
        </Button>
        <Button variant="ghost" onClick={onRejectAll}>
          Rechazar todo
        </Button>
        <button onClick={onManageOptions} className="cookie-link">
          Gestionar opciones
        </button>
      </div>
    </div>
  );
}
