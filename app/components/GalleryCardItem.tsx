"use client";

import type { KeyboardEvent } from "react";
import CardArtwork from "./CardArtwork";
import StatGrid from "./StatGrid";
import TagChip from "./TagChip";
import { getTypes, normalizeInk, normalizeLabel } from "../lib";
import type { LorcanaCard } from "../types";

const inkClassMap: Record<string, string> = {
  Amber: "bg-[rgba(241,180,99,0.2)] text-[#8d5a12]",
  Amethyst: "bg-[rgba(155,121,201,0.2)] text-[#6f4aa4]",
  Emerald: "bg-[rgba(79,169,107,0.2)] text-[#2f7f4b]",
  Ruby: "bg-[rgba(216,92,87,0.2)] text-[#a53f3b]",
  Sapphire: "bg-[rgba(76,132,196,0.2)] text-[#2f67a6]",
  Steel: "bg-[rgba(141,154,165,0.2)] text-[#4f5b64]",
  "Sin tinta": "bg-[rgba(245,239,231,0.12)] text-[var(--muted)]",
};

const getImage = (card: LorcanaCard): string =>
  card.image_uris?.digital?.normal ||
  card.image_uris?.digital?.large ||
  card.image_uris?.digital?.small ||
  "";

interface GalleryCardItemProps {
  card: LorcanaCard;
  onOpen: (card: LorcanaCard) => void;
  cardBaseClass: string;
}

export default function GalleryCardItem({
  card,
  onOpen,
  cardBaseClass,
}: GalleryCardItemProps) {
  const cardInk = normalizeInk(card.ink);
  const image = getImage(card);
  const types = getTypes(card);
  const cardName = card.name ?? "Sin nombre";
  const ariaName = card.name ?? "esta carta";
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(card);
    }
  };

  return (
    <article
      className={`${cardBaseClass} cursor-pointer`}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${ariaName}`}
      onClick={() => onOpen(card)}
      onKeyDown={handleKeyDown}
    >
      <CardArtwork
        image={image}
        alt={cardName}
        loading="lazy"
        wrapperClassName="grid aspect-[2/3] place-items-center rounded-[16px] bg-[var(--surface-soft)] p-2.5"
        imageClassName="h-full w-full rounded-[12px] object-contain"
      />
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[1px] ${
            inkClassMap[cardInk] || ""
          }`}
        >
          {cardInk}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--cost-bg)] text-[var(--cost-ink)] font-bold">
          {card.cost ?? 0}
        </span>
      </div>
      <h3 className="font-[var(--font-title)] text-[1.1rem]">
        {cardName}
        {card.version ? `, ${card.version}` : ""}
      </h3>
      <div className="flex flex-col gap-2.5">
        <p className="min-h-[4.5rem] overflow-hidden text-[var(--muted)] leading-[1.5] [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] whitespace-pre-line">
          {card.text ?? ""}
        </p>
        {card.flavor_text ? (
          <>
            <span
              className="h-px w-full bg-current text-[var(--muted)]"
              aria-hidden="true"
            ></span>
            <p className="overflow-hidden text-[var(--muted)] italic [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] whitespace-pre-line">
              {card.flavor_text}
            </p>
          </>
        ) : null}
      </div>
      <div className="mt-auto flex flex-col gap-2.5">
        <StatGrid card={card} />
        <div className="flex flex-wrap gap-2 max-[720px]:justify-center">
          {types.slice(0, 2).map((item) => (
            <TagChip key={item}>{item}</TagChip>
          ))}
          <TagChip>{normalizeLabel(card.rarity)}</TagChip>
        </div>
      </div>
    </article>
  );
}
