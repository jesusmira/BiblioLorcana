import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const STARTER_DECKS_DATA = [
  {
    id: "ruby-amethyst-control",
    name: "Ruby & Amethyst Control",
    set: "Metajuego Competitivo",
    inks: ["Amethyst", "Ruby"],
    description:
      "El mazo de control por excelencia. Combina los motores de rebote de Madame Mim y Merlín con el poder destructivo de Be Prepared para dominar las partidas largas.",
    profile: "Control",
    cards: [
      { quantity: 4, cardId: "1-36" },
      { quantity: 4, cardId: "1-52" },
      { quantity: 4, cardId: "2-49" },
      { quantity: 4, cardId: "2-54" },
      { quantity: 4, cardId: "2-46" },
      { quantity: 4, cardId: "2-50" },
      { quantity: 4, cardId: "1-64" },
      { quantity: 4, cardId: "1-49" },
      { quantity: 4, cardId: "2-52" },
      { quantity: 4, cardId: "2-51" },
      { quantity: 4, cardId: "1-114" },
      { quantity: 4, cardId: "2-110" },
      { quantity: 4, cardId: "2-60" },
      { quantity: 4, cardId: "1-128" },
      { quantity: 4, cardId: "1-113" },
    ],
  },
  {
    id: "amber-steel-songs",
    name: "Amber & Steel Songs",
    set: "Metajuego Competitivo",
    inks: ["Amber", "Steel"],
    description:
      "Un mazo potente basado en cantar canciones potentes gratis. Usa a Ariel y Cinderella para cantar Grab Your Sword y Let the Storm Rage On, manteniendo el control del tablero mientras puntúas rápido.",
    profile: "Canciones",
    cards: [
      { quantity: 4, cardId: "2-3" },
      { quantity: 4, cardId: "1-9" },
      { quantity: 4, cardId: "1-22" },
      { quantity: 4, cardId: "1-20" },
      { quantity: 4, cardId: "1-2" },
      { quantity: 4, cardId: "1-18" },
      { quantity: 4, cardId: "1-23" },
      { quantity: 4, cardId: "2-176" },
      { quantity: 4, cardId: "1-194" },
      { quantity: 4, cardId: "1-200" },
      { quantity: 4, cardId: "2-199" },
      { quantity: 4, cardId: "1-195" },
      { quantity: 4, cardId: "1-198" },
      { quantity: 4, cardId: "1-193" },
      { quantity: 4, cardId: "2-177" },
    ],
  },
  {
    id: "sapphire-steel-ramp",
    name: "Sapphire & Steel Ramp",
    set: "Metajuego Competitivo",
    inks: ["Sapphire", "Steel"],
    description:
      "Un mazo basado en acelerar el tintero temprano para invocar poderosas amenazas. Usa Fishbone Quill y One Jump Ahead para obtener recursos rápidamente, y a Hiram Flaversham para robar cartas devorando Pawpsicles.",
    profile: "Rampa",
    cards: [
      { quantity: 4, cardId: "2-169" },
      { quantity: 4, cardId: "1-164" },
      { quantity: 4, cardId: "1-168" },
      { quantity: 4, cardId: "2-149" },
      { quantity: 4, cardId: "1-142" },
      { quantity: 4, cardId: "1-159" },
      { quantity: 4, cardId: "1-147" },
      { quantity: 4, cardId: "1-154" },
      { quantity: 4, cardId: "1-174" },
      { quantity: 4, cardId: "1-197" },
      { quantity: 4, cardId: "1-194" },
      { quantity: 4, cardId: "2-199" },
      { quantity: 4, cardId: "1-195" },
      { quantity: 4, cardId: "1-198" },
      { quantity: 4, cardId: "1-193" },
    ],
  },
  {
    id: "emerald-steel-tempo",
    name: "Emerald & Steel Tempo",
    set: "Metajuego Competitivo",
    inks: ["Emerald", "Steel"],
    description:
      "Un mazo muy dinámico que castiga al rival descartando su mano mientras controla la mesa. Usa a Flynn Rider y Kuzco para presionar con Lore evasivo, y a Tinker Bell y canciones de acero para limpiar amenazas.",
    profile: "Tempo",
    cards: [
      { quantity: 4, cardId: "1-73" },
      { quantity: 4, cardId: "2-81" },
      { quantity: 4, cardId: "1-74" },
      { quantity: 4, cardId: "2-73" },
      { quantity: 4, cardId: "2-74" },
      { quantity: 4, cardId: "1-71" },
      { quantity: 4, cardId: "1-81" },
      { quantity: 4, cardId: "1-84" },
      { quantity: 4, cardId: "1-86" },
      { quantity: 4, cardId: "1-98" },
      { quantity: 4, cardId: "1-95" },
      { quantity: 4, cardId: "1-194" },
      { quantity: 4, cardId: "1-193" },
      { quantity: 4, cardId: "1-200" },
      { quantity: 4, cardId: "1-198" },
    ],
  },
];

async function getCardIdByCollector(
  collectorNumber: string,
): Promise<string | null> {
  try {
    const card = await prisma.card.findFirst({
      where: {
        set: "1",
        number: collectorNumber,
      },
    });
    return card?.id || null;
  } catch {
    return null;
  }
}

async function seedStarterDecks() {
  console.log("Sembrando mazos competitivos...");

  for (const deckData of STARTER_DECKS_DATA) {
    const existingDeck = await prisma.starterDeck.findUnique({
      where: { id: deckData.id },
    });

    if (existingDeck) {
      console.log(`Borrando mazo existente: ${deckData.id}`);
      await prisma.starterDeck.delete({ where: { id: deckData.id } });
    }

    const cardsData = [];
    for (const { quantity, cardId } of deckData.cards) {
      const [setNum, cardNum] = cardId.split("-");

      const card = await prisma.card.findUnique({
        where: {
          set_number: {
            set: setNum,
            number: cardNum,
          },
        },
      });

      if (card) {
        cardsData.push({
          cardId: card.id,
          quantity,
        });
      } else {
        console.warn(
          `⚠️ Advertencia: No se encontró la carta ${setNum}-${cardNum} en la base de datos.`,
        );
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
      `Creado mazo competitivo: ${deckData.id} - ${deckData.name} (${cardsData.length} cartas únicas)`,
    );
  }

  console.log("¡Mazos competitivos sembrados correctamente!");
}

async function main() {
  console.log("Iniciando carga de semilla...");

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
  console.log("Usuario de prueba creado/verificado:", user.email);

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
        create: {
          userId: user.id,
          cardId,
          quantity: 1,
          isFoiling: false,
        },
      });
      console.log(`Carta añadida ${i + 1}: ${names[i]} (${cardId})`);
    } else {
      console.log(
        `Error al buscar la carta: ${names[i]} (#${collectorNumbers[i]})`,
      );
    }
  }

  await seedStarterDecks();

  console.log("¡Semilla completada con éxito!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante la semilla:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
