"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import { clsx } from "clsx";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: ReactNode;
}

const selectBaseClass =
  "w-full appearance-none rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-[14px] py-3 text-base text-[var(--ink)] leading-normal focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface-strong)]";
const selectIconWrapperClass =
  "pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 mr-4 mt-4";

export default function SelectField({
  id,
  label,
  value,
  onChange,
  disabled = false,
  children,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label
        className="mb-2 block text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectBaseClass}
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={() => setIsOpen(false)}
      >
        {children}
      </select>
      <div className={selectIconWrapperClass} aria-hidden="true">
        <ChevronUpIcon
          className={clsx(
            "h-4 w-4 text-[var(--muted)] transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </div>
    </div>
  );
}
