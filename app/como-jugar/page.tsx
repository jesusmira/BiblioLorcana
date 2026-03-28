export default function ComoJugarPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <section className="rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--panel-shadow)] max-[600px]:p-4">
        <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.6rem)] text-shadow-gold">
          Como jugar
        </h1>
        <p className="mt-4 text-[var(--muted)] leading-[1.7]">
          Aqui puedes explicar las reglas basicas, tipos de cartas y fases de juego.
        </p>
      </section>
    </main>
  );
}
