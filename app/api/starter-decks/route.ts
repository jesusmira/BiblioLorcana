import { NextResponse } from "next/server";
import { prisma } from "../../src/lib/prisma";

export async function GET() {
  try {
    // Usamos include para traer las cartas relacionadas
    const decks = await prisma.starterDeck.findMany({
      include: {
        cards: {
          include: {
            card: true,
          },
        },
      },
    });

    // Mapear al formato que espera la UI
    // Usamos casting a any temporalmente si los tipos de Prisma no se han actualizado en el IDE
    const formattedDecks = (decks as any[]).map((deck) => ({
      ...deck,
      cards: (deck.cards || [])
        .filter((sc: any) => sc.card)
        .map((sc: any) => ({
          id: `sd-${sc.card.set}-${sc.card.number}`,
          cardId: `${sc.card.set}-${sc.card.number}`,
          name: sc.card.name,
          quantity: sc.quantity,
          ink: sc.card.ink,
          type: sc.card.type,
          cost: sc.card.cost,
          rarity: sc.card.rarity,
          subtypes: sc.card.subtypes,
          abilities: sc.card.abilities,
          imageUrl: sc.card.imageUrl,
          strength: sc.card.strength,
          willpower: sc.card.willpower,
          lore: sc.card.lore,
          flavorText: sc.card.flavorText,
        })),
    }));

    return NextResponse.json(formattedDecks);
  } catch (error) {
    console.error("Error fetching starter decks from DB:", error);
    return NextResponse.json(
      { error: "Error fetching starter decks" },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { message: "Endpoint configured. Use database to save starter decks." },
    { status: 200 },
  );
}
