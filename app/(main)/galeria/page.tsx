import type { Metadata } from "next";
import { Gallery } from "@/components";
import { APP } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Galería de Cartas",
  description:
    "Explora todas las cartas de Disney Lorcana. Filtra por tinta, rareza y tipo. Accede a la galería completa con imágenes oficiales.",
  openGraph: {
    title: "Galería de Cartas | Archivo del Reino",
    description:
      "Explora todas las cartas de Disney Lorcana. Filtra por tinta, rareza y tipo.",
    url: "/galeria",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Galería de Cartas")}&description=${encodeURIComponent("Explora todas las cartas de Disney Lorcana. Filtra por tinta, rareza y tipo.")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/galeria",
  },
};

interface PageProps {
  searchParams: { card?: string };
}

export default function GalleryPage({ searchParams }: PageProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
        Explora cartas reales desde la API de Lorcast y filtra por tinta, rareza
        o tipo.
      </p>
      <Gallery
        defaultSetCode={APP.DEFAULT_SET_CODE}
        initialCardId={searchParams.card}
      />
    </div>
  );
}
