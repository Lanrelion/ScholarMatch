import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function forceSave() {
  const userId = "user_3DarUC14pkCGmBmPX4xv2POYWOR";
  const scholarshipId = "cmp1ui0580000qoulen0juxhy"; // Mastercard Toronto
  
  console.log(`Attempting to force-save scholarship ${scholarshipId} for user ${userId}...`);

  try {
    const saved = await db.savedScholarship.create({
      data: {
        userId,
        scholarshipId,
        matchScore: 0.95,
        matchBreakdown: {},
        reminderEmail: "pedem73108@codoteam.com"
      }
    });
    console.log("SUCCESS: Saved via backend script.", saved.id);
  } catch (err: any) {
    console.error("FAILED to save via backend:", err.message);
    if (err.meta) console.error("Prisma Meta:", err.meta);
  }
}

forceSave().finally(() => db.$disconnect());
