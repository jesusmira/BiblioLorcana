"use client";

import { useState } from "react";
import type { UserDeck } from "@/types";

interface ExportDeckModalProps {
  deck: UserDeck;
  onClose: () => void;
}

export default function ExportDeckModal({
  deck,
  onClose,
}: ExportDeckModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const textExport = `Mazo: ${deck.name}
${deck.description ? `Descripción: ${deck.description}` : ""}
${deck.cards
  .filter((c) => c.quantity > 0)
  .map((c) => `${c.quantity}x ${c.name}`)
  .join("\n")}
---
Total: ${deck.cards.reduce((acc, c) => acc + c.quantity, 0)} cartas`;

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-2xl">
        <h2 className="mb-4 font-[var(--font-title)] text-xl text-[var(--ink)]">
          Exportar mazo
        </h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Comparte tu mazo usando uno de los formatos disponibles.
        </p>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--ink)]">
              Texto plano
            </span>
            <button
              onClick={() => copyToClipboard(textExport, "text")}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              {copied === "text" ? "Copiado ✓" : "Copiar"}
            </button>
          </div>
          <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-soft)] p-3 text-xs text-[var(--ink)] whitespace-pre-wrap">
            {textExport}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-[var(--stroke)] py-2.5 font-bold text-[var(--ink)] transition hover:border-[var(--muted)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
