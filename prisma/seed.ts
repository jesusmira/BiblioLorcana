import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import axios from "axios";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const API_BASE = "https://api.lorcast.com/v0";

const STARTER_DECKS_DATA = [
  {
    id: "principiante",
    name: "Ámbar + Amatista",
    set: "The First Chapter",
    inks: ["Amber", "Amethyst"],
    description:
      "El mazo perfecto para principiantes. Cartas reconocibles como Mickey Mouse y Elsa que te ayudan a entender las mecánicas básicas del juego.",
    profile: "Principiante",
    cards: [
      { quantity: 2, cardId: "1-1" },
      { quantity: 2, cardId: "1-3" },
      { quantity: 1, cardId: "1-6" },
      { quantity: 2, cardId: "1-7" },
      { quantity: 2, cardId: "1-11" },
      { quantity: 3, cardId: "1-12" },
      { quantity: 3, cardId: "1-13" },
      { quantity: 1, cardId: "1-14" },
      { quantity: 3, cardId: "1-22" },
      { quantity: 3, cardId: "1-25" },
      { quantity: 2, cardId: "1-26" },
      { quantity: 2, cardId: "1-27" },
      { quantity: 1, cardId: "1-30" },
      { quantity: 3, cardId: "1-32" },
      { quantity: 1, cardId: "1-37" },
      { quantity: 2, cardId: "1-38" },
      { quantity: 1, cardId: "1-43" },
      { quantity: 2, cardId: "1-45" },
      { quantity: 2, cardId: "1-46" },
      { quantity: 3, cardId: "1-47" },
      { quantity: 2, cardId: "1-49" },
      { quantity: 1, cardId: "1-51" },
      { quantity: 3, cardId: "1-52" },
      { quantity: 2, cardId: "1-53" },
      { quantity: 3, cardId: "1-54" },
      { quantity: 1, cardId: "1-55" },
      { quantity: 3, cardId: "1-57" },
      { quantity: 2, cardId: "1-60" },
      { quantity: 3, cardId: "1-64" },
    ],
  },
  {
    id: "agresivo",
    name: "Esmeralda + Rubí",
    set: "The First Chapter",
    inks: ["Emerald", "Ruby"],
    description:
      "Para quienes les gusta atacar sin parar. Jugadas rápidas y finishes agresivos que toman desprevenido al rival.",
    profile: "Agresivo",
    cards: [
      { quantity: 2, cardId: "1-69" },
      { quantity: 1, cardId: "1-72" },
      { quantity: 2, cardId: "1-73" },
      { quantity: 3, cardId: "1-79" },
      { quantity: 1, cardId: "1-80" },
      { quantity: 2, cardId: "1-81" },
      { quantity: 3, cardId: "1-86" },
      { quantity: 3, cardId: "1-87" },
      { quantity: 3, cardId: "1-89" },
      { quantity: 2, cardId: "1-91" },
      { quantity: 3, cardId: "1-95" },
      { quantity: 2, cardId: "1-96" },
      { quantity: 1, cardId: "1-97" },
      { quantity: 2, cardId: "1-100" },
      { quantity: 2, cardId: "1-102" },
      { quantity: 1, cardId: "1-104" },
      { quantity: 3, cardId: "1-105" },
      { quantity: 2, cardId: "1-106" },
      { quantity: 2, cardId: "1-108" },
      { quantity: 1, cardId: "1-112" },
      { quantity: 3, cardId: "1-120" },
      { quantity: 3, cardId: "1-121" },
      { quantity: 2, cardId: "1-122" },
      { quantity: 3, cardId: "1-124" },
      { quantity: 1, cardId: "1-125" },
      { quantity: 3, cardId: "1-130" },
      { quantity: 2, cardId: "1-132" },
      { quantity: 2, cardId: "1-135" },
    ],
  },
  {
    id: "control",
    name: "Zafiro + Acero",
    set: "The First Chapter",
    inks: ["Sapphire", "Steel"],
    description:
      "Defensa sólida y control de recursos. Resiste las embestidas del enemigo y gana a largo plazo.",
    profile: "Control",
    cards: [
      { quantity: 3, cardId: "1-138" },
      { quantity: 1, cardId: "1-139" },
      { quantity: 3, cardId: "1-140" },
      { quantity: 2, cardId: "1-145" },
      { quantity: 2, cardId: "1-146" },
      { quantity: 2, cardId: "1-148" },
      { quantity: 3, cardId: "1-150" },
      { quantity: 1, cardId: "1-151" },
      { quantity: 1, cardId: "1-154" },
      { quantity: 2, cardId: "1-155" },
      { quantity: 1, cardId: "1-158" },
      { quantity: 3, cardId: "1-161" },
      { quantity: 2, cardId: "1-164" },
      { quantity: 3, cardId: "1-166" },
      { quantity: 2, cardId: "1-169" },
      { quantity: 2, cardId: "1-172" },
      { quantity: 3, cardId: "1-174" },
      { quantity: 2, cardId: "1-179" },
      { quantity: 2, cardId: "1-181" },
      { quantity: 2, cardId: "1-182" },
      { quantity: 3, cardId: "1-184" },
      { quantity: 1, cardId: "1-185" },
      { quantity: 2, cardId: "1-187" },
      { quantity: 1, cardId: "1-189" },
      { quantity: 2, cardId: "1-190" },
      { quantity: 3, cardId: "1-197" },
      { quantity: 1, cardId: "1-198" },
      { quantity: 2, cardId: "1-199" },
      { quantity: 2, cardId: "1-200" },
    ],
  },
  {
    id: "combo",
    name: "Amatista + Acero",
    set: "Rise of the Floodborn",
    inks: ["Amethyst", "Steel"],
    description:
      "Estrategias de bounce con Merlin y Madam Mim. Un mazo divertido con muchas cartas de bajo coste.",
    profile: "Combo",
    cards: [
      { quantity: 3, cardId: "2-37" },
      { quantity: 2, cardId: "2-38" },
      { quantity: 3, cardId: "2-43" },
      { quantity: 3, cardId: "2-45" },
      { quantity: 1, cardId: "2-46" },
      { quantity: 3, cardId: "2-49" },
      { quantity: 2, cardId: "2-50" },
      { quantity: 3, cardId: "2-51" },
      { quantity: 1, cardId: "2-52" },
      { quantity: 1, cardId: "2-53" },
      { quantity: 2, cardId: "2-54" },
      { quantity: 2, cardId: "1-63" },
      { quantity: 2, cardId: "2-63" },
      { quantity: 2, cardId: "2-171" },
      { quantity: 2, cardId: "2-174" },
      { quantity: 2, cardId: "2-176" },
      { quantity: 2, cardId: "2-179" },
      { quantity: 2, cardId: "2-182" },
      { quantity: 3, cardId: "2-184" },
      { quantity: 1, cardId: "2-185" },
      { quantity: 2, cardId: "2-186" },
      { quantity: 2, cardId: "1-187" },
      { quantity: 3, cardId: "2-191" },
      { quantity: 1, cardId: "2-194" },
      { quantity: 2, cardId: "2-195" },
      { quantity: 1, cardId: "2-196" },
      { quantity: 3, cardId: "2-197" },
      { quantity: 2, cardId: "2-202" },
      { quantity: 2, cardId: "2-203" },
    ],
  },
];

async function getCardIdByCollector(
  collectorNumber: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `${API_BASE}/sets/1/cards?collector_number=${collectorNumber}`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.results?.[0]?.id || null;
  } catch {
    return null;
  }
}

async function fetchCardFromLorcast(setNum: string, cardNum: string) {
  try {
    const response = await axios.get(`${API_BASE}/cards/${setNum}/${cardNum}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching card ${setNum}-${cardNum}:`, error);
    return null;
  }
}

async function seedStarterDecks() {
  console.log("Seeding starter decks...");

  for (const deckData of STARTER_DECKS_DATA) {
    const existingDeck = await prisma.starterDeck.findUnique({
      where: { id: deckData.id },
    });

    if (existingDeck) {
      console.log(`Deleting existing deck: ${deckData.id}`);
      await prisma.starterDeck.delete({ where: { id: deckData.id } });
    }

    const cardsData = [];
    for (const { quantity, cardId } of deckData.cards) {
      const [setNum, cardNum] = cardId.split("-");
      const cardData = await fetchCardFromLorcast(setNum, cardNum);

      if (cardData) {
        cardsData.push({
          cardId,
          name: cardData.name || cardId,
          quantity,
          ink: cardData.ink || "?",
          type: cardData.type?.[0] || "Character",
          cost: cardData.cost ?? 0,
          rarity: cardData.rarity || "Common",
          subtypes: cardData.type?.slice(1).join(", ") || null,
          abilities: cardData.abilities || cardData.text || null,
          imageUrl:
            cardData.image_uris?.digital?.large ||
            cardData.image_uris?.digital?.normal ||
            null,
        });
      } else {
        cardsData.push({
          cardId,
          name: cardId,
          quantity,
          ink: "?",
          type: "Character",
          cost: 0,
          rarity: "Common",
          subtypes: null,
          abilities: null,
          imageUrl: null,
        });
      }
    }

    await prisma.starterDeck.create({
      data: {
        id: deckData.id,
        name: deckData.name,
        set: deckData.set,
        inks: deckData.inks,
        description: deckData.description,
        profile: deckData.profile,
        cards: {
          create: cardsData,
        },
      },
    });

    console.log(
      `Created starter deck: ${deckData.id} - ${deckData.name} (${cardsData.length} unique cards)`,
    );
  }

  console.log("Starter decks seeded successfully!");
}

async function main() {
  console.log("Starting seed...");

  const hashedPassword = await bcrypt.hash("Test1234!", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@lorcana.es" },
    update: {},
    create: {
      name: "Test Lorcana",
      email: "test@lorcana.es",
      password: hashedPassword,
      role: "USER",
    },
  });
  console.log("Created user:", user.email);

  const collectorNumbers = [
    "51",
    "84",
    "195",
    "146",
    "61",
    "164",
    "2",
    "137",
    "202",
    "173",
  ];
  const names = [
    "Mickey Mouse - Wayward Sorcerer",
    "Elsa - Snow Queen",
    "Simba - Fierce Pride",
    "Maleficent - Mistress of Evil",
    "Ariel - Excited Diver",
    "Aladdin - Diamond in the Rough",
    "Mickey Mouse - True Sorcerer",
    "Hades - Lord of the Underworld",
    "Tinker Bell - Tiny Tactician",
    "Beast - Tragic Hero",
  ];

  for (let i = 0; i < collectorNumbers.length; i++) {
    const cardId = await getCardIdByCollector(collectorNumbers[i]);
    if (cardId) {
      await prisma.userCard.upsert({
        where: {
          userId_cardId_isFoiling: {
            userId: user.id,
            cardId,
            isFoiling: false,
          },
        },
        update: {},
        create: { userId: user.id, cardId, quantity: 1, isFoiling: false },
      });
      console.log(`Added card ${i + 1}: ${names[i]} (${cardId})`);
    } else {
      console.log(`Failed to find card: ${names[i]} (#${collectorNumbers[i]})`);
    }
  }

  await seedStarterDecks();

  console.log("Seed completed!");
}

main().finally(() => prisma.$disconnect());
