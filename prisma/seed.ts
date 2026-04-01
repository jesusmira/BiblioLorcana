import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const API_BASE = "https://api.lorcast.com/v0";

async function getCardIdByCollector(collectorNumber: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/sets/1/cards?collector_number=${collectorNumber}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.results?.[0]?.id || null;
  } catch {
    return null;
  }
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

  const collectorNumbers = ["51", "84", "195", "146", "61", "164", "2", "137", "202", "173"];
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
        where: { userId_cardId: { userId: user.id, cardId } },
        update: {},
        create: { userId: user.id, cardId, quantity: 1 },
      });
      console.log(`Added card ${i + 1}: ${names[i]} (${cardId})`);
    } else {
      console.log(`Failed to find card: ${names[i]} (#${collectorNumbers[i]})`);
    }
  }

  console.log("Seed completed!");
}

main()
  .finally(() => prisma.$disconnect());
