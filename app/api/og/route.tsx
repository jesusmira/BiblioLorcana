import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const ACCENT = "#C58A3C";
const ACCENT_LIGHT = "#E8B56A";
const BG = "#0a0a0a";
const TEXT_MUTED = "#9ca3af";

async function loadCinzel(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      }
    ).then((r) => r.text());

    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
    if (!match) return null;

    return fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Archivo del Reino";
  const description =
    searchParams.get("description") ??
    "La herramienta definitiva para coleccionistas de Disney Lorcana.";
  const cardImageUrl = searchParams.get("image");

  const fontData = await loadCinzel();
  const titleSize = title.length > 35 ? 52 : 64;

  let cardImageData: string | null = null;
  if (cardImageUrl) {
    try {
      const res = await fetch(cardImageUrl);
      const raw = Buffer.from(await res.arrayBuffer());
      const jpeg = await sharp(raw).jpeg({ quality: 85 }).toBuffer();
      cardImageData = `data:image/jpeg;base64,${jpeg.toString("base64")}`;
    } catch {
      cardImageData = null;
    }
  }


  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: BG,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
          }}
        />

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
          }}
        />

        {/* Card image (left) */}
        {cardImageData && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "380px",
              height: "100%",
              padding: "30px 20px 30px 40px",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardImageData}
              alt={title}
              style={{
                height: "100%",
                width: "auto",
                borderRadius: "12px",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {/* Text (right) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: cardImageData ? "60px 60px 60px 30px" : "80px 90px",
            flex: 1,
          }}
        >
          {/* Brand badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "28px",
              padding: "7px 20px",
              border: `1px solid rgba(197,138,60,0.35)`,
              borderRadius: "999px",
              background: "rgba(197,138,60,0.07)",
            }}
          >
            <span
              style={{
                color: ACCENT,
                fontSize: "13px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontFamily: fontData ? "Cinzel" : "serif",
              }}
            >
              Archivo del Reino
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              color: ACCENT,
              fontSize: `${titleSize}px`,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.1,
              fontFamily: fontData ? "Cinzel" : "serif",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              color: TEXT_MUTED,
              fontSize: "20px",
              marginTop: "24px",
              lineHeight: 1.55,
              fontFamily: "serif",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: "Cinzel", data: fontData, weight: 700, style: "normal" }]
        : [],
    }
  );
}
