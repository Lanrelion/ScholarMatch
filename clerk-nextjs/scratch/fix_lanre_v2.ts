import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fix() {
  const email = 'pedem73108@codoteam.com';
  const user = await db.user.findUnique({ where: { email } });
  
  if (user) {
    // 1. Ensure a profile exists for this ID
    await db.profile.upsert({
      where: { userId: user.id },
      update: {
        firstName: "Lanre",
        nationality: "NG",
        currentDegree: "MASTERS",
        fieldOfStudy: "Engineering",
        needsFinancialAid: true
      },
      create: {
        userId: user.id,
        firstName: "Lanre",
        nationality: "NG",
        currentDegree: "MASTERS",
        fieldOfStudy: "Engineering",
        needsFinancialAid: true
      }
    });
    console.log("Profile verified for ID:", user.id);
  }
}

fix().finally(() => db.$disconnect());
