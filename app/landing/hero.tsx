"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Button } from "../components";
import Image from "next/image";
import Link from "next/link";

const heroCards = [
  {
    id: "1-204",
    name: "Plasma Blaster",
    image: "https://cards.lorcast.io/card/digital/large/crd_22373df684c0420ea90d2f8508ac096c.avif?1709690747",
  },
  {
    id: "1-1",
    name: "Mickey Mouse",
    image: "https://cards.lorcast.io/card/digital/large/crd_7295a54624614f55a8d469d9d6b2e502.avif?1716052430",
  },
  {
    id: "1-87",
    name: "Megara",
    image: "https://cards.lorcast.io/card/digital/large/crd_769e68c4d309489fa1a27c2d237a7b2e.avif?1709690747",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-16 lg:px-8 lg:pt-40 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]" style={{ backgroundImage: "url('/images/lorcana-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/50 via-[var(--bg)]/80 to-[var(--bg)]" />
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-8 inline-block rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Acceso al Altar de Tinta
            </span>

            <h1 className="mb-4 text-4xl font-bold leading-[0.95] tracking-tight text-[var(--accent-strong)] md:text-5xl lg:mb-6 lg:text-6xl xl:text-7xl" style={{ fontFamily: "var(--font-title)", fontStyle: "italic" }}>
              El Archivo del Reino te espera.
            </h1>

            <p className="mb-6 max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg lg:mb-8 lg:text-xl" style={{ fontStyle: "italic" }}>
              La herramienta definitiva para coleccionistas de Lorcana. Gestiona tu inventario, construye mazos y traduce cartas con la precisión del Cronista Real.
            </p>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start lg:gap-4">
              <Link href="/galeria">
                <Button className="grid grid-cols-[1fr_auto] items-center gap-2 px-8 py-3 text-base">
                  <span>Empezar Crónica</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/registro">
                <Button className="grid grid-cols-[1fr_auto] items-center gap-2 px-8 py-3 text-base" variant="ghost">
                  <span>Crear mi cuenta</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative lg:hidden">
            <div className="relative mx-auto w-[252px]">
              <div className="relative z-30 overflow-hidden rounded-xl border-2 border-[var(--accent)]/50 shadow-xl">
                <Image
                  alt={heroCards[1].name}
                  src={heroCards[1].image}
                  width={252}
                  height={353}
                  className="w-full"
                  unoptimized
                />
              </div>
              <div className="absolute -right-3 top-3 -z-10 h-full w-full rotate-6 overflow-hidden rounded-xl border border-[var(--stroke)]/30 bg-[var(--panel)]/50 opacity-70">
                <Image
                  alt={heroCards[0].name}
                  src={heroCards[0].image}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -left-3 top-3 -z-20 h-full w-full -rotate-6 overflow-hidden rounded-xl border border-[var(--stroke)]/30 bg-[var(--panel)]/50 opacity-50">
                <Image
                  alt={heroCards[2].name}
                  src={heroCards[2].image}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="hidden relative lg:flex h-[525px] items-center justify-center perspective-[1000px] card-fan-container">
            <div className="absolute -inset-10 rounded-full bg-[var(--accent)]/5 blur-[120px] opacity-40" />

            <div className="card-fan-item absolute z-10 w-[304px] h-[420px] overflow-hidden rounded-xl border border-white/10 shadow-2xl" style={{ transform: "rotate(-12deg) translate-x(-80px)" }}>
              <Image
                alt={heroCards[0].name}
                src={heroCards[0].image}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="card-fan-item absolute z-30 w-[304px] h-[420px] overflow-hidden rounded-xl border border-[var(--accent)]/30 shadow-2xl scale-110" style={{ transform: "translateY(-20px)" }}>
              <Image
                alt={heroCards[1].name}
                src={heroCards[1].image}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="card-fan-item absolute z-20 w-[304px] h-[420px] overflow-hidden rounded-xl border border-white/10 shadow-2xl" style={{ transform: "rotate(12deg) translate-x(80px)" }}>
              <Image
                alt={heroCards[2].name}
                src={heroCards[2].image}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .card-fan-container:hover .card-fan-item:nth-child(2) {
            transform: rotate(-15deg) translateX(-60px) !important;
          }
          .card-fan-container:hover .card-fan-item:nth-child(3) {
            transform: rotate(-5deg) translateY(-20px) !important;
          }
          .card-fan-container:hover .card-fan-item:nth-child(4) {
            transform: rotate(10deg) translateX(60px) !important;
          }
        }
        .card-fan-item {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </section>
  );
}
