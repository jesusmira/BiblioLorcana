"use client";

import { INKS } from "../data/guideData";
import { InkCard } from "./InkCard";

export function InksSection() {
  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2
          className="text-2xl font-bold text-[var(--ink)] sm:text-3xl"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Las <span className="text-[var(--accent)]">6 Tintas</span> de Lorcana
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
          Cada tinta representa un estilo de juego único. Los mazos de inicio siempre combinan dos tintas.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {INKS.map((ink) => (
          <InkCard key={ink.name} ink={ink} />
        ))}
      </div>
    </div>
  );
}
