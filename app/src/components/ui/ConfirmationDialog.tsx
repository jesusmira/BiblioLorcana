"use client";

import { useEffect, useRef } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Content */}
      <div 
        ref={dialogRef}
        className="relative z-[101] w-full max-w-md overflow-hidden rounded-[24px] bg-[var(--surface)] p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className={`mb-6 rounded-full p-4 ${isDestructive ? "bg-[var(--alert-surface)] text-[var(--alert-ink)]" : "bg-[var(--accent)]/10 text-[var(--accent)]"}`}>
            <ExclamationTriangleIcon className="h-8 w-8" />
          </div>
          
          <h3 className="mb-2 font-[var(--font-title)] text-2xl text-[var(--ink)]">
            {title}
          </h3>
          <p className="mb-8 text-[var(--muted)]">
            {message}
          </p>
          
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={onCancel}
              className="flex-1 rounded-full border border-[var(--stroke)] px-6 py-3 font-bold text-[var(--ink)] transition hover:bg-[var(--surface-soft)] active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 rounded-full px-6 py-3 font-bold text-white transition active:scale-95 shadow-lg ${
                isDestructive 
                  ? "bg-[var(--alert-ink)] shadow-[var(--alert-ink)]/20 hover:opacity-90" 
                  : "bg-[var(--accent)] shadow-[var(--accent)]/20 hover:opacity-90"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
