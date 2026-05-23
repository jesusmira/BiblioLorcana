import "./globals.css";
import { SiteHeader, CookieBanner } from "@/components";
import { AuthProvider } from "@/lib/auth";
import NavigationGuardProvider from "@/context/NavigationGuardProvider";
import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Archivo del Reino | Galería Disney Lorcana",
    template: "%s | Archivo del Reino",
  },
  description:
    "La herramienta definitiva para coleccionistas de Disney Lorcana. Explora cartas, construye mazos y gestiona tu colección.",
  keywords: [
    "Disney Lorcana",
    "cartas Lorcana",
    "galería Lorcana",
    "mazos Lorcana",
    "colección Lorcana",
    "TCG",
  ],
  authors: [{ name: "Archivo del Reino" }],
  creator: "Archivo del Reino",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Archivo del Reino",
    title: "Archivo del Reino | Galería Disney Lorcana",
    description:
      "La herramienta definitiva para coleccionistas de Disney Lorcana. Explora cartas, construye mazos y gestiona tu colección.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Archivo del Reino")}&description=${encodeURIComponent("La herramienta definitiva para coleccionistas de Disney Lorcana.")}`,
        width: 1200,
        height: 630,
        alt: "Archivo del Reino - Galería Disney Lorcana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Archivo del Reino | Galería Disney Lorcana",
    description:
      "La herramienta definitiva para coleccionistas de Disney Lorcana.",
    images: [
      `/api/og?title=${encodeURIComponent("Archivo del Reino")}&description=${encodeURIComponent("La herramienta definitiva para coleccionistas de Disney Lorcana.")}`,
    ],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: "#C58A3C",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Archivo del Reino",
  url: siteUrl,
  description:
    "La herramienta definitiva para coleccionistas de Disney Lorcana.",
  inLanguage: "es",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: "url('/images/lorcana-bg.png')" }}
          />
        </div>
        <AuthProvider>
          <NavigationGuardProvider>
            <SiteHeader />
            {children}
            <CookieBanner />
          </NavigationGuardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
