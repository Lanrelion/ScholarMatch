import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function reset() {
  const userId = "user_3DarUC14pkCGmBmPX4xv2POYWOR";
  console.log(`--- EMERGENCY RESET FOR USER: ${userId} ---`);

  // 1. Delete all existing saves for this user to avoid unique constraint conflicts
  const deletedSaves = await db.savedScholarship.deleteMany({ where: { userId } });
  console.log(`Deleted ${deletedSaves.count} stale save records.`);

  // 2. Ensure the User record is 100% correct
  const email = "pedem73108@codoteam.com";
  await db.user.upsert({
    where: { id: userId },
    update: { email },
    create: { id: userId, email }
  });
  console.log(`Verified User record for ${email}.`);

  // 3. Ensure Profile is 100% filled with valid data
  await db.profile.upsert({
    where: { userId },
    update: {
      firstName: "Test",
      lastName: "User",
      nationality: "NG",
      currentDegree: "UNDERGRADUATE",
      fieldOfStudy: "Computer Science",
      gpa: 3.8,
      needsFinancialAid: true,
      workExperienceYears: 1,
      countryOfStudy: "CA"
    },
    create: {
      userId,
      firstName: "Test",
      lastName: "User",
      nationality: "NG",
      currentDegree: "UNDERGRADUATE",
      fieldOfStudy: "Computer Science",
      gpa: 3.8,
      needsFinancialAid: true,
      workExperienceYears: 1,
      countryOfStudy: "CA"
    }
  });
  console.log("Verified Profile record with complete data.");

  // 4. Test a direct DB save now
  try {
    const sch = await db.scholarship.findFirst({ where: { isActive: true } });
    if (sch) {
      await db.savedScholarship.create({
        data: {
          userId,
          scholarshipId: sch.id,
          matchScore: 0.99,
          matchBreakdown: {},
          reminderEmail: email
        }
      });
      console.log(`Verified DB WRITE capability: Successfully saved ${sch.title}.`);
      // Delete it immediately so the user can test the UI
      await db.savedScholarship.deleteMany({ where: { userId, scholarshipId: sch.id } });
      console.log("Cleanup: Removed test save. Database is now READY for UI interaction.");
    }
  } catch (e: any) {
    console.error("DB WRITE FAILED:", e.message);
  }
}

reset().finally(() => db.$disconnect());
