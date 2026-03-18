"use client";

import type { ReactNode } from "react";

interface TagChipProps {
  children: ReactNode;
}

export default function TagChip({ children }: TagChipProps) {
  return (
    <span className="rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-2.5 py-1 text-[0.75rem]">
      {children}
    </span>
  );
}
