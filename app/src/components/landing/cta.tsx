"use client";

import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative px-4 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--accent)]/30 bg-[var(--panel)]/60 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[var(--accent)]/20 blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-[100px]" />
          </div>

          <div className="relative px-6 py-20 text-center sm:px-12 lg:px-16 lg:py-28">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10">
                <SparklesIcon className="h-10 w-10 text-[var(--accent)]" />
              </div>

              <h2
                className="text-3xl font-bold tracking-wide text-[var(--ink)] sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-title)" }}
              >
                <span className="text-[var(--accent)]">
                  Únete a los coleccionistas del Reino
                </span>
              </h2>

              <p className="mt-8 text-lg leading-relaxed text-[var(--muted)]">
                Únete a miles de iluminadores que ya están optimizando sus mazos
                con tecnología de vanguardia. Es gratis, es en español, y está
                hecho para ti.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link href="/registro">
                  <Button className="grid grid-cols-[1fr_auto] items-center gap-2 px-8 py-3 text-base">
                    <span>Crear mi cuenta</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/galeria">
                  <Button
                    variant="ghost"
                    className="border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/50"
                  >
                    Explorar cartas
                  </Button>
                </Link>
              </div>

              <p className="mt-10 text-sm text-[var(--muted)]">
                Sin tarjeta de crédito · Siempre gratis · Datos 100% privados
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
