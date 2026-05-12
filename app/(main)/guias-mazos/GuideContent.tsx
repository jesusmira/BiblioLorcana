"use client";

import {
  FireIcon,
  SparklesIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StarterDeckCard {
  id: string;
  cardId: string;
  name: string;
  quantity: number;
  ink: string;
  type: string;
  cost: number;
  rarity: string;
  subtypes?: string | null;
  abilities?: string | null;
  imageUrl?: string | null;
}

interface StarterDeck {
  id: string;
  name: string;
  set: string;
  inks: string[];
  description: string;
  profile: string;
  cards: StarterDeckCard[];
}

const inks = [
  {
    icon: SparklesIcon,
    name: "Ámbar",
    color: "bg-amber-500",
    description: "Trabajo en equipo y personajes de apoyo. Excelente para partidas colaborativas.",
  },
  {
    icon: SparklesIcon,
    name: "Amatista",
    color: "bg-purple-600",
    description: "Magia y control de mesa. Ideal para jugadores estratégicos.",
  },
  {
    icon: BoltIcon,
    name: "Esmeralda",
    color: "bg-emerald-500",
    description: "Velocidad y jugadas arriesgadas. Para quienes buscan combos rápidos.",
  },
  {
    icon: FireIcon,
    name: "Rubí",
    color: "bg-red-500",
    description: "Agresividad y personajes ofensivos. Ataque sin parar.",
  },
  {
    icon: CurrencyDollarIcon,
    name: "Zafiro",
    color: "bg-blue-500",
    description: "Recursos y desarrollo a largo plazo. Controla el ritmo de la partida.",
  },
  {
    icon: ShieldCheckIcon,
    name: "Acero",
    color: "bg-slate-400",
    description: "Fuerza bruta y defensa sólida. Resiste hasta el final.",
  },
];

const tips = [
  "Juega varias partidas con tu mazo inicial antes de cambiarlo. Así entiendes bien su estilo.",
  "Identifica qué cartas brillan más y busca copias extra en sobres o intercambios.",
  "Combina dos mazos iniciales es un truco barato para mejorar tu mazo.",
  "Usa fundas protectoras desde el principio. Las cartas exclusivas se revalorizan.",
  "No te obsesiones con ganar siempre: la idea es aprender mecánicas y divertirte.",
];

export function GuideContent() {
  const [decks, setDecks] = useState<StarterDeck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch("/api/starter-decks");
        const data = await response.json();
        setDecks(data);
      } catch (error) {
        console.error("Error fetching starter decks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const getInkSpanish = (ink: string): string => {
    const map: Record<string, string> = {
      Amber: "Ámbar",
      Amethyst: "Amatista",
      Emerald: "Esmeralda",
      Ruby: "Rubí",
      Sapphire: "Zafiro",
      Steel: "Acero",
    };
    return map[ink] || ink;
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--accent)]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--accent)]">Guía completa</p>
          <h1 className="mt-4 text-3xl font-bold tracking-wide text-[var(--ink)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-title)" }}>
            <span className="text-[var(--accent)]">Mazos de Inicio</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
            Todo lo que necesitas saber para elegir tu primer mazo en Disney Lorcana. 
            Descubre las tintas, los mazos disponibles y encuentra el que mejor se adapte a tu estilo de juego.
          </p>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--ink)] sm:text-3xl" style={{ fontFamily: "var(--font-title)" }}>
              Las <span className="text-[var(--accent)]">6 Tintas</span> de Lorcana
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
              Cada tinta representa un estilo de juego único. Los mazos de inicio siempre combinan dos tintas.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inks.map((ink) => (
              <div key={ink.name} className="group relative rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--panel)]/60">
                <div className="flex flex-col items-center text-center">
                  <div className={clsx("mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--stroke-strong)] bg-[var(--panel)]", ink.color)}>
                    <ink.icon className="h-6 w-6 text-[var(--ink)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">{ink.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{ink.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--ink)] sm:text-3xl" style={{ fontFamily: "var(--font-title)" }}>
              <span className="text-[var(--accent)]">Starter Decks</span> por Set
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
              Cada expansión incluye mazos de inicio con combinaciones de tintas únicas.
            </p>
          </div>

          <div className="space-y-12">
            {Object.entries(
              decks.reduce((acc, deck) => {
                if (!acc[deck.set]) acc[deck.set] = [];
                acc[deck.set].push(deck);
                return acc;
              }, {} as Record<string, StarterDeck[]>)
            ).map(([setName, setDecks]) => (
              <div key={setName} className="rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/40 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[var(--ink)]" style={{ fontFamily: "var(--font-title)" }}>
                    {setName}
                  </h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {setDecks.map((deck) => (
                    <Link key={deck.id} href={`/guias-mazos/${deck.id}`}>
                      <div className="group relative rounded-xl border border-[var(--stroke-strong)] bg-[var(--panel)]/60 p-4 transition-all hover:border-[var(--accent)] cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="relative w-32 shrink-0">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg border-2 border-[var(--stroke-strong)] shadow-xl transition-transform group-hover:scale-105">
                              <Image
                                src={deck.cards[0]?.imageUrl || "/placeholder-card.png"}
                                alt={deck.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-1">
                              {deck.inks.map((ink) => (
                                <span key={ink} className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-[var(--stroke)] text-[var(--ink)]">
                                  {getInkSpanish(ink)}
                                </span>
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                              {deck.name}
                            </span>
                            <span className="text-xs text-[var(--muted)]">
                              {deck.profile}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--ink)] sm:text-3xl" style={{ fontFamily: "var(--font-title)" }}>
              Encuentra tu <span className="text-[var(--accent)]">Estilo</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
              Elige según tu forma de jugar. Cada perfil tiene fortalezas únicas.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {decks.map((deck) => (
                <Link key={deck.id} href={`/guias-mazos/${deck.id}`}>
                  <div className="group relative rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--panel)]/60 cursor-pointer h-full">
                    <div className="flex items-start gap-6 h-full">
                      <div className="relative w-48 shrink-0">
                        <div className="aspect-[3/4] overflow-hidden rounded-xl border-2 border-[var(--stroke-strong)] shadow-xl shadow-black/20">
                          <Image
                            src={deck.cards[0]?.imageUrl || "https://cards.lorcast.io/card/digital/large/crd_7295a54624614f55a8d469d9d6b2e502.avif?1716052430"}
                            alt={deck.profile}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-xl font-semibold text-[var(--ink)]" style={{ fontFamily: "var(--font-title)" }}>
                          {deck.profile}
                        </h3>
                        <div className="mt-2 flex gap-2">
                          {deck.inks.map((ink) => (
                            <span key={ink} className="rounded-full px-3 py-1 text-xs font-medium bg-[var(--stroke)] text-[var(--ink)]">
                              {getInkSpanish(ink)}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{deck.description}</p>
                        <span className="mt-auto text-sm text-[var(--accent)] font-medium group-hover:underline">
                          Ver mazo completo →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[var(--ink)] sm:text-3xl" style={{ fontFamily: "var(--font-title)" }}>
                Consejos para <span className="text-[var(--accent)]">Mejorar</span>
              </h2>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">
                Sácale el máximo partido a tu mazo de inicio con estos consejos básicos.
              </p>
              <ul className="mt-8 space-y-4">
                {tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-4 text-[var(--muted)]">
                    <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--stroke)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
                    </span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="relative mx-auto max-w-sm">
                <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-[var(--stroke-strong)] bg-[var(--panel)] shadow-2xl shadow-black/20">
                  <Image
                    src="https://cards.lorcast.io/card/digital/large/crd_a9c86e6316084d76a03b32be95977091.avif?1709690747"
                    alt="Hades"
                    width={320}
                    height={448}
                    className="w-full"
                    unoptimized
                  />
                </div>
                <div className="absolute -right-8 top-8 -z-10 h-full w-full rotate-6 overflow-hidden rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/50 opacity-70">
                  <Image
                    src="https://cards.lorcast.io/card/digital/large/crd_22373df684c0420ea90d2f8508ac096c.avif?1709690747"
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute -left-8 top-8 -z-20 h-full w-full -rotate-6 overflow-hidden rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/50 opacity-50">
                  <Image
                    src="https://cards.lorcast.io/card/digital/large/crd_35c968e4b25945e897940860221f9d51.avif?1709690747"
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}