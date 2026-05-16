import * as dotenv from 'dotenv';
import { PrismaClient, DegreeLevel } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const userId = "test_user_ng";

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: "test_ng@example.com"
    }
  });

  await prisma.profile.upsert({
    where: { userId },
    update: {
      nationality: "NG",
      currentDegree: DegreeLevel.MASTERS,
      fieldOfStudy: "Computer Science",
      gpa: 3.5,
      gpaScale: 4.0,
      needsFinancialAid: true
    },
    create: {
      userId,
      nationality: "NG",
      currentDegree: DegreeLevel.MASTERS,
      fieldOfStudy: "Computer Science",
      gpa: 3.5,
      gpaScale: 4.0,
      needsFinancialAid: true
    }
  });

  console.log("Mock user and profile created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
