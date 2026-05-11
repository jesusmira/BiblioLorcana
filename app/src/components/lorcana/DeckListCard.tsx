"use client";

import { useRouter } from "next/navigation";
import type { UserDeck } from "@/types/";
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { InkDot } from "./InkDot";

interface DeckListCardProps {
  deck: UserDeck;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (deck: UserDeck) => void;
  onDoubleClick?: (deck: UserDeck) => void;
  inkColors?: string[];
}

export function DeckListCard({
  deck,
  onDelete,
  onDuplicate,
  onExport,
  onDoubleClick,
  inkColors = [],
}: DeckListCardProps) {
  const router = useRouter();
  const totalCards = deck.cards.reduce((acc, c) => acc + c.quantity, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/mis-mazos/${deck.id}`);
  };

  return (
    <div
      className="group relative flex flex-col gap-4 rounded-[20px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] transition cursor-pointer hover:border-[var(--accent)]/70 hover:shadow-lg"
      onClick={() => onDoubleClick?.(deck)}
      title="Haz click para previsualizar"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-2">
            {inkColors.map((ink) => (
              <InkDot key={ink} ink={ink} />
            ))}
            <h3 className="font-[var(--font-title)] text-lg text-[var(--ink)] truncate">
              {deck.name}
            </h3>
          </div>
          {deck.description && (
            <p className="line-clamp-2 text-sm text-[var(--muted)]">
              {deck.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleEdit}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            title="Editar mazo"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(deck.id); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            title="Duplicar mazo"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onExport(deck); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            title="Exportar mazo"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(deck.id); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition hover:border-[var(--alert-ink)] hover:text-[var(--alert-ink)]"
            title="Eliminar mazo"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 font-bold text-[var(--accent)]">
          {totalCards} cartas
        </span>
        <span className="text-[var(--muted)]">
          {formatDate(deck.updatedAt)}
        </span>
      </div>
    </div>
  );
}