"use client";

import { clsx } from "clsx";
import { type InkEntry } from "../data/guideData";

interface InkCardProps {
  ink: InkEntry;
}

export function InkCard({ ink }: InkCardProps) {
  return (
    <div className="group relative rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--panel)]/60">
      <div className="flex flex-col items-center text-center">
        <div
          className={clsx(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--stroke-strong)] bg-[var(--panel)]",
            ink.color,
          )}
        >
          <ink.icon className="h-6 w-6 text-[var(--ink)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--ink)]">{ink.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {ink.description}
        </p>
      </div>
    </div>
  );
}
