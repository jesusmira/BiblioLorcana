"use client";

const steps = [
  {
    number: "1",
    title: "Sube tu Colección",
    description: "Escanea tus cartas con la cámara de tu móvil o añádelas manualmente desde nuestro buscador ultra-rápido.",
  },
  {
    number: "2",
    title: "Organiza y Filtra",
    description: "Usa potentes filtros para encontrar lo que necesitas. Ordena por coste de tinta, fuerza, voluntad o rareza.",
  },
  {
    number: "3",
    title: "Analiza tu Estrategia",
    description: "Estudia la curva de tinta, estadísticas de tu mazo y optimiza tu deck para cada situación.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative mb-40 px-6 py-24 md:px-12 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 h-[500px] w-[700px] rounded-full bg-[var(--accent)]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-24 text-center">
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-[var(--accent-strong)] md:text-6xl" style={{ fontFamily: "var(--font-title)", fontStyle: "italic" }}>
            De físico a digital en segundos.
          </h2>
          <p className="mx-auto max-w-2xl text-xl font-light text-[var(--muted)]" style={{ fontStyle: "italic" }}>
            El proceso más fluido para digitalizar tu pasión.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 px-4 md:grid-cols-3 md:px-0">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className="absolute -top-16 -left-6 select-none text-9xl font-bold text-[var(--accent)]/10 transition-colors duration-700 group-hover:text-[var(--accent)]/20" style={{ fontFamily: "var(--font-body)" }}>
                {step.number}
              </div>

              <div className="relative pt-10">
                <h4 className="mb-6 text-2xl font-bold text-[var(--accent-strong)]" style={{ fontFamily: "var(--font-title)", fontStyle: "italic" }}>
                  {step.title}
                </h4>
                <p className="leading-relaxed text-[var(--muted)]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
