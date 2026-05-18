import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { OCR_PROMPTS } from "@/lib/prompts";

const MAX_RETRIES = 2;

export async function POST(request: Request) {
  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      const { imageBase64 } = await request.json();

      if (!imageBase64) {
        return NextResponse.json(
          { success: false, error: "No se recibió imagen" },
          { status: 400 },
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
          { status: 500 },
        );
      }

      const maxSize = 4 * 1024 * 1024;
      if (imageData.length > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: "La imagen es muy grande. Usa una imagen más pequeña.",
          },
          { status: 400 },
        );
      }

      console.log(`Sending to Claude Vision... (attempt ${retries + 1})`);
      console.log("MIME type:", mimeType);
      console.log("Base64 length:", imageData.length);

      const anthropic = new Anthropic({ apiKey });

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
                  media_type: mimeType as
                    | "image/jpeg"
                    | "image/png"
                    | "image/gif"
                    | "image/webp",
                  data: imageData,
                },
              },
              {
                type: "text",
                text: OCR_PROMPTS.lorcanaCard,
              },
            ],
          },
        ],
      });

      const textResponse = message.content[0];
      if (!textResponse || textResponse.type !== "text") {
        return NextResponse.json(
          { success: false, error: "No se pudo procesar la respuesta" },
          { status: 500 },
        );
      }

      let extractedData;
      try {
        const cleanJson = textResponse.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        extractedData = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Error parsing JSON from Claude:", textResponse.text);
        return NextResponse.json(
          { success: false, error: "La IA no devolvió un JSON válido" },
          { status: 500 },
        );
      }

      console.log("Claude extracted data:", extractedData);

      return NextResponse.json({ success: true, data: extractedData });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al procesar";
      console.error(
        `Claude Vision error (attempt ${retries + 1}):`,
        errorMessage,
      );

      const isRetryable =
        errorMessage.includes("rate_limit") ||
        errorMessage.includes("overloaded") ||
        errorMessage.includes("timeout");

      if (isRetryable && retries < MAX_RETRIES) {
        retries++;
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { success: false, error: "Error al procesar después de varios intentos" },
    { status: 500 },
  );
}
