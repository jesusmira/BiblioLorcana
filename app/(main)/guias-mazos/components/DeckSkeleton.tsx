"use client";

export function DeckSkeleton() {
  return (
    <div className="space-y-12 animate-pulse mt-12">
      {/* Generamos dos grupos de tarjetas falsas para imitar el contenido */}
      {[1, 2].map((group) => (
        <div key={group}>
          {/* Skeleton del título del set */}
          <div className="mb-6 border-b border-[var(--stroke-strong)] pb-3">
            <div className="h-7 w-48 rounded-md bg-[var(--stroke)]" />
          </div>

          {/* Grid de Skeleton Cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="relative h-full rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/40 p-6"
              >
                <div className="flex h-full items-start gap-6">
                  {/* Imagen de cubierta */}
                  <div className="relative w-36 shrink-0">
                    <div className="aspect-[3/4] overflow-hidden rounded-xl border-2 border-[var(--stroke-strong)] bg-[var(--stroke)]" />
                  </div>

                  {/* Información de la tarjeta */}
                  <div className="flex w-full flex-col">
                    {/* Título de la tarjeta */}
                    <div className="h-6 w-3/4 rounded-md bg-[var(--stroke)]" />

                    {/* Tintas */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="h-6 w-16 rounded-full bg-[var(--stroke)]" />
                      <div className="h-6 w-16 rounded-full bg-[var(--stroke)]" />
                    </div>

                    {/* Descripción */}
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-full rounded-md bg-[var(--stroke)]" />
                      <div className="h-4 w-5/6 rounded-md bg-[var(--stroke)]" />
                      <div className="h-4 w-4/6 rounded-md bg-[var(--stroke)]" />
                    </div>

                    {/* Enlace */}
                    <div className="mt-auto pt-4">
                      <div className="h-4 w-32 rounded-md bg-[var(--stroke)]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
