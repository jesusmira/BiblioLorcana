import { NextResponse } from "next/server";

async function callOcrApi(fullBase64: string, apiKey: string): Promise<Response> {
  const formData = new FormData();
  formData.append("base64Image", fullBase64);
  formData.append("language", "eng");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "1");

  return fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      "apikey": apiKey,
    },
    body: formData,
  });
}

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

    const fullBase64 = `data:${mimeType};base64,${imageData}`;

    console.log("MIME type:", mimeType);
    console.log("Base64 length:", imageData.length);

    if (imageData.length < 100) {
      return NextResponse.json(
        { success: false, error: "Imagen demasiado pequeña" },
        { status: 400 }
      );
    }

    const maxSize = 1.5 * 1024 * 1024;
    if (imageData.length > maxSize) {
      return NextResponse.json(
        { success: false, error: "La imagen es muy grande. Usa una imagen más pequeña." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OCRSPACE_API_KEY;
    if (!apiKey) {
      console.log("No API key found");
      return NextResponse.json(
        { success: false, error: "API key de OCR no configurada" },
        { status: 500 }
      );
    }

    console.log("Sending to OCR.space...");

    let data: Record<string, unknown>;
    let response: Response;
    let retries = 0;
    const maxRetries = 2;

    do {
      response = await callOcrApi(fullBase64, apiKey);
      data = await response.json();

      if (data.IsErroredOnProcessing && (data.ErrorMessage as string[])?.[0]?.includes("Timed out")) {
        retries++;
        console.log(`OCR timeout, retry ${retries}/${maxRetries}...`);
        if (retries < maxRetries) {
          await new Promise(r => setTimeout(r, 2000));
        }
      } else {
        break;
      }
    } while (retries < maxRetries);

    console.log("OCR response:", JSON.stringify(data).substring(0, 500));

    if (response?.status === 403) {
      return NextResponse.json(
        { success: false, error: "API key inválida o cuenta bloqueada. Prueba más tarde." },
        { status: 403 }
      );
    }

    if (data.IsErroredOnProcessing) {
      const errorMsg = (data.ErrorMessage as string[])?.[0] || data.ResolvedError || "Error en OCR";
      console.log("OCR error:", errorMsg);

      if (typeof errorMsg === "string" && errorMsg.includes("clipboard")) {
        return NextResponse.json(
          { success: false, error: "La imagen no es compatible. Intenta con otra foto más clara." },
          { status: 400 }
        );
      }

      if (typeof errorMsg === "string" && errorMsg.includes("Timed out")) {
        return NextResponse.json(
          { success: false, error: "El servicio de OCR está tardando demasiado. Intenta con una foto más pequeña o más clara." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const parsedText = (data.ParsedResults as Array<{ ParsedText?: string }>)?.[0]?.ParsedText?.trim();

    if (!parsedText) {
      return NextResponse.json(
        { success: false, error: "No se detectó texto en la imagen. Asegúrate de que el número de carta sea visible." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, text: parsedText });
  } catch (error) {
    console.error("OCR catch error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error al procesar" },
      { status: 500 }
    );
  }
}
