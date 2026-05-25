import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { fetchCardBySetAndNumberAction } from "@/actions/galleryActions";
import { normalizeInk, normalizeLabel } from "@/lib";
import ShareButton from "@/components/ui/ShareButton";
import TagChip from "@/components/ui/TagChip";
import StatGrid from "@/components/lorcana/StatGrid";
import { CardTranslateSection } from "./_components/CardTranslateSection";

interface PageProps {
  params: Promise<{ cardId: string }>;
}

function parseCardId(cardId: string): { setCode: string; number: string } | null {
  const idx = cardId.indexOf("-");
  if (idx === -1) return null;
  return { setCode: cardId.slice(0, idx), number: cardId.slice(idx + 1) };
}

function getCardImage(card: {
  image_uris?: { digital?: { large?: string | null; normal?: string | null } | null } | null;
  imageUrl?: string | null;
}): string | null {
  return (
    card.image_uris?.digital?.large ??
    card.image_uris?.digital?.normal ??
    card.imageUrl ??
    null
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cardId } = await params;
  const parsed = parseCardId(cardId);
  if (!parsed) return {};

  const card = await fetchCardBySetAndNumberAction(parsed.setCode, parsed.number);
  if (!card) return {};

  const cardName = [card.name, card.version].filter(Boolean).join(", ");
  const setName = card.set?.name ?? "Disney Lorcana";
  const description = card.text
    ? `${card.text.slice(0, 120)}${card.text.length > 120 ? "…" : ""}`
    : `Carta de ${setName}. ${card.ink ?? ""} · ${card.rarity ?? ""}`.trim();

  const cardImage = getCardImage(card);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}/cartas/${cardId}`;
  const fallbackOgUrl = `${siteUrl}/api/og?title=${encodeURIComponent(cardName)}&description=${encodeURIComponent(description)}`;
  const ogImage = cardImage
    ? { url: cardImage, width: 734, height: 1024, alt: cardName }
    : { url: fallbackOgUrl, width: 1200, height: 630, alt: cardName };

  return {
    title: cardName,
    description,
    openGraph: {
      title: `${cardName} | Archivo del Reino`,
      description,
      url: pageUrl,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cardName} | Archivo del Reino`,
      description,
      images: [ogImage.url],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function CardDetailPage({ params }: PageProps) {
  const { cardId } = await params;
  const parsed = parseCardId(cardId);
  if (!parsed) notFound();

  const card = await fetchCardBySetAndNumberAction(parsed.setCode, parsed.number);
  if (!card) notFound();

  const cardName = [card.name, card.version].filter(Boolean).join(", ");
  const cardImage = getCardImage(card);
  const types = Array.isArray(card.type) ? card.type : card.type ? [card.type] : [];

  return (
    <main className="mx-auto flex min-h-screen flex-col px-4 pb-16 pt-24 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/galeria"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a la galería
        </Link>
        <ShareButton
          url={`/cartas/${cardId}`}
          title={`${cardName} — Archivo del Reino`}
          description={card.text ?? ""}
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(280px,360px)_1fr]">
        {/* Imagen */}
        <div className="flex justify-center lg:justify-start">
          {cardImage ? (
            <div className="relative aspect-[2/3] w-full max-w-[360px] overflow-hidden rounded-[16px] bg-[var(--surface-soft)]">
              <Image
                src={cardImage}
                alt={cardName}
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 100vw, 360px"
                priority
                unoptimized
              />
            </div>
          ) : (
            <div className="flex aspect-[2/3] w-full max-w-[360px] items-center justify-center rounded-[16px] bg-[var(--surface-soft)]">
              <span className="text-[var(--muted)]">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <CardTranslateSection
            cardTitle={cardName}
            setName={card.set?.name}
            collectorNumber={card.collector_number}
            text={card.text}
            flavorText={card.flavor_text}
          />

          <StatGrid card={card} />

          <div className="flex flex-wrap gap-2">
            {card.ink && <TagChip>{normalizeInk(card.ink)}</TagChip>}
            {types.map((t) => (
              <TagChip key={t}>{t}</TagChip>
            ))}
            {card.rarity && (
              <>
                <span className="w-3" />
                <TagChip>{normalizeLabel(card.rarity)}</TagChip>
              </>
            )}
            {(card.classifications ?? []).map((c) => (
              <TagChip key={c}>{c}</TagChip>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
