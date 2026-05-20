"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { INK_LABELS, INK_COLORS } from "@/lib/constants";

interface GalleryInkFiltersProps {
  ink: string;
  onInkChange: (value: string) => void;
  inkValues: string[];
}

const inkChipBase =
  "group relative flex h-14 w-14 shrink-0 items-center justify-center bg-transparent border-0 outline-none transition-all duration-200 cursor-pointer focus:outline-none";

export default function GalleryInkFilters({
  ink,
  onInkChange,
  inkValues,
}: GalleryInkFiltersProps) {
  const isAnySelected = !!ink;
  const isAllSelected = !ink;

  // Procesar todas las tintas (oficiales y "Sin tinta")
  // Ordenamos para que las oficiales vayan primero y "Sin tinta" al final
  const sortedInks = [...inkValues].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aIsKnown = aLower in INK_LABELS;
    const bIsKnown = bLower in INK_LABELS;
    if (aIsKnown && !bIsKnown) return -1;
    if (!aIsKnown && bIsKnown) return 1;
    return a.localeCompare(b);
  });

  // Clases de opacidad para el botón "Todas las tintas" (símbolo de Lorcana)
  const allOpacityClass = isAllSelected
    ? "opacity-100 scale-120"
    : isAnySelected
      ? "opacity-35 hover:opacity-95 hover:scale-110"
      : "opacity-85 hover:opacity-100 hover:scale-110";

  // Brillo dorado suave para el símbolo de Lorcana cuando está activo
  const allGlowStyle = isAllSelected
    ? { filter: "drop-shadow(0 0 8px #ffd700)" }
    : undefined;

  return (
    <div className="flex flex-wrap gap-3 max-[720px]:justify-center items-center py-2">
      {/* Botón de "Todas las tintas" (símbolo de Lorcana) */}
      <button
        className={clsx(inkChipBase, allOpacityClass)}
        onClick={() => onInkChange("")}
        type="button"
        aria-label="Mostrar todas las tintas"
        style={allGlowStyle}
      >
        <span className="relative flex h-11 w-10 shrink-0 items-center justify-center">
          <Image
            src="/images/Lorcana_Symbol_B&W.png"
            alt="Todas las tintas"
            width={40}
            height={45}
            className="object-contain select-none brightness-0 invert"
            loading="lazy"
          />
        </span>
        
        {/* Tooltip estilizado */}
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-90 rounded-md bg-[var(--surface-strong)] border border-[var(--stroke)] px-2.5 py-1 text-xs text-[var(--foreground)] opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap z-20 shadow-md">
          Todas las tintas
        </span>
      </button>

      {/* Tintas individuales (incluyendo "Sin tinta") */}
      {sortedInks.map((value) => {
        const lowerValue = value.toLowerCase();
        const label = INK_LABELS[lowerValue] || value;
        const isKnownInk = lowerValue in INK_LABELS;
        const imagePath = isKnownInk ? `/images/inks/${lowerValue}.png` : null;
        const isSelected = ink === value;

        // Efecto de opacidad:
        // Si hay una tinta seleccionada, atenuamos las demás.
        // Si no hay ninguna seleccionada, mostramos todas con buena opacidad.
        const opacityClass = isSelected
          ? "opacity-100 scale-120"
          : isAnySelected
            ? "opacity-35 hover:opacity-95 hover:scale-110"
            : "opacity-85 hover:opacity-100 hover:scale-110";

        // Brillo exterior (glow) del color de la tinta cuando está seleccionada
        const inkColor = INK_COLORS[lowerValue];
        const glowStyle = isSelected
          ? inkColor
            ? { filter: `drop-shadow(0 0 10px ${inkColor})` }
            : { filter: "drop-shadow(0 0 8px #9ca3af)" } // Glow gris para "Sin tinta"
          : undefined;

        return (
          <button
            key={value}
            className={clsx(inkChipBase, opacityClass)}
            onClick={() => onInkChange(ink === value ? "" : value)}
            type="button"
            aria-label={`Filtrar por tinta ${label}`}
            style={glowStyle}
          >
            {imagePath ? (
              <span className="relative flex h-11 w-10 shrink-0 items-center justify-center">
                <Image
                  src={imagePath}
                  alt={`Tinta ${label}`}
                  width={40}
                  height={45}
                  className="object-contain select-none"
                  loading="lazy"
                />
              </span>
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-[var(--stroke)] text-[1rem] text-[var(--muted)] transition-colors duration-200 group-hover:border-[var(--muted)] group-hover:text-[var(--foreground)]">
                ✕
              </span>
            )}
            
            {/* Tooltip estilizado */}
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-90 rounded-md bg-[var(--surface-strong)] border border-[var(--stroke)] px-2.5 py-1 text-xs text-[var(--foreground)] opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap z-20 shadow-md">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
