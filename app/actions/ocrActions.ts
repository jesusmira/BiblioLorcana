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
    let cleanBase64 = imageBase64;
    
    if (cleanBase64.startsWith("data:")) {
      const parts = cleanBase64.split(",");
      if (parts.length > 1) {
        cleanBase64 = parts[1];
      }
    }

    const apiKey = process.env.OCRSPACE_API_KEY;
    if (!apiKey) {
      return { success: false, error: "API key de OCR no configurada" };
    }

    const formData = new FormData();
    formData.append("base64Image", cleanBase64);
    formData.append("language", "eng");
    formData.append("detectOrientation", "true");
    formData.append("scale", "true");
    formData.append("OCREngine", "2");

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        "apikey": apiKey,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.status === 403) {
      return { success: false, error: "API key inválida o cuenta bloqueada" };
    }

    if (data.IsErroredOnProcessing) {
      const errorMsg = data.ErrorMessage?.[0] || data.ResolvedError || "Error en OCR";
      return { success: false, error: errorMsg };
    }

    if (!response.ok) {
      return { success: false, error: `Error HTTP: ${response.status}` };
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

export async function extractCollectorNumber(text: string): Promise<{ set: string; number: string; fullLine: string } | null> {
  const lines = text.split("\n");
  
  for (const line of lines) {
    if (line.includes("/") && (line.includes("EN") || line.includes("•"))) {
      const match = line.match(/(\d+)\s*[\/]\s*(\d+)/);
      if (match) {
        const numbers = line.match(/\d+/g) || [];
        const filtered = numbers.filter(n => parseInt(n) <= 300);
        
        if (filtered.length >= 2) {
          const set = filtered[filtered.length - 1];
          const number = filtered[0];
          const cost = filtered.length >= 3 ? `·${filtered[1]}` : "";
          const fullLine = `${number}/${set}·EN${cost}`;
          return {
            set,
            number,
            fullLine,
          };
        }
      }
    }
  }

  return null;
}
