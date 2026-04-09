"use client";

import {
  MagnifyingGlassIcon,
  CameraIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  BookOpenIcon,
  ArchiveBoxIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { LanguageIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const features = [
  {
    icon: MagnifyingGlassIcon,
    title: "Búsqueda inteligente",
    description: "Encuentra cualquier carta al instante por nombre, texto, tipo o rareza. Filtros avanzados para coleccionistas exigentes.",
  },
  {
    icon: CameraIcon,
    title: "Escanea con tu cámara",
    description: "Apunta tu cámara a cualquier carta y la identificamos automáticamente. Añádela a tu colección con un solo toque.",
  },
  {
    icon: LanguageIcon,
    title: "Traducción instantánea",
    description: "Cada carta tiene su traducción al español. Entiende todos los efectos y habilidades sin barreras de idioma.",
  },
  {
    icon: ClipboardIcon,
    title: "Creador de mazos",
    description: "Diseña, guarda y comparte tus mazos. Analiza estadísticas y optimiza tu estrategia con herramientas visuales.",
  },
  {
    icon: BookOpenIcon,
    title: "Guías y tutoriales",
    description: "Aprende a jugar con nuestras guías detalladas. Desde reglas básicas hasta estrategias avanzadas para torneos.",
  },
  {
    icon: ArchiveBoxIcon,
    title: "Gestión de Inventario",
    description: "Controla tu colección de cartas con nuestra herramienta de gestión de inventario. Añade, edita y elimina cartas de tu colección con facilidad.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-24 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--accent)]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--accent)]">Características</p>
          <h2 className="mt-4 text-3xl font-bold tracking-wide text-[var(--ink)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-title)" }}>
            <span className="text-[var(--accent)]">Todo lo que necesitas</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[var(--muted)]">
            Herramientas pensadas por y para coleccionistas de Lorcana de habla hispana.
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group relative rounded-2xl border border-[var(--stroke)]/30 bg-[var(--panel)]/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)]/40 hover:bg-[var(--panel)]/60">
              <div className="flex flex-col">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] transition-all group-hover:bg-[var(--accent)]/20 group-hover:border-[var(--accent)]/40">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--ink)]">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 grid items-center gap-16 lg:grid-cols-2">
          <div className="order-2">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--accent)]">Detalle mágico</p>
            <h3 className="mt-4 text-2xl font-bold text-[var(--ink)] sm:text-3xl lg:text-4xl" style={{ fontFamily: "var(--font-title)" }}>
              Explora cada carta con detalle
            </h3>
            <p className="mt-6 leading-relaxed text-[var(--muted)]">
              Accede a información completa de cada carta: estadísticas, rareza, edición, etc... Con imágenes en alta resolución y datos actualizados constantemente.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Búsqueda avanzada por nombre, texto, tipo o rareza",
                "Identificación automática con tu cámara",
                "Traducción instantánea al español",
                "Creador de mazos con estadísticas visuales"
              ].map((item) => (
                <li key={item} className="flex items-center gap-4 text-[var(--muted)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/20">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1">
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              <div className="relative z-10 overflow-hidden rounded-2xl border border-[var(--accent)]/30 bg-[var(--panel)] shadow-2xl shadow-[var(--accent)]/20">
                <Image src="https://cards.lorcast.io/card/digital/large/crd_a9c86e6316084d76a03b32be95977091.avif?1709690747" alt="Hades" width={400} height={560} className="w-full" unoptimized />
              </div>
              <div className="absolute -right-10 top-10 -z-10 h-full w-full rotate-6 overflow-hidden rounded-2xl border border-[var(--stroke)]/30 bg-[var(--panel)]/50 opacity-70">
                <Image src="https://cards.lorcast.io/card/digital/large/crd_22373df684c0420ea90d2f8508ac096c.avif?1709690747" alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="absolute -left-10 top-10 -z-20 h-full w-full -rotate-6 overflow-hidden rounded-2xl border border-[var(--stroke)]/30 bg-[var(--panel)]/50 opacity-50">
                <Image src="https://cards.lorcast.io/card/digital/large/crd_35c968e4b25945e897940860221f9d51.avif?1709690747" alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="absolute -bottom-10 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full bg-[var(--accent)]/30 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
