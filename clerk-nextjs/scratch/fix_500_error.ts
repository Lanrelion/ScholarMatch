import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fix() {
  const userId = 'user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B';
  const email = 'pedem73108@codoteam.com';

  console.log("Fixing 500 error for user:", userId);

  try {
    // 1. Ensure the User exists (syncing email and ID)
    const user = await db.user.upsert({
      where: { id: userId },
      update: { email },
      create: { id: userId, email }
    });

    // 2. Create a VALID profile manually
    const profile = await db.profile.upsert({
      where: { userId },
      update: {
        firstName: "Lanre",
        lastName: "test",
        nationality: "NG",
        citizenships: ["NG"],
        currentDegree: "MASTERS",
        fieldOfStudy: "Engineering",
        needsFinancialAid: true,
        gpa: 3.5,
        gpaScale: 4
      },
      create: {
        userId,
        firstName: "Lanre",
        lastName: "test",
        nationality: "NG",
        citizenships: ["NG"],
        currentDegree: "MASTERS",
        fieldOfStudy: "Engineering",
        needsFinancialAid: true,
        gpa: 3.5,
        gpaScale: 4
      }
    });

    console.log("SUCCESS: User and Profile fixed in DB.");
    console.log("Profile ID:", profile.id);
  } catch (error) {
    console.error("FAILURE in manual fix:", error);
  }
}

fix().finally(() => db.$disconnect());
