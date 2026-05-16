import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function main() {
  const userId = 'test_ng_3';
  
  await db.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: 'test_ng_3@example.com' }
  });

  await db.profile.upsert({
    where: { userId },
    update: {
      nationality: 'NG',
      currentDegree: 'MASTERS',
      fieldOfStudy: 'Engineering',
      gpa: 3.5,
      gpaScale: 4.0,
      needsFinancialAid: true,
      firstName: 'Test',
      lastName: 'Nigerian'
    },
    create: {
      userId,
      nationality: 'NG',
      currentDegree: 'MASTERS',
      fieldOfStudy: 'Engineering',
      gpa: 3.5,
      gpaScale: 4.0,
      needsFinancialAid: true,
      firstName: 'Test',
      lastName: 'Nigerian'
    }
  });

  console.log("Test user created!");
}

main().finally(() => db.$disconnect());
