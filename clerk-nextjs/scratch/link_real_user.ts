import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function link() {
  const realUserId = 'user_3DarUC14pkCGmBmPX4xv2POYWOR';
  const email = 'pedem73108@codoteam.com';

  console.log("Linking real Clerk ID to Lanre's profile:", realUserId);

  try {
    // 1. Ensure the User record exists for the REAL ID
    await db.user.upsert({
      where: { id: realUserId },
      update: { email },
      create: { id: realUserId, email }
    });

    // 2. Create/Update the profile for the REAL ID
    const profile = await db.profile.upsert({
      where: { userId: realUserId },
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
        userId: realUserId,
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

    console.log("SUCCESS: Real Clerk ID is now linked and profile is complete!");
    console.log("Profile ID:", profile.id);
  } catch (error) {
    console.error("Link failed:", error);
  }
}

link().finally(() => db.$disconnect());
