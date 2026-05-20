"use client";

import Image from "next/image";
import { type InkEntry } from "../data/guideData";

interface InkCardProps {
  ink: InkEntry;
}

const INK_IMAGE_MAP: Record<string, string> = {
  "ámbar": "amber",
  "amatista": "amethyst",
  "esmeralda": "emerald",
  "rubí": "ruby",
  "zafiro": "sapphire",
  "acero": "steel",
};

export function InkCard({ ink }: InkCardProps) {
  const inkKey = INK_IMAGE_MAP[ink.name.toLowerCase()] || ink.name.toLowerCase();
  const imageSrc = `/images/inks/${inkKey}.png`;

  return (
    <div className="group relative rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--panel)]/60">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center">
          <Image
            src={imageSrc}
            alt={`Tinta ${ink.name}`}
            width={48}
            height={54}
            className="object-contain select-none transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <h3 className="text-lg font-semibold text-[var(--ink)]">{ink.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var-[--muted]]">
          {ink.description}
        </p>
      </div>
    </div>
  );
}
