import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';
import { scoreScholarship } from '../lib/matching/scoreScholarship';

async function inspectMatches() {
  const userId = "user_3DarUC14pkCGmBmPX4xv2POYWOR";
  const profile = await db.profile.findUnique({ where: { userId } });
  
  if (!profile) {
    console.log("Profile missing!");
    return;
  }

  console.log("Current Profile Data:");
  console.log(`- Nationality: ${profile.nationality}`);
  console.log(`- Degree: ${profile.currentDegree}`);
  console.log(`- Country of Study: ${profile.countryOfStudy}`);
  console.log(`- Experience: ${profile.workExperienceYears}`);

  const allSch = await db.scholarship.findMany({ where: { isActive: true } });
  console.log(`\nFound ${allSch.length} active scholarships in DB.`);

  console.log("\nMatching Logic Simulation:");
  allSch.forEach(s => {
    const { matchScore } = scoreScholarship(s, profile as any);
    
    // Hard filter logic check (from API)
    const natMatch = s.eligibleNationalities.length === 0 || s.eligibleNationalities.includes(profile.nationality!);
    const degMatch = s.eligibleDegrees.length === 0 || s.eligibleDegrees.includes(profile.currentDegree!);
    
    console.log(`- [${matchScore.toFixed(2)}] ${s.title}`);
    console.log(`    Hard Filters: Nat:${natMatch ? "PASS" : "FAIL"} | Deg:${degMatch ? "PASS" : "FAIL"}`);
  });
}

inspectMatches().finally(() => db.$disconnect());
