import { Gallery } from "./components";

const DEFAULT_SET_CODE = "all";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <header className="flex flex-col items-center gap-6 pt-6 text-center">
        <div className="flex flex-col items-center">
          <p className="mb-1 text-[0.82rem] uppercase tracking-[2px] text-[var(--muted)]">
            Galeria de cartas
          </p>
          <h1 className="lorcana-title text-[clamp(2.2rem,3.8vw,3.1rem)]">
            Archivo del Reino de Lorcana
          </h1>
        </div>
        <p className="max-w-[680px] text-[var(--muted)] leading-[1.6]">
          Explora cartas reales desde la API de Lorcast y filtra por tinta,
          rareza o tipo.
        </p>
      </header>

      <Gallery defaultSetCode={DEFAULT_SET_CODE} />
    </div>
  );
}
