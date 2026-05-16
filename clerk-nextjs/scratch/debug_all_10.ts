import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function debug() {
  const userId = 'user_3DarUC14pkCGmBmPX4xv2POYWOR';
  const now = new Date();

  console.log("DEBUGGING SCHOLARSHIP MATCHES...");
  console.log("Current Date:", now.toISOString());

  const profile = await db.profile.findUnique({ where: { userId } });
  if (!profile || !profile.nationality) {
    console.log("ERROR: Profile or nationality missing");
    return;
  }

  const all = await db.scholarship.findMany();
  console.log(`\nFound ${all.length} total scholarships in DB.`);
  
  all.forEach(s => {
    const isPast = s.deadline && s.deadline < now;
    const nationalityMatch = s.eligibleNationalities.includes(profile.nationality as string);
    const degreeMatch = s.eligibleDegrees.includes(profile.currentDegree as any);
    
    console.log(`\n- [${s.title}]`);
    console.log(`  * Deadline: ${s.deadline ? s.deadline.toISOString() : 'NULL'} (Expired: ${isPast})`);
    console.log(`  * Nationality Match: ${nationalityMatch}`);
    console.log(`  * Degree Match: ${degreeMatch}`);
  });
}

debug().finally(() => db.$disconnect());
