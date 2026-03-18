"use client";

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorState({ error, reset }: ErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-full max-w-[620px] rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)]">
        <p className="text-[0.8rem] uppercase tracking-[2px] text-[var(--muted)]">
          Algo salio mal
        </p>
        <h1 className="mt-2 font-[var(--font-title)] text-[clamp(1.8rem,4vw,2.8rem)]">
          No pudimos cargar la galeria
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          {error.message || "Intenta nuevamente en unos momentos."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-5 py-2.5 text-[0.95rem] font-semibold text-[var(--ink)] shadow-[var(--float-shadow)] transition duration-200 hover:-translate-y-0.5"
            onClick={reset}
            type="button"
          >
            Reintentar
          </button>
        </div>
      </div>
    </main>
  );
}
