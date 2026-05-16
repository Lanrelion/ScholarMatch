import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function clear() {
  const email = 'pedem73108@codoteam.com';
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    await db.profile.deleteMany({ where: { userId: user.id } });
    console.log("Deleted profile for Lanre. He can now restart onboarding.");
  }
}

clear().finally(() => db.$disconnect());
