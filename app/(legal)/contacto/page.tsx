import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con el equipo de Archivo del Reino. Envíanos tus dudas, sugerencias o reporta cualquier problema.",
  openGraph: {
    title: "Contacto | Archivo del Reino",
    description: "Ponte en contacto con el equipo de Archivo del Reino.",
    url: "/contacto",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Contacto")}&description=${encodeURIComponent("Ponte en contacto con el equipo de Archivo del Reino.")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "/contacto",
  },
};

interface PageProps {
  params: Promise<{ locale?: string }>;
}

export default async function ContactoPage({ params }: PageProps) {
  const contentPath = path.join(process.cwd(), "app", "content", "contact.md");
  const markdown = fs.readFileSync(contentPath, "utf-8");

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </main>
  );
}
