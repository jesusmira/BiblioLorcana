"use client";

import { AnatomyPoint } from "./AnatomyPoint";

interface Point {
  title: string;
  desc: string;
}

interface SectionAnatomiaProps {
  data: {
    title: string;
    subtitle: string;
    cardImage: string;
    cardAlt: string;
    points: readonly Point[];
    labels: {
      coste: string;
      lore: string;
      stats: string;
    };
  };
}

export function SectionAnatomia({ data }: SectionAnatomiaProps) {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-[var(--font-title)] text-4xl">{data.title}</h2>
        <p className="text-[var(--muted)]">{data.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative mx-auto max-w-xs group">
          <div className="absolute -inset-4 bg-[var(--accent)] opacity-10 blur-xl group-hover:opacity-20 transition duration-500" />
          <img
            src={data.cardImage}
            alt={data.cardAlt}
            className="relative rounded-[20px] shadow-2xl border border-[var(--stroke)]"
          />
          <div className="absolute -top-4 -left-8 bg-[var(--surface-strong)] border border-[var(--accent)] px-3 py-1 rounded-lg text-xs font-bold text-[var(--accent)] shadow-lg">
            {data.labels.coste}
          </div>
          <div className="absolute top-1/2 -right-12 bg-[var(--surface-strong)] border border-[var(--accent)] px-3 py-1 rounded-lg text-xs font-bold text-[var(--accent)] shadow-lg">
            {data.labels.lore}
          </div>
          <div className="absolute -bottom-4 left-1/4 bg-[var(--surface-strong)] border border-[var(--accent)] px-3 py-1 rounded-lg text-xs font-bold text-[var(--accent)] shadow-lg">
            {data.labels.stats}
          </div>
        </div>

        <div className="grid gap-4">
          {data.points.map((point) => (
            <AnatomyPoint key={point.title} title={point.title} desc={point.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}
