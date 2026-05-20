"use client";

import { formatDate } from "@/lib/";
import type { LorcanaSet } from "@/types/";

interface ActiveSetSummaryProps {
  selectedSetData: LorcanaSet | undefined;
  loadingSets: boolean;
  filteredCount: number;
}

export default function ActiveSetSummary({
  selectedSetData,
  loadingSets,
  filteredCount,
}: ActiveSetSummaryProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-left max-[720px]:justify-center">
      <div className="flex items-center gap-2 text-[0.85rem]">
        <span className="text-[0.7rem] uppercase tracking-[1.2px] text-[var(--muted)] select-none">
          Set activo:
        </span>
        <strong className="text-[var(--foreground)] font-semibold">
          {selectedSetData
            ? `${selectedSetData.name} (${selectedSetData.code})`
            : loadingSets
              ? "Cargando..."
              : "Sin set"}
        </strong>
      </div>

      <div className="flex items-center gap-2 text-[0.85rem]">
        <span className="text-[0.7rem] uppercase tracking-[1.2px] text-[var(--muted)] select-none">
          Lanzamiento:
        </span>
        <strong className="text-[var(--foreground)] font-semibold">
          {formatDate(selectedSetData?.released_at)}
        </strong>
      </div>

      <div className="flex items-center gap-2 text-[0.85rem]">
        <span className="text-[0.7rem] uppercase tracking-[1.2px] text-[var(--muted)] select-none">
          Resultados:
        </span>
        <strong className="text-[var(--foreground)] font-semibold">
          {filteredCount}
        </strong>
      </div>
    </div>
  );
}
