import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

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

  const fontData = await loadCinzel();
  const titleSize = title.length > 35 ? 52 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 90px",
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

        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(197,138,60,0.12) 0%, transparent 70%)`,
          }}
        />

        {/* Brand badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "36px",
            padding: "7px 20px",
            border: `1px solid rgba(197,138,60,0.35)`,
            borderRadius: "999px",
            background: "rgba(197,138,60,0.07)",
          }}
        >
          <span
            style={{
              color: ACCENT,
              fontSize: "14px",
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
            maxWidth: "900px",
            fontFamily: fontData ? "Cinzel" : "serif",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          style={{
            color: TEXT_MUTED,
            fontSize: "22px",
            marginTop: "28px",
            maxWidth: "780px",
            lineHeight: 1.55,
            fontFamily: "serif",
          }}
        >
          {description}
        </p>

        {/* Disney Lorcana label bottom right */}
        <span
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            color: "rgba(197,138,60,0.4)",
            fontSize: "13px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontFamily: fontData ? "Cinzel" : "serif",
          }}
        >
          Disney Lorcana TCG
        </span>

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
