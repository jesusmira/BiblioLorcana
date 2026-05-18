"use client";

import { clsx } from "clsx";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavigationGuardModalProps {
  pendingPath: string | null;
  onConfirm: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export default function NavigationGuardModal({
  pendingPath,
  onConfirm,
  onDiscard,
  onCancel,
}: NavigationGuardModalProps) {
  if (!pendingPath) return null;

  const getPageName = (path: string): string => {
    if (path.startsWith("/mis-mazos")) return "Mis Mazos";
    if (path.startsWith("/mis-cartas")) return "Mis Cartas";
    if (path.startsWith("/perfil")) return "Perfil";
    if (path.startsWith("/guia")) return "Guías";
    return "otra página";
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="relative flex w-full max-w-[320px] flex-col items-center gap-5 rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--alert-surface)]">
          <ArrowPathIcon className="h-7 w-7 text-[var(--alert-ink)]" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-[var(--ink)]">
            Cambios sin guardar
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Tienes cambios en tu mazo que no has guardado. ¿Qué quieres hacer?
          </p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <button
            onClick={onConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Guardar y continuar</span>
          </button>
          <button
            onClick={onDiscard}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--surface)] py-3 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--surface-hover)]"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Descartar cambios</span>
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] transition"
          >
            Continuar editando
          </button>
        </div>
      </div>
    </div>
  );
}
