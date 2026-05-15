"use client";

import Image from "next/image";
import { TIPS } from "../data/guideData";

export function TipsSection() {
  return (
    <div className="mt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2
            className="text-2xl font-bold text-[var(--ink)] sm:text-3xl"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Consejos para <span className="text-[var(--accent)]">Mejorar</span>
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Sácale el máximo partido a tu mazo de inicio con estos consejos básicos.
          </p>
          <ul className="mt-8 space-y-4">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-4 text-[var(--muted)]">
                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--stroke)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
                </span>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-sm">
            <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-[var(--stroke-strong)] bg-[var(--panel)] shadow-2xl shadow-black/20">
              <Image
                src="https://cards.lorcast.io/card/digital/large/crd_a9c86e6316084d76a03b32be95977091.avif?1709690747"
                alt="Hades"
                width={320}
                height={448}
                className="w-full"
                unoptimized
              />
            </div>
            <div className="absolute -right-8 top-8 -z-10 h-full w-full rotate-6 overflow-hidden rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/50 opacity-70">
              <Image
                src="https://cards.lorcast.io/card/digital/large/crd_22373df684c0420ea90d2f8508ac096c.avif?1709690747"
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -left-8 top-8 -z-20 h-full w-full -rotate-6 overflow-hidden rounded-2xl border border-[var(--stroke-strong)] bg-[var(--panel)]/50 opacity-50">
              <Image
                src="https://cards.lorcast.io/card/digital/large/crd_35c968e4b25945e897940860221f9d51.avif?1709690747"
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
