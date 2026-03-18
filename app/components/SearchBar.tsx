"use client";

import type { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <label
        className="mb-2 block text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]"
        htmlFor="searchInput"
      >
        Busqueda
      </label>
      <div className="grid items-center gap-3">
        <div className="relative w-full">
          <span
            className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--muted)]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              role="img"
              focusable="false"
              className="h-full w-full fill-none stroke-current stroke-[2]"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5L21 21" />
            </svg>
          </span>
          <input
            id="searchInput"
            type="search"
            value={value}
            placeholder="Nombre o efecto"
            onChange={onChange}
            className="h-[52px] w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-[14px] pl-10 pr-10 text-base text-[var(--ink)]"
          />
        </div>
      </div>
    </div>
  );
}
