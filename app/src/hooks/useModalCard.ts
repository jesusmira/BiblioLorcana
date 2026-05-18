"use client";

import { useEffect, useState } from "react";
import type {
  LorcanaCard,
  UseModalCardParams,
  UseModalCardReturn,
} from "../types";

export default function useModalCard({
  cards = [],
}: UseModalCardParams = {}): UseModalCardReturn {
  const [selected, setSelected] = useState<LorcanaCard | null>(null);

  const openCard = (card: LorcanaCard): void => {
    setSelected(card);
  };

  const closeModal = (): void => setSelected(null);

  const pickRandom = (): void => {
    if (!cards.length) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    setSelected(card);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleClose = () => closeModal();
    window.addEventListener("close-modal", handleClose as EventListener);
    return () => {
      window.removeEventListener("close-modal", handleClose as EventListener);
    };
  }, []);

  return {
    selected,
    openCard,
    closeModal,
    pickRandom,
  };
}
