import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function inspect() {
  console.log("--- DB INSPECTION ---");
  const users = await db.user.findMany({ take: 10 });
  const scholarships = await db.scholarship.findMany({ take: 10, select: { id: true, title: true } });
  const saved = await db.savedScholarship.findMany({ take: 10 });

  console.log("\nUSERS IN DB:");
  users.forEach(u => console.log(`- ${u.id} (${u.email})`));

  console.log("\nSCHOLARSHIPS IN DB:");
  scholarships.forEach(s => console.log(`- ${s.id}: ${s.title}`));

  console.log("\nSAVED ITEMS IN DB:");
  saved.forEach(s => console.log(`- User: ${s.userId} | Scholarship: ${s.scholarshipId}`));
}

inspect().finally(() => db.$disconnect());
