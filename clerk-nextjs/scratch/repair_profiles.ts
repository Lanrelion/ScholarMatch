import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function repair() {
  console.log("Repairing profiles with missing default values...");
  
  const results = await db.profile.updateMany({
    where: {
      OR: [
        { workExperienceYears: null },
        { countryOfStudy: null }
      ]
    },
    data: {
      workExperienceYears: 0,
      countryOfStudy: "ANY" // Use a placeholder that won't break the string type
    }
  });

  console.log(`Repaired ${results.count} profiles.`);
}

repair().finally(() => db.$disconnect());
