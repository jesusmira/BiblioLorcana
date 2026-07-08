export function fixLorcastSymbols(text: string | null | undefined): string | null | undefined {
  if (!text) return text;

  let fixed = text;

  // Capa 1: Corrección automática por patrón (deducible por la plantilla)

  // Shift N {} → Shift N {I} (coste de Shift siempre tinta genérica)
  fixed = fixed.replace(/Shift\s+(\d+)\s+\{\}/g, 'Shift $1 {I}');

  // METAMORPHOSIS {}, N{} → METAMORPHOSIS {E}, N{I} (exert + tinta)
  fixed = fixed.replace(/METAMORPHOSIS\s+\{\},\s*(\d+)\{\}/g, 'METAMORPHOSIS {E}, $1{I}');

  // Patrones generales "pay N {} to" → "pay N {I} to" (coste de habilidad, siempre tinta)
  fixed = fixed.replace(/pay\s+(\d+)\s+\{\}\s+to\s+/g, 'pay $1 {I} to ');

  // Patrones tipo "pay {} to" (una unidad de tinta) → "pay {I} to"
  fixed = fixed.replace(/pay\s+\{\}\s+to\s+/g, 'pay {I} to ');

  // Patrones de habilidad entre paréntesis: (You may pay N {} to ...) → (You may pay N {I} to ...)
  fixed = fixed.replace(/\(You may pay\s+(\d+)\s+\{\}\s+to\s+/g, '(You may pay $1 {I} to ');

  // Capa 2: Consultar overrides manuales por carta
  // (No se hace aquí; se maneja en lorcastOverrides.ts y se llama por separado en el schema/sync-cards)

  return fixed;
}
