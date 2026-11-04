"use client";

import type { ReactElement } from "react";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import type { LorcanaCard } from "@/types/";

const TCGPLAYER_SEARCH_URL =
  "https://www.tcgplayer.com/search/lorcana/product?q=";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "USD",
});

const formatPrice = (value: string | number | null | undefined): string => {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  return typeof amount === "number" && Number.isFinite(amount)
    ? priceFormatter.format(amount)
    : "--";
};

const getPurchaseUrl = (card: LorcanaCard): string => {
  if (card.purchase_uris?.tcgplayer) {
    return card.purchase_uris.tcgplayer;
  }
  const query = [card.name, card.version].filter(Boolean).join(" ");
  return `${TCGPLAYER_SEARCH_URL}${encodeURIComponent(query)}`;
};

interface CardPricesProps {
  card: LorcanaCard;
}

export default function CardPrices({ card }: CardPricesProps): ReactElement {
  const hasPrices = Boolean(card.prices?.usd || card.prices?.usd_foil);
  const priceItems = [
    { label: "Normal", value: card.prices?.usd },
    { label: "Foil", value: card.prices?.usd_foil },
  ];

  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[var(--surface-soft)] px-3 py-2 text-[0.85rem] max-[600px]:flex-col">
      {hasPrices ? (
        <div className="flex gap-4">
          {priceItems.map((item) => (
            <span key={item.label} className="flex items-baseline gap-1.5">
              <span className="text-[var(--muted)]">{item.label}</span>
              <span className="font-bold text-[var(--ink)]">
                {formatPrice(item.value)}
              </span>
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[var(--muted)]">Sin precio disponible</span>
      )}
      <a
        href={getPurchaseUrl(card)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[var(--accent)] hover:underline"
      >
        {card.purchase_uris?.tcgplayer
          ? "Ver en TCGplayer"
          : "Buscar en TCGplayer"}
        <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
