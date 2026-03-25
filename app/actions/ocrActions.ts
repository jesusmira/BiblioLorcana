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
    let cleanLine = line.trim();
    cleanLine = cleanLine.replace(/(\d)[lI](\d)/gi, "$11$2");
    cleanLine = cleanLine.replace(/^[lI]/gi, "1");
    
    const hasEn = cleanLine.includes("EN");
    const hasDot = cleanLine.includes("•") || cleanLine.includes(".");
    const hasP = /P\d+/i.test(cleanLine);
    
    if (hasEn && hasDot && (cleanLine.includes("/") || hasP)) {
      cleanLine = cleanLine.replace(/\s+/g, "");
      cleanLine = cleanLine.replace(/[•·]/g, ".");
      
      let number = "";
      let set = "";
      let cost = "";
      
      if (hasP) {
        cleanLine = cleanLine.replace("/", "");
        const match = cleanLine.match(/(\d+)(P\d+)\.EN\.?(\d*)/i);
        if (match) {
          let numStr = match[1];
          if (numStr.length > 2) {
            numStr = numStr.slice(0, 2);
          }
          number = numStr;
          set = match[2];
          if (match[3]) cost = `·${match[3]}`;
        }
      } else {
        const allNums = cleanLine.match(/\d+/g) || [];
        if (allNums.length >= 2) {
          number = allNums[0] || "";
          set = allNums[allNums.length - 1] || "";
          if (allNums.length >= 3) {
            cost = `·${allNums[allNums.length - 1] || ""}`;
          }
        }
      }
      
      if (number && set) {
        const fullLine = `${number}/${set}·EN${cost}`;
        console.log("Detectado:", { number, set, cost, fullLine });
        return {
          set,
          number,
          fullLine,
        };
      }
    }
  }

  return null;
}
