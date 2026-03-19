"use server";

interface TranslateResponse {
  translatedText?: string;
  error?: string;
}

export async function translateText(
  text: string,
  sourceLang: string = "en",
  targetLang: string = "es"
): Promise<TranslateResponse> {
  if (!text || text.trim() === "") {
    return { error: "El texto no puede estar vacío" };
  }

  const langPair = `${sourceLang}|${targetLang}`;
  const encodedText = encodeURIComponent(text);

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
    );

    if (!response.ok) {
      return { error: `Error HTTP: ${response.status}` };
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return { translatedText: data.responseData.translatedText };
    }

    return { error: data.responseDetails || "Error al traducir" };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Error al traducir el texto",
    };
  }
}