import "./globals.css";
import { SiteHeader, CookieBanner } from "@/components";
import { AuthProvider } from "@/lib/auth";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Galeria Lorcana",
  description: "Galeria de cartas de Lorcana con filtros y detalle",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <body>
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15" style={{ backgroundImage: "url('/images/lorcana-bg.png')" }} />
        </div>
        <AuthProvider>
          <SiteHeader />
          {children}
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
