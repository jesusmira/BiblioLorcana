"use client";

import { clsx } from "clsx";

export function CardSkeleton() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border-2 border-[var(--stroke)]">
      <div className="aspect-[2/3] w-full animate-pulse bg-[var(--surface-soft)]" />
    </div>
  );
}
