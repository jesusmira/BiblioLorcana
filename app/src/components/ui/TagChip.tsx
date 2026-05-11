"use client";

import type { ReactNode } from "react";

interface TagChipProps {
  children: ReactNode;
}

export default function TagChip({ children }: TagChipProps) {
  return (
    <span className="inline-block rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-2 text-[0.75rem]">
      {children}
    </span>
  );
}
