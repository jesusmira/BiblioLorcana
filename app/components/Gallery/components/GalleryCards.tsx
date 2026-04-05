"use client";

import { StatusCard } from "../../index";
import { buttonGhost } from "../../index";
import GalleryCardItem from "./GalleryCardItem";
import GalleryCardModal from "./GalleryCardModal";
import type { LorcanaCard } from "../../../types";

const cardBase =
  "group relative flex flex-col gap-3 overflow-hidden rounded-[22px] border border-[var(--stroke)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";

interface GalleryCardsProps {
  cardError: string;
  loadingCards: boolean;
  visibleCards: LorcanaCard[];
  openCard: (card: LorcanaCard) => void;
  canLoadMore: boolean;
  onLoadMore: () => void;
  selected: LorcanaCard | null;
  closeModal: () => void;
}

export default function GalleryCards({
  cardError,
  loadingCards,
  visibleCards,
  openCard,
  canLoadMore,
  onLoadMore,
  selected,
  closeModal,
}: GalleryCardsProps) {
  return (
    <>
      <section className="grid gap-[20px] [grid-template-columns:repeat(4,minmax(0,1fr))] max-[900px]:[grid-template-columns:repeat(3,minmax(0,1fr))] max-[600px]:grid-cols-1">
        {cardError ? (
          <StatusCard
            className={cardBase}
            title="Sin resultados"
            message={cardError}
          />
        ) : loadingCards ? (
          <StatusCard
            className={cardBase}
            title="Cargando cartas"
            message="Recibiendo la galeria del set seleccionado."
          />
        ) : visibleCards.length === 0 ? (
          <StatusCard
            className={cardBase}
            title="Sin resultados"
            message="Prueba otra busqueda o limpia los filtros."
          />
        ) : (
          visibleCards.map((card) => (
            <GalleryCardItem
              key={card.id}
              card={card}
              onOpen={openCard}
              cardBaseClass={cardBase}
            />
          ))
        )}
      </section>

      {canLoadMore && !loadingCards && !cardError ? (
        <div className="mt-2 flex justify-center">
          <button className={buttonGhost} onClick={onLoadMore} type="button">
            Cargar mas
          </button>
        </div>
      ) : null}

      <GalleryCardModal selected={selected} onClose={closeModal} />
    </>
  );
}
