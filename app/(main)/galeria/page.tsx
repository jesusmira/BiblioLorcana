"use client";

import { Gallery } from "@/components";
import { APP } from "@/lib/constants";

export default function GalleryPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
        Explora cartas reales desde la API de Lorcast y filtra por tinta, rareza
        o tipo.
      </p>
      <Gallery defaultSetCode={APP.DEFAULT_SET_CODE} />
    </div>
  );
}
