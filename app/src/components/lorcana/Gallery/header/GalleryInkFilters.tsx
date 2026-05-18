"use client";

import { clsx } from "clsx";

interface GalleryInkFiltersProps {
  ink: string;
  onInkChange: (value: string) => void;
  inkValues: string[];
}

const inkChipBase =
  "rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-[14px] py-2 text-[0.9rem] transition duration-200 hover:border-[var(--muted)]";

export default function GalleryInkFilters({
  ink,
  onInkChange,
  inkValues,
}: GalleryInkFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2.5 max-[720px]:justify-center">
      {inkValues.map((value) => (
        <button
          key={value}
          className={clsx(
            inkChipBase,
            ink === value &&
              "border-[var(--accent)] bg-[var(--chip-active-bg)] ring-1 ring-[var(--accent)]",
          )}
          onClick={() => onInkChange(ink === value ? "" : value)}
          type="button"
        >
          {value}
        </button>
      ))}
    </div>
  );
}
