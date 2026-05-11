import { Metadata } from "next";
import { GuideContent } from './GuideContent';

export const metadata: Metadata = {
  title: "Guías de Mazos - Archivo del Reino",
  description: "Guía completa de mazos de inicio para Disney Lorcana. Aprende qué tinta elegir y qué mazo se adapte mejor a tu estilo de juego.",
};

export default function GuiasMazosPage() {
  return <GuideContent />;
}
