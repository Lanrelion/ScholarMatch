import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fix() {
  const userId = "user_3DarUC14pkCGmBmPX4xv2POYWOR";
  console.log(`Setting degree to MASTERS for ${userId} to unlock more results...`);
  await db.profile.update({
    where: { userId },
    data: { currentDegree: "MASTERS" }
  });
  console.log("Success.");
}

fix().finally(() => db.$disconnect());
