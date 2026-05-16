import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fix() {
  const userId = 'user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B';
  const email = 'pedem73108@codoteam.com';

  console.log("Detecting schema issues for user:", userId);

  try {
    // 1. Let's see if there is a 'profile' that is NOT associated with the user but has the same firstName or something (unlikely)
    // 2. Let's try to CREATE the profile with ABSOLUTE DEFAULT values for every field to see if it works.
    const profile = await db.profile.create({
      data: {
        userId: userId,
        firstName: "Lanre",
        lastName: "test",
        nationality: "NG",
        currentDegree: "MASTERS",
        fieldOfStudy: "Engineering",
        needsFinancialAid: false, // Default to false
        citizenships: ["NG"]
      }
    });

    console.log("SUCCESS: Manual profile creation worked. ID:", profile.id);
  } catch (error: any) {
    console.error("FAILURE CODE:", error.code);
    console.error("FAILURE MESSAGE:", error.message);
  }
}

fix().finally(() => db.$disconnect());
