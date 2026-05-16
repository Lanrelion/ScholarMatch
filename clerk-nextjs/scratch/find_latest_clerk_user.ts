import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function findRealUser() {
  // Let's find the absolute latest user created in the DB
  // This is likely you, created via the Clerk webhook
  const latest = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  console.log("Recent Database Users:");
  latest.forEach(u => {
    console.log(`- ID: ${u.id}, Email: ${u.email}, Created: ${u.createdAt}`);
  });
}

findRealUser().finally(() => db.$disconnect());
