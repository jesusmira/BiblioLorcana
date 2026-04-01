"use client";

interface CoreStrategyCardProps {
  title: string;
  desc: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}

export function CoreStrategyCard({ title, desc, borderColor, bgColor, textColor }: CoreStrategyCardProps) {
  return (
    <div className={`rounded-3xl border ${borderColor} ${bgColor} p-6 shadow-sm transition hover:shadow-md`}>
      <h3 className={`mb-3 text-xl font-bold ${textColor}`}>{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--muted)]">{desc}</p>
    </div>
  );
}
