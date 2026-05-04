"use client";

import { Gallery } from "../components";
import { APP } from "../lib/constants";

export default function GalleryPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      {/* <header className="flex flex-col items-center gap-6 pt-6 text-center">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--accent)]">Archivo de cartas</p>
          <h1 className="mt-4 text-3xl font-bold tracking-wide text-[var(--ink)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-title)" }}>
            <span className="text-[var(--accent)]">Archivo del Reino de Lorcana</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
            Explora cartas reales desde la API de Lorcast y filtra por tinta,
            rareza o tipo.
          </p>
        </div>
      </header> */}
      <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
          Explora cartas reales desde la API de Lorcast y filtra por tinta,
          rareza o tipo.
      </p>

      <Gallery defaultSetCode={APP.DEFAULT_SET_CODE} />
    </div>
  );
}
