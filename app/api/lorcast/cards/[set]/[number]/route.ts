import { NextResponse } from "next/server";

const API_BASE = process.env.LORCAST_API_BASE || "https://api.lorcast.com/v0";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ set: string; number: string }> }
) {
  const { set, number } = await params;
  
  try {
    const response = await fetch(`${API_BASE}/cards/${set}/${number}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Carta no encontrada" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener la carta" },
      { status: 500 }
    );
  }
}