"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../lib/auth";
import { removeCardFromUser } from "../actions";
import type { LorcanaCard } from "../types";
import {
  ArrowLeftIcon,
  TrashIcon,
  HeartIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function MisCartasPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [cards, setCards] = useState<LorcanaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("/api/user/cards");
        if (!res.ok) {
          if (res.status === 401) {
            setError("Debes iniciar sesión para ver tus cartas");
          } else {
            setError("Error al cargar las cartas");
          }
          return;
        }
        const data = await res.json();
        setCards(data);
      } catch {
        setError("Error al cargar las cartas");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchCards();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleRemoveCard = async (cardId: string) => {
    setRemovingId(cardId);
    const result = await removeCardFromUser(cardId);
    if (result.success) {
      setCards((prev) => prev.filter((c) => String(c.id) !== cardId));
    }
    setRemovingId(null);
  };

  if (authLoading || loading) {
    return (
      <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
          <p className="text-[var(--muted)]">Cargando...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl text-center">
        <ExclamationTriangleIcon className="mb-4 h-16 w-16 text-[var(--muted)]" />
        <h1 className="mb-4 font-[var(--font-title)] text-2xl">Mis Cartas</h1>
        <p className="mb-6 text-[var(--muted)]">
          Debes iniciar sesión para ver tus cartas guardadas
        </p>
        <Link
          href="/login"
          className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen flex-col items-center px-4 pb-12 pt-24 max-w-2xl text-center">
        <p className="text-[var(--alert)]">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Volver a la galería
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-4xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--ink)]"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Volver a la galería
      </Link>

      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <HeartIcon className="h-8 w-8 text-[var(--accent)]" />
          <h1 className="font-[var(--font-title)] text-3xl">Mis Cartas</h1>
        </div>
        <p className="text-[var(--muted)]">
          {cards.length} {cards.length === 1 ? "carta guardada" : "cartas guardadas"}
        </p>
      </header>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-12 text-center">
          <HeartIcon className="h-12 w-12 text-[var(--muted)]" />
          <p className="text-[var(--muted)]">
            Aún no tienes cartas guardadas
          </p>
          <Link
            href="/"
            className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Explorar cartas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-[16px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-4"
            >
              <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-[12px] bg-[var(--surface)]">
                {card.image_uris?.digital?.normal ? (
                  <Image
                    src={card.image_uris.digital.normal}
                    alt={card.name || "Carta"}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-[var(--muted)]">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.75rem] uppercase tracking-[1px] text-[var(--muted)]">
                    {card.set?.name}
                  </p>
                  <h3 className="truncate font-[var(--font-title)] text-[1rem]">
                    {card.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleRemoveCard(String(card.id))}
                  disabled={removingId === String(card.id)}
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--alert)]/20 hover:text-[var(--alert)] disabled:opacity-50"
                  aria-label="Eliminar de mis cartas"
                >
                  {removingId === String(card.id) ? (
                    <div className="h-4 w-4 animate-spin rounded-full border border-[var(--alert)] border-t-transparent"></div>
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}