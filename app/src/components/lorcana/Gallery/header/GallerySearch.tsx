"use client";

import type { ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ImageUploadButton } from "@/components";
import { useAuth } from "@/lib/auth";

interface GallerySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function GallerySearch({
  search,
  onSearchChange,
}: GallerySearchProps) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]"
        htmlFor="searchInput"
      >
        Busqueda
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span
            className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--muted)]"
            aria-hidden="true"
          >
            <MagnifyingGlassIcon className="h-[18px] w-[18px]" />
          </span>
          <input
            id="searchInput"
            type="search"
            value={search}
            placeholder="Nombre o efecto"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onSearchChange(event.target.value)
            }
            className="h-[52px] w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-[14px] pl-10 pr-14 text-base text-[var(--ink)] transition-colors focus:border-[var(--accent)] outline-none"
          />
        </div>
        {user && <ImageUploadButton className="shrink-0" />}
      </div>
    </div>
  );
}
