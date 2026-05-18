"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-6 rounded-[24px] border border-[var(--stroke)] bg-[var(--surface-soft)]/50 p-16 text-center backdrop-blur-sm ${className}`}
    >
      {icon && (
        <div className="rounded-full bg-[var(--surface)] p-6 shadow-inner text-[var(--muted)]">
          <div className="h-12 w-12 opacity-40 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
      <div className="max-w-xs">
        <h2 className="mb-2 text-xl font-bold text-[var(--ink)]">{title}</h2>
        <p className="text-[var(--muted)]">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
