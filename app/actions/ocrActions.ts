"use server";

interface OcrResponse {
  success: boolean;
  text?: string;
  error?: string;
}

export async function extractTextFromImage(
  imageBase64: string
): Promise<OcrResponse> {
  try {
    const formData = new FormData();
    formData.append("base64Image", imageBase64);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");
    formData.append("detectOrientation", "true");
    formData.append("scale", "true");
    formData.append("OCREngine", "2");
    formData.append("filetype", "JPG");

    const apiKey = process.env.OCRSPACE_API_KEY;

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers["apikey"] = apiKey;
    }

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      return { success: false, error: `HTTP Error: ${response.status}` };
    }

    const data = await response.json();

    if (data.IsErroredOnProcessing) {
      const errorMsg = data.ErrorMessage?.[0] || "Error en el procesamiento OCR";
      return { success: false, error: errorMsg };
    }

    const parsedText = data.ParsedResults?.[0]?.ParsedText?.trim();

    if (!parsedText) {
      return { success: false, error: "No se detectó texto en la imagen" };
    }

    return { success: true, text: parsedText };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al procesar la imagen",
    };
  }
}

export async function extractCollectorNumber(text: string): Promise<string | null> {
  const patterns = [
    /#?\s*(\d{1,4})\s*(?:\/|$|\s)/,
    /(?:Card\s*)?#?\s*(\d{3,4})/i,
    /\b(\d{3,4})\b/,
  ];

  const cleanText = text.replace(/\s+/g, " ").trim();

  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      const num = match[1].replace(/\D/g, "");
      if (num.length >= 3 && num.length <= 4) {
        return num;
      }
    }
  }

  return null;
}