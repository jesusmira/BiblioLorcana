"use client";

import ReactMarkdown from "react-markdown";
import { RatioItem } from "./RatioItem";

interface RatioItem {
  label: string;
  value: string;
  color: string;
  desc: string;
}

interface SectionProporcionProps {
  data: {
    title: string;
    subtitle: string;
    items: readonly RatioItem[];
    tip: string;
  };
}

export function SectionProporcion({ data }: SectionProporcionProps) {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-[var(--font-title)] text-4xl">{data.title}</h2>
        <p className="text-[var(--muted)]">{data.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[var(--surface)] p-8 rounded-[32px] border border-[var(--accent)]/20 shadow-xl">
        {data.items.map((item) => (
          <RatioItem key={item.label} label={item.label} value={item.value} color={item.color} desc={item.desc} />
        ))}
        <div className="md:col-span-3 mt-4 p-4 bg-[var(--surface-strong)] rounded-2xl text-center border border-[var(--stroke)]">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-lg">{children}</p>,
              strong: ({ children }) => <span className="font-bold text-[var(--accent)]">{children}</span>,
            }}
          >
            {data.tip}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
