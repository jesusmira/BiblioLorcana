"use client";

interface AnatomyPointProps {
  title: string;
  desc: string;
}

export function AnatomyPoint({ title, desc }: AnatomyPointProps) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--stroke)] transition hover:border-[var(--accent)] hover:translate-x-1 duration-300">
      <div className="h-2 w-2 mt-2 rounded-full bg-[var(--accent)] shrink-0" />
      <div>
        <h4 className="font-bold text-[var(--foreground)]">{title}</h4>
        <p className="text-sm text-[var(--muted)]">{desc}</p>
      </div>
    </div>
  );
}
