"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon,
  backHref = "/",
  backLabel = "Volver a la galería",
  onBack,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      {onBack ? (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {backLabel}
        </button>
      ) : (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="rounded-2xl bg-[var(--accent)]/10 p-3">
              <div className="h-8 w-8 text-[var(--accent)] flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
          <div>
            <h1 className="font-[var(--font-title)] text-4xl text-[var(--ink)]">
              {title}
            </h1>
            {description && (
              <p className="text-[var(--muted)]">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
