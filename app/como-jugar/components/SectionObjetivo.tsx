"use client";

import ReactMarkdown from "react-markdown";
import { TrophyIcon } from "@heroicons/react/24/outline";

interface SectionObjetivoProps {
  data: {
    badge: string;
    content: string;
    loreTarget: number;
  };
}

export function SectionObjetivo({ data }: SectionObjetivoProps) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)]">
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[var(--accent)] opacity-5 blur-3xl" />
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--accent)]">
            <TrophyIcon className="h-5 w-5" />
            {data.badge}
          </div>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-lg leading-relaxed text-[var(--muted)]">{children}</p>,
              strong: ({ children }) => <span className="font-bold text-[var(--accent)] text-xl">{children}</span>,
              em: ({ children }) => <span className="text-[var(--ink)] font-semibold italic">{children}</span>,
            }}
          >
            {data.content}
          </ReactMarkdown>
        </div>
        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--surface-strong)] to-[var(--surface)] border-2 border-[var(--accent)] shadow-xl transform rotate-3 hover:rotate-0 transition duration-500">
          <span className="text-6xl mb-2">💎</span>
          <span className="text-3xl font-bold text-[var(--accent)] font-[var(--font-title)]">{data.loreTarget}</span>
        </div>
      </div>
    </section>
  );
}
