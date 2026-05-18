"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { DeckCardWithDetails } from "../_hooks/useDeckBuilder";

interface BuilderExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckName: string;
  deckDescription: string;
  deckFormat: string;
  deckStrategy: string;
  deckTier: string;
  cards: DeckCardWithDetails[];
  totalCards: number;
}

export default function BuilderExportModal({
  isOpen,
  onClose,
  deckName,
  deckDescription,
  deckFormat,
  deckStrategy,
  deckTier,
  cards,
  totalCards,
}: BuilderExportModalProps) {
  const textExport = `Mazo: ${deckName}
${deckDescription ? `Descripción: ${deckDescription}` : ""}
${deckFormat ? `Formato: ${deckFormat}` : ""}
${deckStrategy ? `Estrategia: ${deckStrategy}` : ""}
${deckTier ? `Tier: ${deckTier}` : ""}
${cards
  .filter((c) => c.quantity > 0)
  .map((c) => `${c.quantity}x ${c.name}`)
  .join("\n")}
---
Total: ${totalCards} cartas`;

  const jsonExport = JSON.stringify(
    {
      name: deckName,
      description: deckDescription,
      format: deckFormat || undefined,
      strategy: deckStrategy || undefined,
      tier: deckTier || undefined,
      cards: cards
        .filter((c) => c.quantity > 0)
        .map((c) => ({
          cardId: c.cardId,
          name: c.name,
          quantity: c.quantity,
        })),
      totalCards,
      createdAt: new Date().toISOString(),
    },
    null,
    2,
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-2xl transition-all">
                <Dialog.Title
                  as="h2"
                  className="mb-4 font-[var(--font-title)] text-xl text-[var(--ink)]"
                >
                  Exportar mazo
                </Dialog.Title>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--ink)]">
                      Texto plano (para foros)
                    </span>
                    <button
                      onClick={() => copyToClipboard(textExport)}
                      className="text-xs text-[var(--accent)] hover:underline"
                    >
                      Copiar
                    </button>
                  </div>
                  <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-soft)] p-3 text-xs text-[var(--ink)] whitespace-pre-wrap font-mono">
                    {textExport}
                  </pre>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--ink)]">
                      JSON (backup/importar)
                    </span>
                    <button
                      onClick={() => copyToClipboard(jsonExport)}
                      className="text-xs text-[var(--accent)] hover:underline"
                    >
                      Copiar
                    </button>
                  </div>
                  <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-soft)] p-3 text-xs text-[var(--ink)] whitespace-pre-wrap font-mono">
                    {jsonExport}
                  </pre>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-full border border-[var(--stroke)] py-3 font-bold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
