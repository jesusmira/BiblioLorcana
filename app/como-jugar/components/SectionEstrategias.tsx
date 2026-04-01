"use client";

import { CoreStrategyCard } from "./CoreStrategyCard";

interface StrategyItem {
  title: string;
  desc: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}

interface SectionEstrategiasProps {
  data: {
    title: string;
    items: readonly StrategyItem[];
  };
}

export function SectionEstrategias({ data }: SectionEstrategiasProps) {
  return (
    <section className="space-y-10">
      <h2 className="font-[var(--font-title)] text-4xl text-center">{data.title}</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {data.items.map((item) => (
          <CoreStrategyCard key={item.title} title={item.title} desc={item.desc} borderColor={item.borderColor} bgColor={item.bgColor} textColor={item.textColor} />
        ))}
      </div>
    </section>
  );
}
