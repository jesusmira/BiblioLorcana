import type { Metadata } from "next";
import { Hero, Features, HowItWorks, CTA, Footer } from "@/components/landing";

export const metadata: Metadata = {
  title: {
    absolute: "Archivo del Reino | Galería Disney Lorcana",
  },
  description:
    "La herramienta definitiva para coleccionistas de Disney Lorcana. Explora cartas, construye mazos y gestiona tu colección.",
  openGraph: {
    title: "Archivo del Reino | Galería Disney Lorcana",
    description:
      "La herramienta definitiva para coleccionistas de Disney Lorcana.",
    url: "/",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Archivo del Reino")}&description=${encodeURIComponent("La herramienta definitiva para coleccionistas de Disney Lorcana.")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}
