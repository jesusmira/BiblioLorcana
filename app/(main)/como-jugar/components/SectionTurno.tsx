"use client";

import ReactMarkdown from "react-markdown";
import { PlayIcon } from "@heroicons/react/24/outline";
import { CombatCard } from "./CombatCard";

interface Combat {
  title: string;
  action: string;
  result: string;
  icon: string;
}

interface SectionTurnoProps {
  data: {
    title: string;
    faseInicio: string;
    fasePrincipal: string;
    combatTitle: string;
    combat: readonly Combat[];
  };
}

export function SectionTurno({ data }: SectionTurnoProps) {
  return (
    <section className="rounded-[32px] border border-[var(--stroke)] bg-[var(--surface-soft)] p-8 lg:p-12">
      <h2 className="font-[var(--font-title)] text-4xl mb-12 text-center flex items-center justify-center gap-4">
        <PlayIcon className="h-10 w-10 text-[var(--accent)]" />
        {data.title}
      </h2>

      <div className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[var(--stroke)] pb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[var(--accent)]">1. Fase de Inicio</h3>
            <p className="text-[var(--muted)]">
              {data.faseInicio.replace("*", "")}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[var(--ink)]">2. Fase Principal</h3>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="text-[var(--muted)]">{children}</p>,
                strong: ({ children }) => <span className="text-[var(--foreground)] font-bold">{children}</span>,
              }}
            >
              {data.fasePrincipal}
            </ReactMarkdown>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-[var(--font-title)] text-center text-[var(--muted)] uppercase tracking-widest">
            {data.combatTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.combat.map((c) => (
              <CombatCard key={c.title} title={c.title} action={c.action} result={c.result} icon={c.icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
