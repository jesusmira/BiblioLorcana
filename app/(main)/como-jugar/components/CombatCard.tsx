"use client";

interface CombatCardProps {
  title: string;
  action: string;
  result: string;
  icon: string;
}

export function CombatCard({ title, action, result, icon }: CombatCardProps) {
  return (
    <div className="bg-[var(--surface-strong)] p-6 rounded-2xl shadow-inner border border-[var(--stroke)] space-y-3">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-[var(--accent)] text-lg">{title}</h4>
      <div className="text-xs uppercase font-bold text-[var(--muted)] tracking-tighter">
        {action}
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{result}</p>
    </div>
  );
}
