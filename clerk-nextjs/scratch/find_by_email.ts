import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function findByEmail() {
  const email = 'pedem73108@codoteam.com';
  
  const user = await db.user.findUnique({
    where: { email },
    include: { profile: true }
  });
  
  if (user) {
    console.log("MATCH FOUND:");
    console.log(`- User ID in DB: ${user.id}`);
    console.log(`- Email in DB: ${user.email}`);
    console.log(`- Profile Status: ${user.profile ? "EXISTS" : "MISSING"}`);
  } else {
    console.log("No user found with that email. Checking recent users...");
    const recent = await db.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    recent.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}`));
  }
}

findByEmail().finally(() => db.$disconnect());
