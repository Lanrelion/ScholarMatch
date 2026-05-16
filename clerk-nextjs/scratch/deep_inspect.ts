import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function deep() {
  console.log("--- DEEP DB INSPECTION ---");
  const allSaved = await db.savedScholarship.findMany({ include: { user: true } });
  console.log(`Total Saved in DB: ${allSaved.length}`);
  allSaved.forEach(s => {
    console.log(`- Saved ID: ${s.id} | User: ${s.userId} | Sch: ${s.scholarshipId}`);
  });

  const allUsers = await db.user.findMany();
  console.log(`\nAll Users in DB (${allUsers.length}):`);
  allUsers.forEach(u => console.log(`- ${u.id}`));
}

deep().finally(() => db.$disconnect());
