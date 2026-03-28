import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: "No se recibió imagen" },
        { status: 400 }
      );
    }

    let imageData = imageBase64;
    let mimeType = "image/jpeg";

    if (imageBase64.startsWith("data:")) {
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        imageData = match[2];
      }
    }

    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key de Anthropic no configurada" },
        { status: 500 }
      );
    }

    const maxSize = 4 * 1024 * 1024;
    if (imageData.length > maxSize) {
      return NextResponse.json(
        { success: false, error: "La imagen es muy grande. Usa una imagen más pequeña." },
        { status: 400 }
      );
    }

    console.log("Sending to Claude Vision...");
    console.log("MIME type:", mimeType);
    console.log("Base64 length:", imageData.length);

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
                data: imageData,
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
      return NextResponse.json(
        { success: false, error: "No se pudo procesar la respuesta" },
        { status: 500 }
      );
    }

    let extractedData;
    try {
      // Intentar limpiar posibles caracteres extraños o bloques de código
      const cleanJson = textResponse.text.replace(/```json/g, "").replace(/```/g, "").trim();
      extractedData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Error parsing JSON from Claude:", textResponse.text);
      return NextResponse.json(
        { success: false, error: "La IA no devolvió un JSON válido" },
        { status: 500 }
      );
    }

    console.log("Claude extracted data:", extractedData);

    return NextResponse.json({ success: true, data: extractedData });

  } catch (error) {
    console.error("Claude Vision error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error al procesar" },
      { status: 500 }
    );
  }
}