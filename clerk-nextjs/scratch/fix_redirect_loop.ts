import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fix() {
  const userId = 'user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B';
  
  // 1. Double check the profile
  const profile = await db.profile.findUnique({
    where: { userId }
  });

  if (profile) {
    console.log("Current Profile Fields:");
    console.log("- nationality:", profile.nationality);
    console.log("- currentDegree:", profile.currentDegree);
    
    // If nationality or degree is missing, the API throws error and redirects
    if (!profile.nationality || !profile.currentDegree) {
      console.log("FIXING: Profile was missing mandatory fields.");
      await db.profile.update({
        where: { userId },
        data: {
          nationality: profile.nationality || "NG",
          currentDegree: profile.currentDegree || "MASTERS",
          fieldOfStudy: profile.fieldOfStudy || "Engineering",
          firstName: profile.firstName || "Lanre",
          lastName: profile.lastName || "test"
        }
      });
      console.log("Profile updated successfully.");
    } else {
      console.log("Profile is technically complete. Dashboard should work.");
    }
  } else {
    console.log("CRITICAL: Profile record is missing for this ID.");
  }
}

fix().finally(() => db.$disconnect());
