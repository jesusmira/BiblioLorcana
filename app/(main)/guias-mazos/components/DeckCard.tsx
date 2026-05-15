"use client";

import Image from "next/image";
import Link from "next/link";
import { FALLBACK_CARD_IMAGE, getInkSpanish } from "../data/guideData";
import { type StarterDeck } from "@/types/guide";

interface DeckCardProps {
  deck: StarterDeck;
}

export function DeckCard({ deck }: DeckCardProps) {
  const coverImage = deck.cards[0]?.imageUrl ?? FALLBACK_CARD_IMAGE;

  return (
    <Link href={`/guias-mazos/${deck.id}`}>
      <div className="group relative rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--panel)]/60 cursor-pointer h-full">
        <div className="flex items-start gap-6 h-full">
          <div className="relative w-36 shrink-0">
            <div className="aspect-[3/4] overflow-hidden rounded-xl border-2 border-[var(--stroke-strong)] shadow-xl shadow-black/20">
              <Image
                src={coverImage}
                alt={deck.profile}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h4
              className="text-lg font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-title)" }}
            >
              {deck.profile}
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {deck.inks.map((ink) => (
                <span
                  key={ink}
                  className="rounded-full px-3 py-1 text-xs font-medium bg-[var(--stroke)] text-[var(--ink)]"
                >
                  {getInkSpanish(ink)}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {deck.description}
            </p>
            <span className="mt-auto pt-3 text-sm text-[var(--accent)] font-medium group-hover:underline">
              Ver mazo completo →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
