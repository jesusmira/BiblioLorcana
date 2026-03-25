import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";

const connectionString = process.env.DATABASE_URL || "postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface LorcanaCard {
  card_name: string;
  type: string;
  ink: string;
  cost: number;
  inkwell: boolean;
  strength: number | string;
  willpower: number | string;
  lore: number | string;
  rarity: string;
  flavor_text: string;
  abilities: string[];
  keywords: string[];
  image_url: string;
  collector_number: string;
  promo_set?: string;
  non_propmo_set?: string;
}

interface CardSet {
  set_name: string;
  cards: LorcanaCard[];
}

async function main() {
  const filePath = path.join(__dirname, "locarna_cards.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const data: CardSet[] = JSON.parse(fileContent);

  let importedCount = 0;

  for (const set of data) {
    console.log(`Importing set: ${set.set_name} (${set.cards.length} cards)`);

    for (let i = 0; i < set.cards.length; i++) {
      const card = set.cards[i];
      const uniqueKey = `${card.collector_number}_${card.card_name}`;
      
      const existingCard = await prisma.card.findFirst({
        where: { collectorNumber: card.collector_number },
      });

      if (existingCard && existingCard.name === card.card_name) {
        console.log(`  - ${card.card_name} already exists, skipping`);
        continue;
      }

      const strength = typeof card.strength === "string" ? (card.strength === "" ? null : parseInt(card.strength)) : card.strength;
      const willpower = typeof card.willpower === "string" ? (card.willpower === "" ? null : parseInt(card.willpower)) : card.willpower;
      const lore = typeof card.lore === "string" ? (card.lore === "" ? null : parseInt(card.lore)) : card.lore;
      const cost = typeof card.cost === "string" ? (card.cost === "" ? null : parseInt(card.cost)) : card.cost;
      const ink = Array.isArray(card.ink) ? card.ink[0] : card.ink;

      const abilitiesText = card.abilities?.join("\n") || "";

      await prisma.card.create({
        data: {
          name: card.card_name,
          text: abilitiesText,
          flavorText: card.flavor_text,
          ink: ink,
          cost: cost,
          rarity: card.rarity,
          type: [card.type],
          strength,
          willpower,
          lore,
          collectorNumber: card.collector_number || null,
          classifications: card.keywords || [],
          imageUrl: card.image_url || null,
          promoSet: card.promo_set || null,
          nonPromoSet: card.non_propmo_set || null,
        },
      });

      if (card.promo_set || card.non_propmo_set) {
        console.log(`    promo: ${card.promo_set}, non_promo: ${card.non_propmo_set}`);
      }

      importedCount++;
      console.log(`  + ${card.card_name}`);
    }
  }

  console.log(`\nTotal imported: ${importedCount} cards`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
