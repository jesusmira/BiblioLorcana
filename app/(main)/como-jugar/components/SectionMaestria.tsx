"use client";

import { AdvancedStrategyCard } from "./AdvancedStrategyCard";

interface AdvancedItem {
  title: string;
  desc: string;
  color: string;
  iconId: "beaker" | "forward" | "shield" | "users";
}

interface SectionMaestriaProps {
  data: {
    title: string;
    items: readonly AdvancedItem[];
  };
}

export function SectionMaestria({ data }: SectionMaestriaProps) {
  return (
    <section className="space-y-10">
      <h2 className="font-[var(--font-title)] text-4xl text-center">
        {data.title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {data.items.map((item) => (
          <AdvancedStrategyCard
            key={item.title}
            iconId={item.iconId}
            title={item.title}
            desc={item.desc}
            color={item.color}
          />
        ))}
      </div>
    </section>
  );
}
