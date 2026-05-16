import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function clear() {
  const userId = "user_3DarUC14pkCGmBmPX4xv2POYWOR";
  console.log(`Clearing all saved items for ${userId} to reset state...`);
  const deleted = await db.savedScholarship.deleteMany({ where: { userId } });
  console.log(`Deleted ${deleted.count} items.`);
}

clear().finally(() => db.$disconnect());
