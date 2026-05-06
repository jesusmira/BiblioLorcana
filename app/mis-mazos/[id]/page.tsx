"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useDecksStore } from "../../store";
import { useAuth } from "../../lib/auth";
import { searchCardsWithFiltersAction, fetchSetsAction } from "../../actions";
import { enrichDeckCardsAction, saveDeckAction } from "../../actions/dbDeckActions";
import type { LorcanaCard, DeckCardEntry, UserDeck, LorcanaSet } from "../../types";
import { DECK_FORMATS, DECK_STRATEGIES, DECK_TIERS } from "../../types";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ShareIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { InkDot, ManaCurve, InkBreakdown } from "../../_shared/_components";
import { spinner } from "../../lib/styles";
import { DeckSearchFilters } from "../_components/DeckSearchFilters";
import { CardSearchResults } from "../_components/CardSearchResults";
import { CardWithHover } from "../_components/CardWithHover";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface DeckCardWithDetails extends DeckCardEntry {
  details?: LorcanaCard;
}

interface DeckValidation {
  isValid: boolean;
  warnings: string[];
}

interface DeckStats {
  totalCards: number;
  uniqueCards: number;
  averageCost: number;
  characters: number;
  actions: number;
  items: number;
  locations: number;
  inkAmber: number;
  inkAmethyst: number;
  inkEmerald: number;
  inkRuby: number;
  inkSapphire: number;
  inkSteel: number;
}

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;
  const isNewDeck = deckId === "crear";

  const { user } = useAuth();
  const { getDeck, addDeck, updateDeck } = useDecksStore();

  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckFormat, setDeckFormat] = useState("");
  const [deckStrategy, setDeckStrategy] = useState("");
  const [deckTier, setDeckTier] = useState("");
  const [cards, setCards] = useState<DeckCardWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LorcanaCard[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showInkWarning, setShowInkWarning] = useState(false);
  const [sets, setSets] = useState<LorcanaSet[]>([]);

  const [filters, setFilters] = useState({
    ink: "",
    type: "",
    rarity: "",
    setCode: "",
  });

  const hasEnriched = useRef(false);

  useEffect(() => {
    if (!isNewDeck && !hasEnriched.current) {
      const existingDeck = getDeck(deckId);
      if (existingDeck) {
        hasEnriched.current = true;
        setDeckName(existingDeck.name);
        setDeckDescription(existingDeck.description);
        setDeckFormat(existingDeck.format || "");
        setDeckStrategy(existingDeck.strategy || "");
        setDeckTier(existingDeck.tier || "");
        
        // Initial set of cards without details
        const initialCards = existingDeck.cards.map((c) => ({ ...c, details: undefined }));
        setCards(initialCards);

        // Fetch details for all cards in one go
        (async () => {
          try {
            const { enrichedCards } = await enrichDeckCardsAction(existingDeck.cards);
            setCards(enrichedCards as any);
          } catch (error) {
            console.error("Error enrichment:", error);
            hasEnriched.current = false; // allow retry if failed
          }
        })();
      }
    }
  }, [deckId, isNewDeck, getDeck]);

  useEffect(() => {
    (async () => {
      try {
        const allSets = await fetchSetsAction();
        setSets(allSets);
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleSearch = useCallback(async () => {
    // Necesita al menos 2 caracteres para buscar
    if (searchQuery.trim().length < 2 && !filters.ink && !filters.type && !filters.rarity && !filters.setCode) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCardsWithFiltersAction(searchQuery, {
        ink: filters.ink || undefined,
        type: filters.type || undefined,
        rarity: filters.rarity || undefined,
        setCode: filters.setCode || undefined,
      });
      setSearchResults(results.slice(0, 50));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [handleSearch]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ ink: "", type: "", rarity: "", setCode: "" });
  }, []);

  const addCardToDeck = useCallback((card: LorcanaCard) => {
    setCards((prev) => {
      const existing = prev.find((c) => c.cardId === String(card.id));
      if (existing) {
        if (existing.quantity >= 4) return prev;
        return prev.map((c) =>
          c.cardId === String(card.id)
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      // Check ink colors
      const currentInks = new Set<string>();
      prev.forEach(c => {
        if (c.details?.ink) currentInks.add(c.details.ink.toLowerCase());
      });

      if (card.ink) {
        const newInk = card.ink.toLowerCase();
        if (!currentInks.has(newInk) && currentInks.size >= 2) {
          setShowInkWarning(true);
          return prev;
        }
      }

      return [
        ...prev,
        {
          cardId: String(card.id),
          name: card.name || "Unknown",
          quantity: 1,
          details: card,
        },
      ];
    });
  }, []);

  const updateCardQuantity = useCallback((cardId: string, delta: number) => {
    setCards((prev) =>
      prev
        .map((c) => {
          if (c.cardId === cardId) {
            const newQty = c.quantity + delta;
            if (newQty < 1) return null;
            if (newQty > 4) return c;
            return { ...c, quantity: newQty };
          }
          return c;
        })
        .filter((c): c is DeckCardWithDetails => c !== null)
    );
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));
  }, []);

  const handleSave = useCallback(async () => {
    if (!deckName.trim() || cards.length === 0) {
      return;
    }

    // Validación de tintas: máximo 2
    const currentInks = new Set<string>();
    cards.forEach(c => {
      if (c.details?.ink) currentInks.add(c.details.ink.toLowerCase());
    });

    if (currentInks.size > 2) {
      setShowInkWarning(true);
      return;
    }

    setIsSaving(true);

    const deckData: any = {
      id: deckId,
      name: deckName.trim(),
      description: deckDescription.trim(),
      format: deckFormat || undefined,
      strategy: deckStrategy || undefined,
      tier: deckTier || undefined,
      inkColors: Array.from(currentInks),
      cards: cards.map((c) => ({
        cardId: c.cardId,
        name: c.name,
        quantity: c.quantity,
      })),
    };

    try {
      if (user) {
        const saved = await saveDeckAction(deckData);
        // Actualizamos el store local para reflejar el ID real de la DB si era nuevo
        if (isNewDeck) {
          addDeck(saved);
        } else {
          updateDeck(deckId, saved);
        }
      } else {
        if (isNewDeck) {
          addDeck(deckData);
        } else {
          updateDeck(deckId, deckData);
        }
      }
      router.push("/mis-mazos");
    } catch (error) {
      console.error("Error al guardar mazo:", error);
    } finally {
      setIsSaving(false);
    }
  }, [deckName, deckDescription, deckFormat, deckStrategy, deckTier, cards, isNewDeck, addDeck, updateDeck, deckId, router, user]);

  const totalCards = useMemo(
    () => cards.reduce((acc, c) => acc + c.quantity, 0),
    [cards]
  );

  const stats = useMemo((): DeckStats => {
    const total = cards.reduce((acc, c) => acc + c.quantity, 0);
    const costSum = cards.reduce((acc, c) => acc + ((c.details?.cost ?? 0) * c.quantity), 0);
    
    let characters = 0, actions = 0, items = 0, locations = 0;
    let inkAmber = 0, inkAmethyst = 0, inkEmerald = 0, inkRuby = 0, inkSapphire = 0, inkSteel = 0;
    
    cards.forEach(c => {
      const types = c.details?.type || [];
      if (types.includes("Character")) characters += c.quantity;
      if (types.includes("Action")) actions += c.quantity;
      if (types.includes("Item")) items += c.quantity;
      if (types.includes("Location")) locations += c.quantity;
      
      const ink = c.details?.ink?.toLowerCase();
      if (ink === "amber") inkAmber += c.quantity;
      else if (ink === "amethyst") inkAmethyst += c.quantity;
      else if (ink === "emerald") inkEmerald += c.quantity;
      else if (ink === "ruby") inkRuby += c.quantity;
      else if (ink === "sapphire") inkSapphire += c.quantity;
      else if (ink === "steel") inkSteel += c.quantity;
    });

    return {
      totalCards: total,
      uniqueCards: cards.length,
      averageCost: total > 0 ? costSum / total : 0,
      characters,
      actions,
      items,
      locations,
      inkAmber,
      inkAmethyst,
      inkEmerald,
      inkRuby,
      inkSapphire,
      inkSteel,
    };
  }, [cards]);

  const validation = useMemo((): DeckValidation => {
    const warnings: string[] = [];
    
    if (totalCards < 60) {
      warnings.push(`El mazo tiene ${totalCards} cartas (mínimo recomendado: 60)`);
    }
    
    if (totalCards > 60) {
      warnings.push(`El mazo tiene ${totalCards} cartas (máximo: 60)`);
    }
    
    const duplicateIssues = cards.filter(c => c.quantity > 4);
    if (duplicateIssues.length > 0) {
      warnings.push(`${duplicateIssues.length} carta(s) exceden el límite de 4 copias`);
    }
    
    const inkCounts = stats.inkAmber + stats.inkAmethyst + stats.inkEmerald + 
                      stats.inkRuby + stats.inkSapphire + stats.inkSteel;
    if (inkCounts === 0) {
      warnings.push("No se han detectado tintas en el mazo");
    }
    
    if (inkCounts > 0 && inkCounts < 3) {
      warnings.push("El mazo tiene pocas cartas con coste de tinta");
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }, [cards, totalCards, stats]);


  const uniqueCards = cards.length;

  const inkColors = useMemo(() => {
    const colors = new Set<string>();
    cards.forEach((c) => {
      if (c.details?.ink) {
        colors.add(c.details.ink.toLowerCase());
      }
    });
    return Array.from(colors);
  }, [cards]);

  const cardQuantities = useMemo(() => {
    const quantities: Record<string, number> = {};
    cards.forEach((c) => {
      quantities[c.cardId] = c.quantity;
    });
    return quantities;
  }, [cards]);

  const textExport = `Mazo: ${deckName}
${deckDescription ? `Descripción: ${deckDescription}` : ""}
${deckFormat ? `Formato: ${deckFormat}` : ""}
${deckStrategy ? `Estrategia: ${deckStrategy}` : ""}
${deckTier ? `Tier: ${deckTier}` : ""}
${cards
  .filter((c) => c.quantity > 0)
  .map((c) => `${c.quantity}x ${c.name}`)
  .join("\n")}
---
Total: ${totalCards} cartas`;

  const jsonExport = JSON.stringify({
    name: deckName,
    description: deckDescription,
    format: deckFormat || undefined,
    strategy: deckStrategy || undefined,
    tier: deckTier || undefined,
    cards: cards.filter((c) => c.quantity > 0).map((c) => ({
      cardId: c.cardId,
      name: c.name,
      quantity: c.quantity,
    })),
    totalCards,
    uniqueCards,
    createdAt: new Date().toISOString(),
  }, null, 2);

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-[1400px] font-[var(--font-sans)]">
      <div className="mb-8 flex flex-col gap-4">
        <Link
          href="/mis-mazos"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a mis mazos
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="font-[var(--font-title)] text-4xl text-[var(--ink)]">
            {isNewDeck ? "Crear nuevo mazo" : "Editar mazo"}
          </h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px_300px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
            <h2 className="mb-4 font-[var(--font-title)] text-xl text-[var(--ink)]">
              Buscar cartas
            </h2>
            
            <div className="relative mb-3">
              <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--muted)]">
                <MagnifyingGlassIcon className="h-[18px] w-[18px]" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre (mín. 2 caracteres)..."
                className="h-[52px] w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-[14px] pl-10 pr-10 text-base text-[var(--ink)]"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                </div>
              )}
            </div>

            <div className="mb-4">
              <DeckSearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                sets={sets}
              />
            </div>

            <div className="flex max-h-[500px] flex-col overflow-auto">
              <CardSearchResults
                cards={searchResults}
                isLoading={isSearching}
                cardQuantities={cardQuantities}
                onCardSelect={addCardToDeck}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[var(--ink)]">
                Nombre del mazo
              </label>
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Mi nuevo mazo"
                className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-4 py-2 text-[var(--ink)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[var(--ink)]">
                Descripción (opcional)
              </label>
              <textarea
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                placeholder="Estrategia o notas sobre el mazo..."
                className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-4 py-2 text-[var(--ink)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                rows={2}
              />
            </div>

            <div className="mb-4 grid grid-cols-3 gap-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-[var(--muted)]">
                  Formato
                </label>
                <select
                  value={deckFormat}
                  onChange={(e) => setDeckFormat(e.target.value)}
                  className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)]"
                >
                  <option value="">Seleccionar</option>
                  {DECK_FORMATS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[var(--muted)]">
                  Estrategia
                </label>
                <select
                  value={deckStrategy}
                  onChange={(e) => setDeckStrategy(e.target.value)}
                  className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)]"
                >
                  <option value="">Seleccionar</option>
                  {DECK_STRATEGIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[var(--muted)]">
                  Tier
                </label>
                <select
                  value={deckTier}
                  onChange={(e) => setDeckTier(e.target.value)}
                  className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--ink)]"
                >
                  <option value="">Seleccionar</option>
                  {DECK_TIERS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>


            {validation.warnings.length > 0 && (
              <div className="mb-4 rounded-lg bg-[var(--alert)]/10 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--alert)]">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  Validación del mazo
                </div>
                <ul className="mt-2 text-xs text-[var(--alert)]">
                  {validation.warnings.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-bold text-[var(--accent)]">
                  {totalCards} cartas
                </span>
                <span className="text-sm text-[var(--muted)]">
                  {uniqueCards} únicas
                </span>
              </div>
              <div className="flex items-center gap-1">
                {inkColors.map((ink) => (
                  <InkDot key={ink} ink={ink} />
                ))}
              </div>
            </div>

            <div className="flex max-h-[400px] flex-col gap-2 overflow-auto mb-6">
              {cards.length === 0 && (
                <p className="py-8 text-center text-[var(--muted)]">
                  Añade cartas desde la búsqueda
                </p>
              )}
              {cards.map((card) => (
                <CardWithHover key={card.cardId} card={card.details}>
                  <div className="flex items-center gap-3 rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] p-3">
                    {card.details?.image_uris?.digital?.small ? (
                      <img
                        src={card.details?.image_uris?.digital?.small}
                        alt={card.name}
                        className="h-12 w-9 rounded object-cover shadow-sm"
                      />
                    ) : (
                      <div className="h-12 w-9 rounded bg-[var(--surface)] border border-[var(--stroke)]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {card.details?.ink && <InkDot ink={card.details.ink.toLowerCase()} />}
                        <p className="truncate font-medium text-[var(--ink)] text-sm">
                          {card.name}
                        </p>
                      </div>
                      <p className="text-[0.65rem] text-[var(--muted)] truncate">
                        {card.details?.type?.[0] || "Carta"} • {card.details?.rarity || "Común"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCardQuantity(card.cardId, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-5 text-center font-bold text-[var(--ink)] text-sm tabular-nums">
                        {card.quantity}
                      </span>
                      <button
                        onClick={() => updateCardQuantity(card.cardId, 1)}
                        disabled={card.quantity >= 4}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeCard(card.cardId)}
                        className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-[var(--muted)] transition hover:text-red-500"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardWithHover>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              <button
                onClick={handleSave}
                disabled={!deckName.trim() || cards.length === 0 || isSaving}
                className="flex-1 rounded-full bg-[var(--accent)] px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50 shadow-lg shadow-[var(--accent)]/20"
              >
                {isSaving ? "Guardando..." : "Guardar mazo"}
              </button>
              <button
                onClick={() => setShowExport(true)}
                disabled={cards.length === 0}
                className="flex items-center gap-2 rounded-full border border-[var(--stroke)] px-6 py-3 font-bold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              Curva de Maná
            </h3>
            <ManaCurve 
              cards={cards.map(c => ({ 
                cost: c.details?.cost ?? null, 
                quantity: c.quantity 
              }))} 
            />
          </div>

          <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              Distribución de Tinta
            </h3>
            <InkBreakdown 
              cards={cards.map(c => ({ 
                ink: c.details?.ink ?? null, 
                quantity: c.quantity 
              }))} 
            />
          </div>

          <div className="rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              Estadísticas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--surface-soft)] p-3 text-center">
                <div className="text-xl font-bold text-[var(--ink)]">{stats.totalCards}</div>
                <div className="text-[0.65rem] text-[var(--muted)] uppercase">Total</div>
              </div>
              <div className="rounded-xl bg-[var(--surface-soft)] p-3 text-center">
                <div className="text-xl font-bold text-[var(--ink)]">{stats.averageCost.toFixed(1)}</div>
                <div className="text-[0.65rem] text-[var(--muted)] uppercase">Coste Medio</div>
              </div>
              <div className="rounded-xl bg-[var(--surface-soft)] p-3 text-center">
                <div className="text-xl font-bold text-[var(--ink)]">{stats.characters}</div>
                <div className="text-[0.65rem] text-[var(--muted)] uppercase">Personajes</div>
              </div>
              <div className="rounded-xl bg-[var(--surface-soft)] p-3 text-center">
                <div className="text-xl font-bold text-[var(--ink)]">{stats.actions + stats.items + stats.locations}</div>
                <div className="text-[0.65rem] text-[var(--muted)] uppercase">Otros</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Advertencia de Tintas */}
      <Transition show={showInkWarning} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setShowInkWarning(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-2xl transition-all">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-amber-100 p-3">
                      <ExclamationTriangleIcon className="h-8 w-8 text-amber-600" />
                    </div>
                    <Dialog.Title as="h3" className="mb-2 text-xl font-bold text-[var(--ink)]">
                      Límite de tintas excedido
                    </Dialog.Title>
                    <p className="mb-6 text-[var(--muted)]">
                      Un mazo legal de Lorcana solo puede tener hasta 2 colores de tinta. 
                      No puedes añadir cartas de un tercer color.
                    </p>
                    <button
                      onClick={() => setShowInkWarning(false)}
                      className="w-full rounded-full bg-[var(--accent)] py-3 font-bold text-white transition hover:opacity-90"
                    >
                      Entendido, voy a corregirlo
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowExport(false)}
          />
          <div className="relative w-full max-w-lg rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-2xl max-h-[80vh] overflow-auto">
            <h2 className="mb-4 font-[var(--font-title)] text-xl text-[var(--ink)]">
              Exportar mazo
            </h2>
            
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--ink)]">Texto plano (para foros)</span>
                <button
                  onClick={() => navigator.clipboard.writeText(textExport)}
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  Copiar
                </button>
              </div>
              <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-soft)] p-3 text-xs text-[var(--ink)] whitespace-pre-wrap">
                {textExport}
              </pre>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--ink)]">JSON (backup/importar)</span>
                <button
                  onClick={() => navigator.clipboard.writeText(jsonExport)}
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  Copiar
                </button>
              </div>
              <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-soft)] p-3 text-xs text-[var(--ink)] whitespace-pre-wrap">
                {jsonExport}
              </pre>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExport(false)}
                className="flex-1 rounded-full border border-[var(--stroke)] py-2.5 font-bold text-[var(--ink)]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}