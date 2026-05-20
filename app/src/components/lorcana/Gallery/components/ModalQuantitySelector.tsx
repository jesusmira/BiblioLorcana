import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface ModalQuantitySelectorProps {
  quantity: number;
  isUpdating: boolean;
  onUpdateQuantity: (newQty: number) => void;
}

export function ModalQuantitySelector({
  quantity,
  isUpdating,
  onUpdateQuantity,
}: ModalQuantitySelectorProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="text-sm font-bold text-[var(--muted)]">COPIAS:</span>
      <div className="flex items-center gap-3 bg-[var(--surface-soft)] rounded-full px-4 py-1.5 border border-[var(--stroke)] shadow-inner">
        <button
          onClick={() => onUpdateQuantity(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
          className="text-[var(--foreground)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:text-[var(--foreground)]"
        >
          <MinusIcon
            className="h-4 w-4 transition hover:scale-110"
            strokeWidth={3}
          />
        </button>

        <span className="min-w-[1.5rem] text-center font-bold text-lg">
          {isUpdating ? "..." : quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(quantity + 1)}
          disabled={quantity >= 10 || isUpdating}
          className="text-[var(--foreground)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:text-[var(--foreground)]"
        >
          <PlusIcon
            className="h-4 w-4 transition hover:scale-110"
            strokeWidth={3}
          />
        </button>
      </div>
    </div>
  );
}
