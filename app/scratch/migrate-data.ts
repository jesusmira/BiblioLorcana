import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from 'fs';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Fetching users...');
  const users = await prisma.user.findMany();
  console.log(`Fetched ${users.length} users.`);

  console.log('Fetching user cards...');
  const userCards = await prisma.userCard.findMany();
  console.log(`Fetched ${userCards.length} user cards.`);

  console.log('Fetching starter decks...');
  const starterDecks = await prisma.starterDeck.findMany();
  console.log(`Fetched ${starterDecks.length} starter decks.`);

  console.log('Fetching starter deck cards...');
  const starterDeckCards = await prisma.starterDeckCard.findMany();
  console.log(`Fetched ${starterDeckCards.length} starter deck cards.`);

  console.log('Fetching decks...');
  const decks = await prisma.deck.findMany();
  console.log(`Fetched ${decks.length} decks.`);

  console.log('Fetching deck cards...');
  const deckCards = await prisma.deckCard.findMany();
  console.log(`Fetched ${deckCards.length} deck cards.`);

  const data = {
    users,
    userCards,
    starterDecks,
    starterDeckCards,
    decks,
    deckCards
  };

  fs.writeFileSync('data-dump.json', JSON.stringify(data, null, 2));
  console.log('Data exported to data-dump.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });


