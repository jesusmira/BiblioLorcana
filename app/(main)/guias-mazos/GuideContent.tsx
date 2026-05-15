"use client";

import { useEffect, useState } from "react";
import { DecksSection, GuideHero, InksSection, TipsSection } from "./components";
import { type StarterDeck } from "@/types/guide";

export function GuideContent() {
  const [decks, setDecks] = useState<StarterDeck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch("/api/starter-decks");
        const data = await response.json();
        setDecks(data);
      } catch (error) {
        console.error("Error fetching starter decks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--accent)]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <GuideHero />
        <InksSection />
        <DecksSection decks={decks} loading={loading} />
        <TipsSection />
      </div>
    </div>
  );
}