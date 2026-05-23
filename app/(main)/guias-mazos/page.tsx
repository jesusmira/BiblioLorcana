import { Metadata } from "next";
import { GuideContent } from "./GuideContent";

export const metadata: Metadata = {
  title: "Guías de Mazos",
  description:
    "Guía completa de mazos de inicio para Disney Lorcana. Aprende qué tinta elegir y qué mazo se adapte mejor a tu estilo de juego.",
  openGraph: {
    title: "Guías de Mazos | Archivo del Reino",
    description:
      "Guía completa de mazos de inicio para Disney Lorcana. Aprende qué tinta elegir.",
    url: "/guias-mazos",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Guías de Mazos")}&description=${encodeURIComponent("Guía completa de mazos de inicio para Disney Lorcana. Aprende qué tinta elegir.")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/guias-mazos",
  },
};

export default function GuiasMazosPage() {
  return <GuideContent />;
}
