import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const API_BASE = process.env.LORCAST_API_BASE ?? "https://api.lorcast.com/v0";

export async function GET(
  _req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const { cardId } = params;
  const idx = cardId.indexOf("-");
  if (idx === -1) return new NextResponse("Invalid cardId", { status: 400 });

  const setCode = cardId.slice(0, idx);
  const number = cardId.slice(idx + 1);

  const cardRes = await fetch(`${API_BASE}/cards/${setCode}/${number}`).catch(() => null);
  if (!cardRes?.ok) return new NextResponse("Card not found", { status: 404 });

  const cardData = await cardRes.json().catch(() => null);
  const imageUrl: string | null =
    cardData?.image_uris?.digital?.large ??
    cardData?.image_uris?.digital?.normal ??
    null;

  if (!imageUrl) return new NextResponse("No image", { status: 404 });

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return new NextResponse("Upstream error", { status: 502 });

    const buffer = Buffer.from(await res.arrayBuffer());

    // Fondo: carta escalada a 1200x630, desenfocada y oscurecida
    const background = await sharp(buffer)
      .resize(1200, 630, { fit: "cover", position: "top" })
      .blur(18)
      .modulate({ brightness: 0.4 })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Carta principal: centrada, ajustada a la altura
    const cardResized = await sharp(buffer)
      .resize(null, 610, { fit: "inside" })
      .jpeg({ quality: 92 })
      .toBuffer();

    const result = await sharp(background)
      .composite([{ input: cardResized, gravity: "center" }])
      .jpeg({ quality: 88 })
      .toBuffer();

    return new NextResponse(new Uint8Array(result), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch {
    return new NextResponse("Image processing failed", { status: 500 });
  }
}
