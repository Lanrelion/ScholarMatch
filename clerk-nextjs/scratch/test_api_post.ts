import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function testPost() {
  const userId = 'user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B';
  const payload = {
    firstName: "Lanre",
    lastName: "test",
    nationality: "NG",
    citizenships: ["NG"],
    currentDegree: "MASTERS",
    fieldOfStudy: "Engineering",
    gpa: 3.5,
    gpaScale: 4,
    needsFinancialAid: true,
  };

  try {
    const profile = await db.profile.upsert({
      where: { userId },
      update: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        nationality: payload.nationality,
        citizenships: payload.citizenships,
        currentDegree: payload.currentDegree as any,
        fieldOfStudy: payload.fieldOfStudy,
        gpa: payload.gpa,
        gpaScale: payload.gpaScale,
        needsFinancialAid: payload.needsFinancialAid,
      },
      create: {
        userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        nationality: payload.nationality,
        citizenships: payload.citizenships,
        currentDegree: payload.currentDegree as any,
        fieldOfStudy: payload.fieldOfStudy,
        gpa: payload.gpa,
        gpaScale: payload.gpaScale,
        needsFinancialAid: payload.needsFinancialAid,
      },
    });
    console.log("Profile upsert successful!");
    console.log(profile);
  } catch (err) {
    console.error("Profile upsert failed:", err);
  }
}

testPost().finally(() => db.$disconnect());
