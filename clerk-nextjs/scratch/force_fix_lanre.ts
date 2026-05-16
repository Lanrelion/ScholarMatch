import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function forceFix() {
  const realUserId = 'user_3DarUC14pkCGmBmPX4xv2POYWOR';
  const email = 'pedem73108@codoteam.com';

  console.log("Force Syncing ID:", realUserId);

  try {
    // 1. Move the email to the REAL ID so there's no conflict
    await db.user.updateMany({
      where: { email },
      data: { email: `old_${Date.now()}@example.com` }
    });

    // 2. Now safely upsert the REAL ID with your email
    await db.user.upsert({
      where: { id: realUserId },
      update: { email },
      create: { id: realUserId, email }
    });

    // 3. Create the profile for the REAL ID
    await db.profile.upsert({
      where: { userId: realUserId },
      update: {
        firstName: "Lanre",
        nationality: "NG",
        currentDegree: "MASTERS",
        fieldOfStudy: "Engineering",
        needsFinancialAid: true
      },
      create: {
        userId: realUserId,
        firstName: "Lanre",
        nationality: "NG",
        currentDegree: "MASTERS",
        fieldOfStudy: "Engineering",
        needsFinancialAid: true
      }
    });

    console.log("SUCCESS: Dashboard redirected cleared. ID is synced.");
  } catch (error) {
    console.error("Force fix failed:", error);
  }
}

forceFix().finally(() => db.$disconnect());
