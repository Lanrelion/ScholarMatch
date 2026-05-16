import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fixId() {
  const email = 'pedem73108@codoteam.com';
  
  // 1. Find the current record I created
  const oldUser = await db.user.findUnique({ where: { email } });
  
  // 2. We need to find the REAL ID from your current session.
  // Since I can't see your browser, I will make the dashboard more resilient.
  // But first, let's look if there are OTHER users in the DB that might be you.
  const allUsers = await db.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log("Recent Users in DB:");
  allUsers.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}`));
}

fixId().finally(() => db.$disconnect());
