import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fix() {
  const userId = "user_3DarUC14pkCGmBmPX4xv2POYWOR"; // From diagnostic sample
  const email = "pedem73108@codoteam.com";

  console.log(`Checking user ${userId}...`);
  
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.log("User missing. Creating...");
    await db.user.create({ data: { id: userId, email } });
    console.log("User created.");
  } else {
    console.log("User already exists.");
  }
}

fix().finally(() => db.$disconnect());
