import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function testLogic() {
  const userId = 'test_ng_3';
  const profile = await db.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Profile missing");

  const scholarships = await db.scholarship.findMany({
    where: {
      isActive: true,
      OR: [{ deadline: null }, { deadline: { gt: new Date() } }],
      AND: [
        {
          OR: [
            { eligibleNationalities: { isEmpty: true } },
            { eligibleNationalities: { has: profile.nationality } }
          ]
        },
        {
          OR: [
            { eligibleDegrees: { isEmpty: true } },
            { eligibleDegrees: { has: profile.currentDegree } }
          ]
        }
      ]
    }
  });

  console.log(`Found ${scholarships.length} scholarships`);
  scholarships.forEach(s => {
    console.log(`- ${s.title} (Deadline: ${s.deadline})`);
  });
}

testLogic().finally(() => db.$disconnect());
