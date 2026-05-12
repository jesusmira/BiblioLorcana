import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

// Reutilizamos la lógica de instanciación de Prisma con el adaptador de pg para Prisma 7
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in .env');
  }
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

const STARTER_DECKS_DATA = [
  {
    id: "principiante",
    name: "Ámbar + Amatista",
    set: "The First Chapter",
    inks: ["Amber", "Amethyst"],
    description: "El mazo perfecto para principiantes. Cartas reconocibles como Mickey Mouse y Elsa que te ayudan a entender las mecánicas básicas del juego.",
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
    description: "Para quienes les gusta atacar sin parar. Jugadas rápidas y finishes agresivos que toman desprevenido al rival.",
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
    description: "Defensa sólida y control de recursos. Resiste las embestidas del enemigo y gana a largo plazo.",
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
    description: "Estrategias de bounce con Merlin y Madam Mim. Un mazo divertido con muchas cartas de bajo coste.",
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

async function main() {
  console.log('🚀 Iniciando migración de mazos iniciales...');

  for (const deckData of STARTER_DECKS_DATA) {
    console.log(`📦 Procesando mazo: ${deckData.name}...`);

    // 1. Upsert del mazo
    const starterDeck = await prisma.starterDeck.upsert({
      where: { id: deckData.id },
      update: {
        name: deckData.name,
        set: deckData.set,
        inks: deckData.inks,
        description: deckData.description,
        profile: deckData.profile,
      },
      create: {
        id: deckData.id,
        name: deckData.name,
        set: deckData.set,
        inks: deckData.inks,
        description: deckData.description,
        profile: deckData.profile,
      },
    });

    // 2. Procesar cartas del mazo
    for (const cardRef of deckData.cards) {
      const [setCode, collectorNumber] = cardRef.cardId.split('-');
      
      // Buscar el ID real de la carta en la tabla Card
      const card = await prisma.card.findUnique({
        where: {
          set_number: {
            set: setCode,
            number: collectorNumber,
          },
        },
      });

      if (!card) {
        console.warn(`⚠️ Advertencia: No se encontró la carta ${setCode}-${collectorNumber} en la BD.`);
        continue;
      }

      // Upsert de la relación StarterDeckCard
      await prisma.starterDeckCard.upsert({
        where: {
          // Nota: Como no tenemos un unique en (deckId, cardId) para StarterDeckCard en el esquema actual,
          // lo buscaremos de forma manual o simplemente crearemos si no existe.
          // En el esquema actual no hay unique constraint en StarterDeckCard para evitar duplicados.
          // Deberíamos añadirlo.
          id: `${starterDeck.id}-${card.id}`, // Usaremos un ID predecible para el upsert
        },
        update: {
          quantity: cardRef.quantity,
        },
        create: {
          id: `${starterDeck.id}-${card.id}`,
          deckId: starterDeck.id,
          cardId: card.id,
          quantity: cardRef.quantity,
        },
      });
    }

    console.log(`✅ Mazo ${deckData.name} migrado con éxito.`);
  }

  console.log('🎉 Migración de mazos iniciales completada.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la migración:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
