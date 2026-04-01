import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.LORCAST_API_BASE || "https://api.lorcast.com/v0";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ set: string; number: string }> }
) {
  const { set, number } = await params;
  
  console.log("Buscando carta en Lorcast:", `${API_BASE}/cards/${set}/${number}`);
  
  try {
    const response = await axios.get(`${API_BASE}/cards/${set}/${number}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Respuesta Lorcast:", response.status);
    console.log("Datos de carta:", response.data?.name, response.data?.image_uris ? "tiene imagen" : "sin imagen");
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("Error Lorcast:", error);
    return NextResponse.json(
      { error: "Error al obtener la carta" },
      { status: 500 }
    );
  }
}