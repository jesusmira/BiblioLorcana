"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

interface AuthGuardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
}

export default function AuthGuard({
  children,
  title = "Acceso Restringido",
  description = "Inicia sesión para acceder a esta sección y gestionar tus datos de Lorcana.",
  icon,
  isLoading: isDataLoading = false,
  loadingMessage = "Cargando datos...",
}: AuthGuardProps) {
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading || isDataLoading) {
    return (
      <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="text-[var(--muted)]">{loadingMessage}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl text-center">
        <div className="mb-6 rounded-full bg-[var(--surface-soft)] p-6 text-[var(--muted)]">
          {icon || (
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          )}
        </div>
        <h1 className="mb-4 font-[var(--font-title)] text-3xl">{title}</h1>
        <p className="mb-8 text-[var(--muted)] text-lg">{description}</p>
        <Link
          href="/login"
          className="rounded-full bg-[var(--accent)] px-8 py-3.5 font-bold text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}
