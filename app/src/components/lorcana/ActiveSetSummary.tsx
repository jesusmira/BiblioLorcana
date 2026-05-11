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
    <div className="grid gap-4 rounded-[14px] border border-[var(--stroke)] bg-[var(--surface-strong)] p-4 text-left [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] max-[600px]:grid-cols-1 max-[720px]:text-center">
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.72rem] uppercase tracking-[1.5px] text-[var(--muted)]">
          Set activo
        </span>
        <strong>
          {selectedSetData
            ? `${selectedSetData.name} (${selectedSetData.code})`
            : loadingSets
              ? "Cargando..."
              : "Sin set"}
        </strong>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.72rem] uppercase tracking-[1.5px] text-[var(--muted)]">
          Lanzamiento
        </span>
        <strong>{formatDate(selectedSetData?.released_at)}</strong>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.72rem] uppercase tracking-[1.5px] text-[var(--muted)]">
          Resultados
        </span>
        <strong>{filteredCount}</strong>
      </div>
    </div>
  );
}
