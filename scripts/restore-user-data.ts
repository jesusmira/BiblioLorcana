import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const dumpPath = path.join(process.cwd(), "data-dump.json");
  if (!fs.existsSync(dumpPath)) {
    console.error("No se encontró data-dump.json en " + dumpPath);
    return;
  }

  const data = JSON.parse(fs.readFileSync(dumpPath, "utf-8"));

  console.log("Restaurando UserCards...");
  for (const uc of data.userCards) {
    let cardId = uc.cardId;
    if (cardId === "1-6") {
      cardId = "crd_4c9f441611314185a25b1fca893f6643"; // Hades (Set 1, #6)
    }

    // Verificar si la carta existe
    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      console.warn(`Carta no encontrada: ${cardId}. Buscando por nombre...`);
      const foundCard = await prisma.card.findFirst({
        where: { name: uc.name }
      });
      if (foundCard) {
        cardId = foundCard.id;
      } else {
        console.error(`No se pudo encontrar la carta ${cardId} ni por nombre.`);
        continue;
      }
    }

    await prisma.userCard.upsert({
      where: {
        userId_cardId_isFoiling: {
          userId: uc.userId,
          cardId: cardId,
          isFoiling: uc.isFoiling ?? false,
        },
      },
      update: {
        quantity: uc.quantity,
      },
      create: {
        id: uc.id,
        userId: uc.userId,
        cardId: cardId,
        quantity: uc.quantity,
        isFoiling: uc.isFoiling ?? false,
        createdAt: new Date(uc.createdAt),
      },
    });
  }

  console.log("Restaurando DeckCards...");
  for (const dc of data.deckCards) {
    // Verificar si el mazo existe
    const deck = await prisma.deck.findUnique({
      where: { id: dc.deckId }
    });

    if (!deck) {
      console.error(`Mazo no encontrado: ${dc.deckId}. Saltando carta ${dc.name}`);
      continue;
    }

    // Verificar si la carta existe
    const card = await prisma.card.findUnique({
      where: { id: dc.cardId }
    });

    if (!card) {
      console.warn(`Carta no encontrada en deck: ${dc.cardId} (${dc.name}). Buscando por nombre...`);
      const foundCard = await prisma.card.findFirst({
        where: { name: dc.name }
      });
      if (foundCard) {
        dc.cardId = foundCard.id;
      } else {
        console.error(`No se pudo encontrar la carta ${dc.cardId} ni por nombre.`);
        continue;
      }
    }

    await prisma.deckCard.upsert({
      where: {
        deckId_cardId_isFoiling: {
          deckId: dc.deckId,
          cardId: dc.cardId,
          isFoiling: dc.isFoiling ?? false,
        },
      },
      update: {
        quantity: dc.quantity,
      },
      create: {
        id: dc.id,
        deckId: dc.deckId,
        cardId: dc.cardId,
        quantity: dc.quantity,
        isFoiling: dc.isFoiling ?? false,
      },
    });
  }

  console.log("Restauración completada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
