"use client";

import { useEffect, useState } from "react";
import { useCookieConsentStore } from "../../store/cookieConsentStore";
import { CookieBannerInitial } from "./CookieBannerInitial";
import { CookieBannerPreferences } from "./CookieBannerPreferences";
import { CookieBannerRedirect } from "./CookieBannerRedirect";
import { DEFAULT_REDIRECT_URL, REDIRECT_DELAY_MS, type CookieCategory } from "./types";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  acceptedAt: string | null;
}

interface CookieBannerProps {
  redirectUrl?: string;
}

type ViewState = "initial" | "preferences";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
  acceptedAt: null,
};

export default function CookieBanner({ redirectUrl = DEFAULT_REDIRECT_URL }: CookieBannerProps) {
  const { hasConsented, acceptAll, rejectAll, setConsent } = useCookieConsentStore();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewState>("initial");
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || hasConsented) {
    return null;
  }

  const handleRejectAll = () => {
    rejectAll();
    setShowRedirectMessage(true);
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, REDIRECT_DELAY_MS);
  };

  const handleSavePreferences = () => {
    setConsent({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      functional: preferences.functional,
    });
  };

  const handleAcceptAllFromPreferences = () => {
    setPreferences({
      ...preferences,
      analytics: true,
      marketing: true,
      functional: true,
    });
    acceptAll();
  };

  const handleTogglePreference = (key: CookieCategory, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (showRedirectMessage) {
    return <CookieBannerRedirect />;
  }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consentimiento de cookies">
      <div className="cookie-banner-content">
        {view === "initial" ? (
          <CookieBannerInitial
            onAcceptAll={acceptAll}
            onRejectAll={handleRejectAll}
            onManageOptions={() => setView("preferences")}
          />
        ) : (
          <CookieBannerPreferences
            preferences={preferences}
            onToggle={handleTogglePreference}
            onBack={() => setView("initial")}
            onSave={handleSavePreferences}
            onAcceptAll={handleAcceptAllFromPreferences}
          />
        )}
      </div>
    </div>
  );
}