import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manual del Iluminador",
  description:
    "Aprende a jugar a Disney Lorcana desde cero. Descubre el objetivo del juego, la anatomía de las cartas, cómo se desarrolla cada turno y las estrategias básicas.",
  openGraph: {
    title: "Manual del Iluminador | Archivo del Reino",
    description:
      "Aprende a jugar a Disney Lorcana desde cero. Guía completa para nuevos jugadores.",
    url: "/como-jugar",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Manual del Iluminador")}&description=${encodeURIComponent("Aprende a jugar a Disney Lorcana desde cero. Guía completa para nuevos jugadores.")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/como-jugar",
  },
};
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  SectionObjetivo,
  SectionAnatomia,
  SectionTurno,
  SectionProporcion,
  SectionEstrategias,
  SectionMaestria,
} from "./components";
import { CONTENT } from "./content";

export default function ComoJugarPage() {
  const { header, sections, footer } = CONTENT;

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-20 pt-24 max-w-5xl">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Volver a la galería
      </Link>

      <header className="mb-16 text-center">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--accent)]">
            Aprende a jugar
          </p>
          <h1
            className="mt-4 text-3xl font-bold tracking-wide text-[var(--ink)] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-title)" }}
          >
            <span className="text-[var(--accent)]">Manual del Iluminador</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
            {header.subtitle}
          </p>
        </div>
      </header>

      <div className="space-y-20">
        <SectionObjetivo data={sections.objetivo} />
        <SectionAnatomia data={sections.anatomia} />
        <SectionTurno data={sections.turno} />
        <SectionProporcion data={sections.proporcion} />
        <SectionEstrategias data={sections.estrategias} />
        <SectionMaestria data={sections.maestria} />
      </div>

      <footer className="mt-24 text-center space-y-6">
        <h3 className="text-2xl font-[var(--font-title)]">{footer.title}</h3>
        <Link
          href="/"
          className="buttonSolid inline-flex items-center gap-2 px-10 py-5 text-xl transition transform hover:scale-105 active:scale-95"
        >
          {footer.cta}
        </Link>
      </footer>
    </main>
  );
}
