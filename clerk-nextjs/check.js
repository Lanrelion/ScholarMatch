require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'match_reviews' AND table_schema = 'public' ORDER BY ordinal_position;`)
  .then(console.log)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
