import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function forceCreate() {
  const users = [
    { id: "user_3DarUC14pkCGmBmPX4xv2POYWOR", email: "pedem73108@codoteam.com" },
    { id: "user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B", email: "old_1778534598273@example.com" }
  ];

  for (const u of users) {
    console.log(`Ensuring user ${u.id} exists...`);
    await db.user.upsert({
      where: { id: u.id },
      update: { email: u.email },
      create: { id: u.id, email: u.email }
    });
  }
  console.log("Done.");
}

forceCreate().finally(() => db.$disconnect());
