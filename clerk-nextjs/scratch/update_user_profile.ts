import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function update() {
  // Update the primary active user found in diagnostic
  const userId = "user_3DarUC14pkCGmBmPX4xv2POYWOR"; 

  console.log(`Updating profile for ${userId}...`);
  
  await db.profile.update({
    where: { userId },
    data: {
      workExperienceYears: 1,
      countryOfStudy: "CA"
    }
  });

  console.log("Success: Profile updated with 1 year experience and Canada as target country.");
}

update().finally(() => db.$disconnect());
