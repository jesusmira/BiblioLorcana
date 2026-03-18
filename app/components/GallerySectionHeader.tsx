"use client";

interface InkLegendItem {
  label: string;
  color: string;
}

const inkLegend: InkLegendItem[] = [
  { label: "Amber", color: "#f1b463" },
  { label: "Amethyst", color: "#9b79c9" },
  { label: "Emerald", color: "#4fa96b" },
  { label: "Ruby", color: "#d85c57" },
  { label: "Sapphire", color: "#4c84c4" },
  { label: "Steel", color: "#8d9aa5" },
];

interface GallerySectionHeaderProps {
  visibleCount: number;
  totalCount: number;
}

export default function GallerySectionHeader({ visibleCount, totalCount }: GallerySectionHeaderProps) {
  const shownCount = Math.min(visibleCount, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 max-[720px]:justify-center max-[720px]:text-center">
      <div>
        <h2 className="font-[var(--font-title)] text-[1.7rem]">
          Galeria principal
        </h2>
        <p className="mt-1 text-[var(--muted)]">
          {shownCount} de {totalCount} cartas
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 text-[0.85rem] text-[var(--muted)] max-[720px]:justify-center">
        {inkLegend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
