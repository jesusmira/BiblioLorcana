"use client";

export function GuideHero() {
  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--accent)]">
        Guía completa
      </p>
      <h1
        className="mt-4 text-3xl font-bold tracking-wide text-[var(--ink)] sm:text-4xl lg:text-5xl"
        style={{ fontFamily: "var(--font-title)" }}
      >
        <span className="text-[var(--accent)]">Mazos de Inicio</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
        Todo lo que necesitas saber para elegir tu primer mazo en Disney Lorcana.
        Descubre las tintas, los mazos disponibles y encuentra el que mejor se adapte a tu estilo de juego.
      </p>
    </div>
  );
}
