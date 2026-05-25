import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      return new NextResponse("Failed to fetch image", { status: 502 });
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // Resize card to fit left side, then extend canvas to 1200x630
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
    return new NextResponse("Image conversion failed", { status: 500 });
  }
}
