"use client";

import { useEffect } from "react";
import { GalleryCards, GalleryHeader, GallerySectionHeader } from "./index";
import { useGalleryFilters, useGalleryData, useModalCard, usePagination } from "../hooks";
import { useAuth } from "../lib/auth";
import { useUserCardsStore } from "../store";
import { getUserCardIds } from "../actions";
import { APP } from "../lib/constants";

interface GalleryProps {
  defaultSetCode: string;
}

export default function Gallery({ defaultSetCode }: GalleryProps) {
  const { user } = useAuth();
  const { setSavedCardIds } = useUserCardsStore();

  useEffect(() => {
    if (user) {
      getUserCardIds().then(setSavedCardIds);
    } else {
      setSavedCardIds([]);
    }
  }, [user, setSavedCardIds]);

  const galleryData = useGalleryData(defaultSetCode);
  const {
    sets,
    cards,
    selectedSet,
    setSelectedSet,
    loadingSets,
    loadingCards,
    setError,
    cardError,
    search,
    setSearch,
    ink,
    setInk,
    type,
    setType,
    rarity,
    setRarity,
    sort,
    setSort,
    resetFilters,
  } = galleryData;
  const { inkValues, typeValues, rarityValues, filteredCards } = useGalleryFilters({
    cards,
    search,
    ink,
    type,
    rarity,
    sort,
  });
  const {
    visibleCount,
    visibleItems: visibleCards,
    canLoadMore,
    loadMore,
  } = usePagination(filteredCards, APP.PAGE_SIZE, [cards, search, ink, type, rarity, sort]);

  const selectedSetData = sets.find((set) => set.code === selectedSet);

  const { selected, openCard, closeModal, pickRandom } = useModalCard({
    cards: filteredCards,
  });

  const buttonBase =
    "rounded-full px-[18px] py-3 text-[0.95rem] font-semibold transition duration-200 hover:-translate-y-0.5";
  const buttonSolid = `${buttonBase} bg-[var(--accent)] text-white shadow-[0_12px_24px_rgba(197,138,60,0.35)]`;
  const buttonGhost = `${buttonBase} border border-[var(--stroke)] bg-transparent text-[var(--ink)]`;

  return (
    <main className="mt-8 flex flex-col gap-5 max-[900px]:px-4 px-16">
      <GalleryHeader
        selectedSetData={selectedSetData}
        loadingSets={loadingSets}
        filteredCount={filteredCards.length}
        search={search}
        onSearchChange={setSearch}
        sets={sets}
        selectedSet={selectedSet}
        onSelectedSetChange={setSelectedSet}
        ink={ink}
        onInkChange={setInk}
        type={type}
        onTypeChange={setType}
        rarity={rarity}
        onRarityChange={setRarity}
        sort={sort}
        onSortChange={setSort}
        inkValues={inkValues}
        typeValues={typeValues}
        rarityValues={rarityValues}
        buttonGhost={buttonGhost}
        buttonSolid={buttonSolid}
        pickRandom={pickRandom}
        resetFilters={resetFilters}
        setError={setError}
        cardError={cardError}
      />

      <GallerySectionHeader
        visibleCount={visibleCount}
        totalCount={filteredCards.length}
      />

      <GalleryCards
        cardError={cardError}
        loadingCards={loadingCards}
        visibleCards={visibleCards}
        openCard={openCard}
        canLoadMore={canLoadMore}
        onLoadMore={loadMore}
        buttonGhost={buttonGhost}
        selected={selected}
        closeModal={closeModal}
      />
    </main>
  );
}
