"use client";

interface RatioItemProps {
  label: string;
  value: string;
  color: string;
  desc: string;
}

export function RatioItem({ label, value, color, desc }: RatioItemProps) {
  return (
    <div className="text-center p-4">
      <div className={`text-4xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-lg font-bold uppercase tracking-widest">{label}</div>
      <p className="text-sm text-[var(--muted)] mt-2">{desc}</p>
    </div>
  );
}
