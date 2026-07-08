// Tabla de overrides manuales para cartas con símbolos ambiguos o incorrectos
// que no pueden ser corregidos automáticamente por patrones.
//
// Clave: "${setCode}-${collectorNumber}" (ambos strings)
// Valor: texto corregido completo (reemplaza card.text)
//
// Ejemplo: "13-42": "When you play this character, gets +1 {S} this turn."
// (donde "42" es el collector_number y "13" es Attack of the Vine!)
//
// Para añadir una entrada:
// 1. Abre la carta en el navegador y verifica el símbolo correcto mirando la imagen impresa.
// 2. Copia el campo "text" de la API (o del modal) y sustituye manualmente el {} por el símbolo correcto.
// 3. Pega la clave y valor aquí.
// 4. Re-ejecuta scripts/sync-cards.ts para actualizar la BD.

export const LORCAST_SYMBOL_OVERRIDES: Record<string, string> = {
  // Añadir overrides aquí cuando sea necesario
};

export function getOverride(setCode: string, collectorNumber: string): string | null {
  const key = `${setCode}-${collectorNumber}`;
  return LORCAST_SYMBOL_OVERRIDES[key] ?? null;
}
