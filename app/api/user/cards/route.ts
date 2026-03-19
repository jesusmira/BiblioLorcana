import { NextResponse } from "next/server";
import { getSession } from "../../../lib/auth-utils";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userCards = await prisma.userCard.findMany({
    where: { userId: session.userId },
    include: { card: true },
    orderBy: { createdAt: "desc" },
  });

  const cards = userCards.map((uc) => ({
    id: uc.card.id,
    name: uc.card.name,
    version: uc.card.version,
    text: uc.card.text,
    flavor_text: uc.card.flavorText,
    ink: uc.card.ink,
    cost: uc.card.cost,
    rarity: uc.card.rarity,
    type: uc.card.type,
    strength: uc.card.strength,
    willpower: uc.card.willpower,
    lore: uc.card.lore,
    collector_number: uc.card.collectorNumber,
    classifications: uc.card.classifications,
    image_uris: uc.card.imageUris,
    set: uc.card.setName ? { name: uc.card.setName } : null,
  }));

  return NextResponse.json(cards);
}