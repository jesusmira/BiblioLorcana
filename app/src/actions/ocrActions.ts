"use server";

import Anthropic from "@anthropic-ai/sdk";

interface OcrResponse {
  success: boolean;
  data?: {
    name: string;
    subtitle: string;
    number: string;
    isPromo: boolean;
  };
  error?: string;
}

export async function extractTextFromImage(
  imageBase64: string
): Promise<OcrResponse> {
  try {
    let cleanBase64 = imageBase64;
    let mimeType = "image/jpeg";

    if (imageBase64.startsWith("data:")) {
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        cleanBase64 = match[2];
      }
    }

    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { success: false, error: "API key de Anthropic no configurada" };
    }

    const maxSize = 4 * 1024 * 1024;
    if (cleanBase64.length > maxSize) {
      return { success: false, error: "La imagen es muy grande. Usa una imagen más pequeña." };
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: cleanBase64,
              },
            },
            {
              type: "text",
              text: `Analiza esta carta de Lorcana. Responde SOLO con un objeto JSON (sin bloques de código markdown, solo el texto JSON puro) con este formato:
{
  "name": "nombre del personaje (usa siempre 'Moana' en lugar de 'Vaiana')",
  "subtitle": "subtítulo",
  "number": "número si es visible ej: 1/P2 o 60/204",
  "isPromo": true o false (basado en si es una versión especial, promo, encantada o tiene arte diferente)
}`,

            },
          ],
        },
      ],
    });

    const textResponse = message.content[0];
    if (!textResponse || textResponse.type !== "text") {
      return { success: false, error: "No se pudo procesar la respuesta" };
    }

    try {
      const cleanJson = textResponse.text.replace(/```json/g, "").replace(/```/g, "").trim();
      const extractedData = JSON.parse(cleanJson);
      return { success: true, data: extractedData };
    } catch (e) {
      console.error("Error parsing JSON from Claude:", textResponse.text);
      return { success: false, error: "La IA no devolvió un JSON válido" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al procesar la imagen",
    };
  }
}
