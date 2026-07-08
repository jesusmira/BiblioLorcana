import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import { fixLorcastSymbols } from "../app/src/lib/lorcastSymbolFix";
import { getOverride } from "../app/src/lib/lorcastOverrides";

// Reutilizamos la lógica de instanciación de Prisma con el adaptador de pg para Prisma 7
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in .env");
  }
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function syncCards() {
  console.log("🚀 Iniciando sincronización de cartas con Lorcast...");

  try {
    // 1. Obtener todos los sets
    console.log("📡 Obteniendo lista de sets...");
    const setsResponse = await axios.get("https://api.lorcast.com/v0/sets");
    const sets = setsResponse.data.results;

    if (!Array.isArray(sets)) {
      console.error("❌ Error: No se pudo obtener la lista de sets.");
      return;
    }

    console.log(
      `📚 Se han encontrado ${sets.length} sets. Sincronizando cartas...`,
    );

    let totalCardsSynced = 0;

    for (const set of sets) {
      console.log(`🔍 Sincronizando set: ${set.name} (${set.code})...`);

      try {
        const cardsResponse = await axios.get(
          `https://api.lorcast.com/v0/sets/${set.code}/cards`,
        );
        const cards = cardsResponse.data;

        if (!Array.isArray(cards)) {
          console.warn(`⚠️ Advertencia: No hay cartas en el set ${set.code}.`);
          continue;
        }

        for (const cardData of cards) {
          const cardId = cardData.id;

          const override = getOverride(set.code, cardData.collector_number || '');
          const fixedText = override || fixLorcastSymbols(cardData.text);
          const fixedFlavorText = fixLorcastSymbols(cardData.flavor_text);

          await prisma.card.upsert({
            where: { id: cardId },
            update: {
              set: set.code,
              number: cardData.collector_number || "0",
              name: cardData.name || "Sin nombre",
              ink: cardData.ink || "Neutral",
              cost: cardData.cost ?? 0,
              type: Array.isArray(cardData.type)
                ? cardData.type[0]
                : cardData.type || "Character",
              rarity: cardData.rarity || "Common",
              subtypes: Array.isArray(cardData.classifications)
                ? cardData.classifications.join(", ")
                : null,
              abilities: fixedText || null,
              imageUrl:
                cardData.image_uris?.digital?.large ||
                cardData.image_uris?.digital?.normal ||
                null,
              strength: cardData.strength ?? null,
              willpower: cardData.willpower ?? null,
              lore: cardData.lore ?? null,
              flavorText: fixedFlavorText || null,
            },
            create: {
              id: cardId,
              set: set.code,
              number: cardData.collector_number || "0",
              name: cardData.name || "Sin nombre",
              ink: cardData.ink || "Neutral",
              cost: cardData.cost ?? 0,
              type: Array.isArray(cardData.type)
                ? cardData.type[0]
                : cardData.type || "Character",
              rarity: cardData.rarity || "Common",
              subtypes: Array.isArray(cardData.classifications)
                ? cardData.classifications.join(", ")
                : null,
              abilities: fixedText || null,
              imageUrl:
                cardData.image_uris?.digital?.large ||
                cardData.image_uris?.digital?.normal ||
                null,
              strength: cardData.strength ?? null,
              willpower: cardData.willpower ?? null,
              lore: cardData.lore ?? null,
              flavorText: fixedFlavorText || null,
            },
          });
          totalCardsSynced++;
        }
        console.log(
          `✅ Set ${set.code} sincronizado (${cards.length} cartas).`,
        );
      } catch (error) {
        console.error(`❌ Error sincronizando el set ${set.code}:`, error);
      }
    }

    console.log(
      `🎉 Sincronización completada. Total de cartas en BD: ${totalCardsSynced}`,
    );
  } catch (error) {
    console.error("❌ Error general durante la sincronización:", error);
  } finally {
    await prisma.$disconnect();
  }
}

syncCards();
