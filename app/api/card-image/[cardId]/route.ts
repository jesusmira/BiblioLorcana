import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const { cardId } = params;
  const idx = cardId.indexOf("-");
  if (idx === -1) return new NextResponse("Invalid cardId", { status: 400 });

  const setCode = cardId.slice(0, idx);
  const number = cardId.slice(idx + 1);

  const card = await prisma.card.findFirst({ where: { set: setCode, number } });
  if (!card?.imageUrl) return new NextResponse("No image", { status: 404 });

  try {
    const res = await fetch(card.imageUrl);
    if (!res.ok) return new NextResponse("Upstream error", { status: 502 });

    const buffer = Buffer.from(await res.arrayBuffer());

    const cardResized = await sharp(buffer)
      .resize(450, 610, { fit: "inside" })
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await sharp({
      create: { width: 1200, height: 630, channels: 3, background: { r: 10, g: 10, b: 10 } },
    })
      .composite([{ input: cardResized, gravity: "west" }])
      .jpeg({ quality: 85 })
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
