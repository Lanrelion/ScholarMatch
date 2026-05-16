import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function findZombie() {
  const userId = 'user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B';
  
  // 1. Check profiles
  const profile = await db.profile.findFirst({
    where: { userId }
  });
  
  console.log("Profile for ID:", profile ? "EXISTS" : "MISSING");
  if (profile) console.log(JSON.stringify(profile, null, 2));

  // 2. Check if the user record exists
  const user = await db.user.findUnique({
    where: { id: userId }
  });
  console.log("User for ID:", user ? "EXISTS" : "MISSING");
}

findZombie().finally(() => db.$disconnect());
