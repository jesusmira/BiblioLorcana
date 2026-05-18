"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface InkWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InkWarningModal({
  isOpen,
  onClose,
}: InkWarningModalProps) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-2xl transition-all text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-amber-100 p-3">
                    <ExclamationTriangleIcon className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <Dialog.Title
                  as="h3"
                  className="mb-2 text-xl font-bold text-[var(--ink)]"
                >
                  Límite de tintas excedido
                </Dialog.Title>
                <p className="mb-6 text-[var(--muted)]">
                  Un mazo legal de Lorcana solo puede tener hasta 2 colores de
                  tinta. No puedes añadir cartas de un tercer color.
                </p>
                <button
                  onClick={onClose}
                  className="w-full rounded-full bg-[var(--accent)] py-3 font-bold text-white transition hover:opacity-90"
                >
                  Entendido, voy a corregirlo
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
