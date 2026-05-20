"use client";

import { clsx } from "clsx";
import Image from "next/image";
import {
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { InkDot } from "@/components/lorcana";
import { CardWithHover } from "../../_components/CardWithHover";
import { DECK_FORMATS, DECK_STRATEGIES, DECK_TIERS } from "@/types";
import type { LorcanaCard } from "@/types";
import type {
  DeckCardWithDetails,
  DeckStats,
  DeckValidation,
} from "../_hooks/useDeckBuilder";

interface BuilderDeckPanelProps {
  deckName: string;
  setDeckName: (name: string) => void;
  deckDescription: string;
  setDeckDescription: (desc: string) => void;
  deckFormat: string;
  setDeckFormat: (format: string) => void;
  deckStrategy: string;
  setDeckStrategy: (strategy: string) => void;
  deckTier: string;
  setDeckTier: (tier: string) => void;
  cards: DeckCardWithDetails[];
  stats: DeckStats;
  validation: DeckValidation;
  addCardToDeck: (card: LorcanaCard) => void;
  removeCardFromDeck: (cardId: string) => void;
  removeAllFromDeck: (cardId: string) => void;
}

export default function BuilderDeckPanel({
  deckName,
  setDeckName,
  deckDescription,
  setDeckDescription,
  deckFormat,
  setDeckFormat,
  deckStrategy,
  setDeckStrategy,
  deckTier,
  setDeckTier,
  cards,
  stats,
  validation,
  addCardToDeck,
  removeCardFromDeck,
  removeAllFromDeck,
}: BuilderDeckPanelProps) {
  const inkColors = [
    stats.inkAmber > 0 ? "amber" : "",
    stats.inkAmethyst > 0 ? "amethyst" : "",
    stats.inkEmerald > 0 ? "emerald" : "",
    stats.inkRuby > 0 ? "ruby" : "",
    stats.inkSapphire > 0 ? "sapphire" : "",
    stats.inkSteel > 0 ? "steel" : "",
  ].filter(Boolean);

  return (
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
                <option key={f} value={f}>
                  {f}
                </option>
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
                <option key={s} value={s}>
                  {s}
                </option>
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
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {validation.warnings.length > 0 && (
          <div className="mb-4 rounded-lg bg-[var(--alert-surface)] p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--alert-ink)]">
              <ExclamationTriangleIcon className="h-4 w-4" />
              Validación del mazo
            </div>
            <ul className="mt-2 text-xs text-[var(--alert-ink)]">
              {validation.warnings.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-bold text-[var(--accent)]">
              {stats.totalCards} cartas
            </span>
            <span className="text-sm text-[var(--muted)]">
              {stats.uniqueCards} únicas
            </span>
          </div>
          <div className="flex items-center gap-1">
            {inkColors.map((ink) => (
              <InkDot key={ink} ink={ink} />
            ))}
          </div>
        </div>

        <div className="flex max-h-[400px] flex-col gap-2 overflow-auto mb-6 custom-scrollbar">
          {cards.length === 0 && (
            <p className="py-8 text-center text-[var(--muted)]">
              Añade cartas desde la búsqueda
            </p>
          )}
          {cards.map((card) => (
            <CardWithHover key={card.cardId} card={card.details}>
              <div className="flex items-center gap-3 rounded-lg border border-[var(--stroke)] bg-[var(--surface-soft)] p-3">
                {card.details?.image_uris?.digital?.small ? (
                  <Image
                    src={card.details?.image_uris?.digital?.small}
                    alt={card.name}
                    width={36}
                    height={48}
                    className="h-12 w-9 rounded object-cover shadow-sm"
                  />
                ) : (
                  <div className="h-12 w-9 rounded bg-[var(--surface)] border border-[var(--stroke)]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {card.details?.ink && (
                      <InkDot ink={card.details.ink.toLowerCase()} />
                    )}
                    <p className="truncate font-medium text-[var(--ink)] text-sm">
                      {card.name}
                    </p>
                  </div>
                  <p className="text-[0.65rem] text-[var(--muted)] truncate">
                    {card.details?.type} • Coste {card.details?.cost}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeCardFromDeck(card.cardId)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink)] shadow-sm hover:bg-[var(--surface-strong)] transition-colors"
                  >
                    <MinusIcon className="h-3 w-3" />
                  </button>
                  <span className="w-4 text-center text-sm font-bold text-[var(--ink)]">
                    {card.quantity}
                  </span>
                  <button
                    onClick={() => card.details && addCardToDeck(card.details)}
                    disabled={card.quantity >= 4}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink)] shadow-sm hover:bg-[var(--surface-strong)] disabled:opacity-30 transition-colors"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeAllFromDeck(card.cardId)}
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-[var(--alert-ink)] opacity-0 group-hover:opacity-100 hover:bg-[var(--alert-surface)] transition-all"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardWithHover>
          ))}
        </div>
      </div>
    </div>
  );
}
