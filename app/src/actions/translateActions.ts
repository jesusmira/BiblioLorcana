"use server";

import axios from "axios";

interface TranslateResponse {
  translatedText?: string;
  error?: string;
}

// ✅ Añade o quita palabras aquí según necesites
const PROTECTED_WORDS = [
  "lore",
  // "buff",
  // "nerf",
  // "spawn",
  // "respawn",
  // "tank",
  // "healer",
  // "DPS",
  // "cooldown",
  // "aggro",
  // "boss",
  // "raid",
];

function protectWords(text: string): { protected: string; map: Record<string, string> } {
  const map: Record<string, string> = {};
  let protectedText = text;

  PROTECTED_WORDS.forEach((word, i) => {
    const token = `PROT${i}PROT`;
    // Guardamos el token → palabra original
    map[token] = word;
    // Reemplazamos todas las ocurrencias (sin importar mayúsculas)
    protectedText = protectedText.replace(new RegExp(`\\b${word}\\b`, "gi"), token);
  });

  return { protected: protectedText, map };
}

function restoreWords(translatedText: string, map: Record<string, string>): string {
  let result = translatedText;

  for (const [token, original] of Object.entries(map)) {
    result = result.replace(new RegExp(token, "gi"), original);
  }

  return result;
}

export async function translateText(
  text: string,
  sourceLang: string = "en",
  targetLang: string = "es"
): Promise<TranslateResponse> {
  if (!text || text.trim() === "") {
    return { error: "El texto no puede estar vacío" };
  }

  // 1️⃣ Proteger palabras antes de traducir
  const { protected: safeText, map } = protectWords(text);

  const langPair = `${sourceLang}|${targetLang}`;
  const encodedText = encodeURIComponent(safeText);

  try {
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
    );

    const data = response.data;

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      // 2️⃣ Restaurar palabras protegidas después de traducir
      const translated = restoreWords(data.responseData.translatedText, map);
      return { translatedText: translated };
    }

    return { error: data.responseDetails || "Error al traducir" };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Error al traducir el texto",
    };
  }
}
