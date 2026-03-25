import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ collectorNumber: string }> }
) {
  const { collectorNumber } = await params;
  
  try {
    const card = await prisma.card.findFirst({
      where: { collectorNumber },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Carta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al buscar la carta" },
      { status: 500 }
    );
  }
}
