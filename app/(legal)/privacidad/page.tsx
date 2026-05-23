import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Consulta la política de privacidad de Archivo del Reino. Información sobre el tratamiento de datos personales y cookies.",
  alternates: {
    canonical: "/privacidad",
  },
};

interface PageProps {
  params: Promise<{ locale?: string }>;
}

export default async function PrivacidadPage({ params }: PageProps) {
  const contentPath = path.join(process.cwd(), "app", "content", "privacy.md");
  const markdown = fs.readFileSync(contentPath, "utf-8");

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </main>
  );
}
